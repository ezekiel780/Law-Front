<template>
  <div>
    <utils-modal @close="toggleModal" v-show="modalState">
      <template v-slot:header>
        <span class="flex gap-4 items-center cursor-pointer">
          <utils-svg-loader
            icon="filter-icon"
            class="cursor-pointer"
            color="#08085E"
          />
          <span class="font-medium text-[#08085E]">Invoice</span>
        </span>
      </template>

      <!-- Body slot -->
      <template v-slot:body>
        <div>
          <div v-if="plan" class="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected plan</p>
                <p class="mt-1 font-semibold text-slate-900">{{ plan.title }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-500">Estimated subscription total</p>
                <p class="mt-1 font-bold text-[#08085E]">{{ currencySymbol }}{{ $helper.formatAmount(estimatedTotal) }}</p>
              </div>
            </div>

            <div v-if="seatSelectionEnabled" class="mt-4">
              <label class="block text-sm font-medium text-slate-700" for="corporate-seat-count">
                Number of seats
              </label>
              <div class="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  class="h-10 w-10 rounded-lg border border-slate-300 bg-white text-lg font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="seatCount <= minimumSeats"
                  @click="changeSeatCount(-1)"
                >
                  −
                </button>
                <input
                  id="corporate-seat-count"
                  v-model.number="seatCount"
                  type="number"
                  :min="minimumSeats"
                  class="h-10 w-28 rounded-lg border border-slate-300 bg-white px-3 text-center font-semibold text-slate-900"
                  @change="normalizeSeatCount"
                  @blur="normalizeSeatCount"
                />
                <button
                  type="button"
                  class="h-10 w-10 rounded-lg border border-slate-300 bg-white text-lg font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  @click="changeSeatCount(1)"
                >
                  +
                </button>
              </div>
              <p class="mt-2 text-xs leading-5 text-slate-500">
                Minimum {{ minimumSeats }} seats. Choose the total number of seats you want to purchase.
                Price is {{ currencySymbol }}{{ $helper.formatAmount(unitAmount) }} per seat.
              </p>
            </div>

            <p v-else-if="isCorporatePlan" class="mt-3 text-xs leading-5 text-slate-500">
              This corporate plan includes {{ minimumSeats }} seats.
            </p>
          </div>


          <div v-if="issueMessage" class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <p class="font-semibold">Customer Service issue raised automatically.</p>
            <p class="mt-1">{{ issueMessage }}</p>
            <p class="mt-1">You may select another payment method below and try again. Do not create another issue for this failed attempt; use the existing issue to follow up.</p>
          </div>

          <div class="font-medium text-[#08085E]">Select Payment Method</div>
          <div class="flex flex-col gap-4 my-3 relative">
            <label
              v-for="method in paymentMethods"
              :key="method.id || method.slug || method.title"
              class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#3939A2] hover:shadow-md"
              :class="[
                selectedPaymentMethod === method.title
                  ? 'border-[#08085E] ring-2 ring-[#08085E]/10'
                  : 'border-gray-200',
                $v.selectedPaymentMethod.$error
                  ? 'border-[#F05252] bg-[#FDF2F2]'
                  : '',
              ]"
              @click="setPaymentMethod(method.title)"
            >
              <utils-payment-method-visual :method="method" />
              <input
                type="radio"
                name="hs-radio-vertical-group"
                class="h-5 w-5 shrink-0 border-gray-300 text-[#08085E] focus:ring-[#3939A2]"
                :checked="method.title === selectedPaymentMethod"
                :value="method.title"
              />
            </label>
            <div
              class="absolute top-4 right-0 cursor-pointer"
              v-show="$v.selectedPaymentMethod.$error"
            >
              <i class="ri-information-fill text-[#E02424]" />
            </div>
            <utils-input-validation
              :field="$v.selectedPaymentMethod"
              :field-name="'Payment Method'"
              v-show="$v.selectedPaymentMethod.$error"
            />
          </div>
          <div class="flex flex-col gap-3">
            <div
              class="flex items-center justify-start cursor-pointer hover:bg[#babcd4] gap-1.5 relative"
            >
              <input
                type="checkbox"
                class="shrink-0 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500"
                v-model="subscriptionEnabled"
              />
              <div>
                <p class="font-medium text-gray-800">Enable automatic renewal</p>
                <p class="mt-1 text-xs leading-5 text-gray-500">
                  This becomes active only when the payment provider returns a
                  reusable card authorization. NWLR never stores your card number
                  or CVV.
                </p>
              </div>
            </div>

            <!-- <p>
              Visit the subscriptions page to enable auto-renewal if you do not
              wish to renew your subscription
            </p> -->
            <utils-button
              class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-3 px-5 w-full mt-4"
              :on-click="createSubscription"
              :button-state="isPaying"
            >
              Proceed To Payment
            </utils-button>
          </div>
        </div>
      </template>
    </utils-modal>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

