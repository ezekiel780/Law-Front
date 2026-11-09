<template>
  <div>
    <utils-modal v-show="modalState" @close="close">
      <template v-slot:header>
        <span class="font-medium text-[#08085E]">Pay for subscription</span>
      </template>

      <template v-slot:body>
        <div class="space-y-5">
          <div class="rounded-lg bg-[#F7F7FB] p-4 text-sm text-[#545454]">
            <p class="font-semibold text-[#1A1A1A]">{{ subscriptionTitle }}</p>
            <p class="mt-1">
              {{ isMissingPayment ? 'No payment attempt has been recorded for this subscription. A payment will be created and linked to this subscription.' : 'Previous payment attempts remain preserved for audit. You may continue with the same payment method or select another available method; a different method creates a separate payment attempt.' }}
            </p>
          </div>

          <div v-if="issueMessage" class="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
            <strong>Customer Service issue raised.</strong> {{ issueMessage }}
          </div>

          <div v-if="loadingMethods" class="py-6 text-center text-sm text-gray-500">Loading payment methods…</div>
          <div v-else-if="errorMessage" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</div>
          <div v-else class="space-y-3">
            <p class="font-medium text-[#08085E]">Select payment method</p>
            <label
              v-for="method in availablePaymentMethods"
              :key="method.id || method.slug || method.title"
              class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-white p-3 shadow-sm transition hover:border-[#3939A2]"
              :class="selectedPaymentMethodId === method.id ? 'border-[#08085E] ring-2 ring-[#08085E]/10' : 'border-gray-200'"
            >
              <utils-payment-method-visual :method="method" />
              <input
                v-model="selectedPaymentMethodId"
                type="radio"
                :value="method.id"
                class="h-5 w-5 shrink-0 border-gray-300 text-[#08085E] focus:ring-[#3939A2]"
              />
            </label>
          </div>

          <utils-button
            class="w-full bg-[#08085E] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#3939A2]"
            :on-click="proceedToPayment"
            :button-state="isPaying"
          >
            Continue with selected payment method
          </utils-button>
        </div>
      </template>
    </utils-modal>
  </div>
</template>

<script>
const PENDING_SUBSCRIPTION_PAYMENT_KEY = 'nwlr_pending_subscription_payment'

export default {
  props: {
    modalState: { type: Boolean, default: false },
    subscription: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      paymentMethods: [],
      selectedPaymentMethodId: null,
      loadingMethods: false,
      isPaying: false,
      errorMessage: '',
      issueMessage: '',
    }
  },
  computed: {
    subscriptionTitle() {
      return this.subscription?.title || `Subscription #${this.subscription?.id || ''}`
    },
    isMissingPayment() {
      return this.subscription?.payment_record_state === 'missing' || !this.subscription?.payment_id
    },
    availablePaymentMethods() {
      return this.paymentMethods
    },
  },
  watch: {
    modalState: {
      immediate: true,
      handler(open) {
        if (open) this.loadPaymentMethods()
      },
    },
  },
  methods: {
    close() {
      if (this.isPaying) return
      this.$emit('close')
    },
    callbackUrl() {
      const url = new URL(window.location.href)
      const protocol = url.host.includes('localhost') ? 'http:' : 'https:'
      return `${protocol}//${url.host}/dashboard/my-subscription`
    },
    async loadPaymentMethods() {
      this.errorMessage = ''
      this.loadingMethods = true
      try {
        this.paymentMethods = await this.$api.subscription.getPaymentMethods()
        if (!this.availablePaymentMethods.length) {
          this.errorMessage = 'No payment method is currently available.'
          this.selectedPaymentMethodId = null
          return
        }

        if (!this.selectedPaymentMethodId || !this.availablePaymentMethods.some((method) => String(method.id) === String(this.selectedPaymentMethodId))) {
          const previousMethod = this.availablePaymentMethods.find((method) => String(method.id) === String(this.subscription?.payment_method_id || ''))
          this.selectedPaymentMethodId = (previousMethod || this.availablePaymentMethods[0]).id
        }
      } catch (error) {
        this.errorMessage = this.$errorHandler.setAndParse(error).message
      } finally {
        this.loadingMethods = false
      }
    },
    rememberPendingPayment(payment) {
      if (typeof window === 'undefined' || !window.sessionStorage) return
      window.sessionStorage.setItem(
        PENDING_SUBSCRIPTION_PAYMENT_KEY,
        JSON.stringify({
          reference: payment.reference,
          external_reference: payment.external_reference || null,
          gateway: payment.gateway || null,
          subscription_id: this.subscription.id,
          auto_renew_requested: Boolean(this.subscription.auto_renew),
          created_at: Date.now(),
        })
      )
    },
    async proceedToPayment() {
      if (!this.selectedPaymentMethodId) {
        this.errorMessage = 'Select a payment method.'
        return
      }

      this.isPaying = true
      this.errorMessage = ''
      try {
        const payment = await this.$api.subscription.initializeExistingSubscriptionPayment(
          this.subscription.id,
          {
            payment_method_id: this.selectedPaymentMethodId,
            callback_url: this.callbackUrl(),
          }
        )

        if (String(payment?.status || '').toLowerCase() === 'paid') {
          const accessGranted = Boolean(payment?.subscription_access_granted)
          this.$notify({
            type: accessGranted ? 'success' : 'warning',
            title: 'Payment confirmed',
            text: accessGranted
              ? 'The payment is confirmed and the subscription entitlements are available.'
              : 'The payment is confirmed, but subscription access is not available. Customer Service must review it; do not make another payment.',
            duration: accessGranted ? 5000 : 9000,
          })
          this.$emit('completed')
          return
        }

        this.rememberPendingPayment(payment)

        if (!payment?.authorization_url) {
          const gateway = String(payment?.gateway || '').toLowerCase()
          if (gateway !== 'manual') {
            throw new Error('The payment provider did not return a checkout URL. Recheck the payment or try again.')
          }

          this.$notify({
            type: 'success',
            title: 'Manual payment created',
            text: `${payment?.message || 'Manual payment is awaiting administrative confirmation.'} Reference: ${payment?.reference}.`,
            duration: 9000,
          })
          this.$emit('completed')
          return
        }

        window.location.assign(payment.authorization_url)
      } catch (error) {
        const parsed = this.$errorHandler.setAndParse(error)
        if (parsed.type === 'payment_initialization_failed' || parsed.details?.issue_already_raised) {
          const reference = parsed.details?.support_ticket_reference
          this.issueMessage = parsed.message
          this.errorMessage = ''
          this.$notify({
            type: 'warning',
            title: reference ? `Payment issue ${reference} raised` : 'Payment issue raised',
            text: `${parsed.message} You can select another payment method here and try again.`,
            duration: 10000,
          })
          this.$emit('issue-raised', parsed.details || {})
        } else {
          this.errorMessage = parsed.message
          this.$notify({ type: 'error', title: 'Payment could not be started', text: parsed.message, duration: 5000 })
        }
      } finally {
        this.isPaying = false
      }
    },
  },
}
</script>