const PENDING_SUBSCRIPTION_PAYMENT_KEY = 'nwlr_pending_subscription_payment'
export default {
  props: {
    modalState: {
      type: Boolean,
      default: false,
    },
    planId: {
      type: Number,
      default: 1,
    },
    amount: {
      type: [String, Number],
      default: '1000',
    },
    plan: {
      type: Object,
      default: null,
    },
    paymentMethods: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loadingStates: {
        Paystack: false,
        Flutterwave: false,
      },
      isPaying: false,
      selectedPaymentMethod: null,
      agreeToTerms: null,
      subscriptionEnabled: false,
      seatCount: 1,
      issueMessage: '',
    }
  },
  computed: {
    minimumSeats() {
      return Math.max(1, Number(this.plan?.min_seats || this.plan?.no_of_users || 1))
    },
    isCorporatePlan() {
      return String(this.plan?.category || '').trim().toLowerCase() === 'corporate'
    },
    seatSelectionEnabled() {
      if (!this.isCorporatePlan) return false
      return Boolean(
        this.plan?.seat_selection_enabled !== undefined
          ? this.plan.seat_selection_enabled
          : this.plan?.allow_user_input
      )
    },
    unitAmount() {
      return Number(this.plan?.amount || this.amount || 0)
    },
    estimatedTotal() {
      const seats = this.seatSelectionEnabled ? this.seatCount : this.minimumSeats
      return this.unitAmount * Math.max(this.minimumSeats, Number(seats || this.minimumSeats))
    },
    currencySymbol() {
      const currency = String(this.plan?.currency || 'NGN').toUpperCase()
      if (currency === 'NGN') return '₦'
      if (currency === 'USD') return '$'
      if (currency === 'GBP') return '£'
      if (currency === 'EUR') return '€'
      return `${currency} `
    },
  },
  watch: {
    modalState(value) {
      if (value) {
        this.initializeSeatCount()
        this.issueMessage = ''
      }
    },
    plan: {
      immediate: true,
      handler() {
        this.initializeSeatCount()
      },
    },
  },
  validations() {
    return {
      selectedPaymentMethod: { required },
      // agreeToTerms: { required },
    }
  },
  methods: {
    initializeSeatCount() {
      this.seatCount = this.minimumSeats
    },
    normalizeSeatCount() {
      let seats = Number.parseInt(this.seatCount, 10)
      if (!Number.isFinite(seats)) seats = this.minimumSeats
      seats = Math.max(this.minimumSeats, seats)
      this.seatCount = seats
      return seats
    },
    changeSeatCount(delta) {
      this.seatCount = Number(this.seatCount || this.minimumSeats) + Number(delta || 0)
      this.normalizeSeatCount()
    },
    toggleModal() {
      this.$emit('toggle-modal')
    },
    async subscribeNow(planId) {
      try {
        const response = await this.$api.subscription.getPlans()
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
        this.$notify({
          type: 'error',
          title: 'Error',
          text: errorResponse.message,
          duration: 5000,
        })
      }
    },
    setPaymentMethod(method) {
      this.selectedPaymentMethod = method
    },
    resetData() {
      this.loadingStates = {
        Paystack: false,
        Flutterwave: false,
      }
      this.isPaying = false
      this.selectedPaymentMethod = null
      this.agreeToTerms = null
      this.subscriptionEnabled = false
    },
    getCallbackUrl() {
      let callback = ''
      const url = new URL(window.location.href)
      const host = url.host
      if (host.includes('localhost')) {
        callback = `http://${host}/dashboard/my-subscription`
      } else {
        callback = `https://${host}/dashboard/my-subscription`
      }
      return callback
    },
    rememberPendingPayment(payment) {
      if (typeof window === 'undefined' || !window.sessionStorage) return

      window.sessionStorage.setItem(
        PENDING_SUBSCRIPTION_PAYMENT_KEY,
        JSON.stringify({
          reference: payment.reference,
          external_reference: payment.external_reference || null,
          gateway: payment.gateway || this.selectedPaymentMethod,
          subscription_id: payment.subscription_id || null,
          auto_renew_requested: Boolean(
            payment?.data?.subscription?.auto_renew || this.subscriptionEnabled
          ),
          created_at: Date.now(),
        })
      )
    },
    async createSubscription() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.resetData()
        return false
      }
      const selectedSeats = this.seatSelectionEnabled
        ? this.normalizeSeatCount()
        : this.minimumSeats

      this.isPaying = true
      try {
        const {
          data: { success },
        } = await this.$api.subscription.createSubscription({
          plan_id: this.planId,
          no_of_users: selectedSeats,
          amount: Number(this.estimatedTotal),
          type: this.selectedPaymentMethod.toLowerCase(),
          callback_url: this.getCallbackUrl(),
          recurring: this.subscriptionEnabled,
        })
        this.rememberPendingPayment(success)

        if (!success.payment_url) {
          const gateway = String(success.gateway || '').toLowerCase()
          if (gateway !== 'manual') {
            throw new Error(
              'This payment method does not provide an online checkout link.'
            )
          }

          this.$notify({
            type: 'success',
            title: 'Manual payment created',
            text: `${success.message || 'Manual payment is awaiting administrative confirmation.'} Reference: ${success.reference}.`,
            duration: 9000,
          })
          this.toggleModal()
          return true
        }

        window.location.assign(success.payment_url)
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
        if (errorResponse.type === 'payment_initialization_failed' || errorResponse.details?.issue_already_raised) {
          this.issueMessage = errorResponse.message
          const reference = errorResponse.details?.support_ticket_reference
          this.$notify({
            type: 'warning',
            title: reference ? `Payment issue ${reference} raised` : 'Payment issue raised',
            text: `${errorResponse.message} Select another payment method if you wish to retry now.`,
            duration: 10000,
          })
        } else {
          this.$notify({
            type: 'error',
            title: 'Payment could not be started',
            text: errorResponse.message,
            duration: 5000,
          })
        }
      } finally {
        this.isPaying = false
      }
    },
  },
}
</script>
