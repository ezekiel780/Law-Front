<template>
  <div class="space-y-6 p-5">
    <div v-if="loading" class="rounded-xl border border-slate-200 p-5 text-sm">
      Loading subscriptions and plan-change records…
    </div>

    <div
      v-if="errorMessage"
      class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-900"
      role="alert"
    >
      {{ errorMessage }}
    </div>

    <div class="flex gap-3"><button type="button" class="text-sm font-semibold text-[#08085E] underline" :disabled="loading || quoting" @click="resetReview">Reset review form</button></div>
    <template v-if="!loading">
      <div class="grid gap-5 lg:grid-cols-2">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Current subscription</span>
          <select
            v-model="sourceSubscriptionId"
            class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            @change="onSourceChanged"
          >
            <option value="">Select an active subscription</option>
            <option
              v-for="subscription in activeSubscriptions"
              :key="subscription.id"
              :value="String(subscription.id)"
            >
              {{ subscriptionProductLabel(subscription) }} — {{ subscription.title }} — expires
              {{ formatDate(subscription.current_period_end) }}
            </option>
          </select>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Target plan</span>
          <select
            v-model="targetPlanId"
            class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            :disabled="!selectedSource"
          >
            <option value="">Select a replacement plan</option>
            <option
              v-for="plan in compatiblePlans"
              :key="plan.id"
              :value="String(plan.id)"
            >
              {{ planProductLabel(plan) }} — {{ plan.title }} — ₦{{ formatAmount(plan.amount) }}
            </option>
          </select>
        </label>
      </div>

      <div v-if="selectedTargetPlan && String(selectedTargetPlan.category || '').toLowerCase() === 'corporate'" class="max-w-xs">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Target seats</span>
          <input
            v-model.number="targetSeats"
            :min="targetMinimumSeats"
            type="number"
            @change="normalizeTargetSeats"
            @blur="normalizeTargetSeats"
            class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <span class="mt-1 block text-xs text-slate-500">Minimum {{ targetMinimumSeats }} seats. The selected seat count is used to calculate the target plan total.</span>
        </label>
      </div>

      <button
        type="button"
        class="rounded-xl bg-[#08085E] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canQuote || quoting"
        @click="requestQuote"
      >
        {{ quoting ? 'Preparing quote…' : 'Review plan change' }}
      </button>

      <section v-if="quote" class="space-y-5 rounded-2xl border border-slate-200 p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan change</p>
            <h4 class="mt-1 text-xl font-semibold text-slate-950">
              {{ humanize(quote.change_type) }}
            </h4>
            <p class="mt-1 text-sm text-slate-600">
              Effective {{ formatDateTime(quote.effective_at) }}
            </p>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">
            {{ humanize(quote.status) }}
          </span>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-xl bg-emerald-50 p-4">
            <p class="text-sm font-semibold text-emerald-900">Access added</p>
            <ul class="mt-2 space-y-1 text-sm text-emerald-900">
              <li v-for="item in entitlementBucket('added')" :key="entitlementKey(item)">
                {{ entitlementLabel(item) }}
              </li>
              <li v-if="!entitlementBucket('added').length">None</li>
            </ul>
          </div>
          <div class="rounded-xl bg-amber-50 p-4">
            <p class="text-sm font-semibold text-amber-950">Access removed</p>
            <ul class="mt-2 space-y-1 text-sm text-amber-950">
              <li v-for="item in entitlementBucket('removed')" :key="entitlementKey(item)">
                {{ entitlementLabel(item) }}
              </li>
              <li v-if="!entitlementBucket('removed').length">None</li>
            </ul>
          </div>
          <div class="rounded-xl bg-slate-50 p-4">
            <p class="text-sm font-semibold text-slate-900">Access retained</p>
            <ul class="mt-2 space-y-1 text-sm text-slate-700">
              <li v-for="item in entitlementBucket('retained')" :key="entitlementKey(item)">
                {{ entitlementLabel(item) }}
              </li>
              <li v-if="!entitlementBucket('retained').length">None</li>
            </ul>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200">
          <div class="flex justify-between gap-4 border-b border-slate-200 px-4 py-3 text-sm">
            <span>Target service value</span>
            <strong>{{ money(quote.target_remaining_value, quote.currency) }}</strong>
          </div>
          <div class="flex justify-between gap-4 border-b border-slate-200 px-4 py-3 text-sm">
            <span>Non-refundable value applied to this upgrade</span>
            <strong>-{{ money(quote.non_refundable_adjustment, quote.currency) }}</strong>
          </div>
          <div class="flex justify-between gap-4 px-4 py-3">
            <span class="font-semibold">Amount due now</span>
            <strong class="text-lg text-[#08085E]">{{ money(quote.amount_due, quote.currency) }}</strong>
          </div>
        </div>

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p class="font-semibold">No-refund policy</p>
          <p class="mt-1 leading-6">
            No cash refund or withdrawable account credit will be created. A downgrade keeps your current paid access until the effective renewal date.
          </p>
          <label class="mt-3 flex items-start gap-3">
            <input v-model="noRefundAcknowledged" type="checkbox" class="mt-1" />
            <span>I understand and accept the no-refund policy.</span>
          </label>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-xl bg-[#08085E] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            :disabled="!noRefundAcknowledged || accepting"
            @click="acceptQuote"
          >
            {{ accepting ? 'Applying request…' : acceptLabel }}
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
            @click="clearQuote"
          >
            Start again
          </button>
        </div>
      </section>

      <section
        v-if="acceptedChange && acceptedChange.status === 'pending_payment'"
        class="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-5"
      >
        <div>
          <h4 class="font-semibold text-blue-950">Complete upgrade payment</h4>
          <p class="mt-1 text-sm text-blue-900">
            Existing access remains active until the payment is verified and the replacement subscription is applied.
          </p>
        </div>
        <select v-model="paymentMethodId" class="w-full max-w-md rounded-xl border border-blue-200 bg-white px-4 py-3">
          <option value="">Select payment method</option>
          <option v-for="method in activePaymentMethods" :key="method.id" :value="String(method.id)">
            {{ method.title || method.name || method.gateway_code }}
          </option>
        </select>
        <div v-if="previewing" class="text-sm text-blue-900">Calculating provider charge…</div>
        <div v-else-if="paymentPreview" class="max-w-md rounded-xl border border-blue-200 bg-white">
          <div class="flex justify-between gap-4 border-b border-blue-100 px-4 py-3 text-sm">
            <span>Plan-change service amount</span>
            <strong>{{ money(paymentPreview.service_amount, paymentPreview.currency) }}</strong>
          </div>
          <div class="flex justify-between gap-4 border-b border-blue-100 px-4 py-3 text-sm">
            <span>Payment provider charge</span>
            <strong>{{ money(paymentPreview.provider_charge, paymentPreview.currency) }}</strong>
          </div>
          <div class="flex justify-between gap-4 px-4 py-3">
            <span class="font-semibold">Total submitted to provider</span>
            <strong class="text-lg text-[#08085E]">{{ money(paymentPreview.total_payable, paymentPreview.currency) }}</strong>
          </div>
        </div>
        <button
          type="button"
          class="rounded-xl bg-[#08085E] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          :disabled="!paymentMethodId || paying || previewing || !paymentPreview"
          @click="initializePayment"
        >
          {{ paying ? 'Opening checkout…' : 'Proceed to payment' }}
        </button>
      </section>

      <section v-if="planChanges.length" class="space-y-3">
        <h4 class="font-semibold text-slate-950">Plan-change history</h4>
        <article
          v-for="change in planChanges"
          :key="change.id"
          class="rounded-xl border border-slate-200 p-4"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-semibold">{{ change.reference }}</p>
              <p class="mt-1 text-sm text-slate-600">
                {{ humanize(change.change_type) }} · effective {{ formatDateTime(change.effective_at) }}
              </p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">
              {{ humanize(change.status) }}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-4">
            <button
              v-if="String(change.status).toLowerCase() === 'pending_payment' && change.target_subscription_id"
              type="button"
              class="text-sm font-semibold text-[#08085E]"
              @click="resumePayment(change)"
            >
              Complete payment
            </button>
            <button
              v-if="canCancel(change)"
              type="button"
              class="text-sm font-semibold text-red-700"
              @click="cancelChange(change)"
            >
              Cancel plan change
            </button>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>

<script>
import { comparePlansForCatalog } from '~/utils/subscription-plan.js'

const PENDING_SUBSCRIPTION_PAYMENT_KEY = 'nwlr_pending_subscription_payment'

export default {
  props: {
    subscriptionData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: true,
      quoting: false,
      accepting: false,
      paying: false,
      previewing: false,
      errorMessage: '',
      subscriptions: [],
      sourceSubscriptionId: '',
      targetPlanId: '',
      targetSeats: 1,
      quote: null,
      acceptedChange: null,
      planChanges: [],
      noRefundAcknowledged: false,
      paymentMethodId: '',
      paymentPreview: null,
    }
  },
  computed: {
    plans() {
      const candidates = this.subscriptionData.all || [
        ...(this.subscriptionData.premium || []),
        ...(this.subscriptionData.individual || []),
        ...(this.subscriptionData.corporate || []),
      ]
      const seen = new Set()
      return candidates.filter((plan) => {
        const key = String(plan.id)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    },
    activeSubscriptions() {
      return this.subscriptions.filter(
        (item) =>
          String(item.status || '').toLowerCase() === 'active' &&
          item.is_active !== false &&
          !item.replaced_by_subscription_id
      )
    },
    selectedSource() {
      return this.activeSubscriptions.find(
        (item) => String(item.id) === String(this.sourceSubscriptionId)
      )
    },
    selectedTargetPlan() {
      return this.plans.find((plan) => String(plan.id) === String(this.targetPlanId))
    },
    targetMinimumSeats() {
      return Math.max(1, Number(this.selectedTargetPlan?.min_seats || this.selectedTargetPlan?.no_of_users || 1))
    },
    compatiblePlans() {
      if (!this.selectedSource) return []
      return this.plans
        .filter(
          (plan) =>
            String(plan.id) !== String(this.selectedSource.plan_id) &&
            plan.status !== false &&
            Number(plan.status) !== 0
        )
        .slice()
        .sort(comparePlansForCatalog)
    },
    activePaymentMethods() {
      return (this.subscriptionData.payment || []).filter(
        (method) => method.status === true || Number(method.status) === 1
      )
    },
    canQuote() {
      return Boolean(this.sourceSubscriptionId && this.targetPlanId)
    },
    acceptLabel() {
      return Number(this.quote?.amount_due) > 0
        ? 'Accept and continue to payment'
        : 'Apply plan change'
    },
  },
  watch: {
    paymentMethodId() {
      this.loadPaymentPreview()
    },
    targetPlanId() {
      if (this.targetPlanId) this.targetSeats = Math.max(this.targetMinimumSeats, Number(this.selectedSource?.no_of_users || 1))
      this.clearQuote()
    },
  },
  mounted() {
    this.loadSubscriptions()
  },
  methods: {
    async resetReview() {
      this.errorMessage = ''
      this.targetPlanId = ''
      this.clearQuote()
      await this.loadSubscriptions()
    },
    subscriptionProductLabel(subscription) {
      const names = Array.isArray(subscription?.product_names)
        ? subscription.product_names.filter(Boolean)
        : []
      return names.join(' + ') || subscription?.product_name || 'Product not identified'
    },
    planProductLabel(plan) {
      const products = Array.isArray(plan?.products) && plan.products.length
        ? plan.products
        : plan?.product
        ? [plan.product]
        : []
      const names = [...new Set(products.map((product) => product?.name).filter(Boolean))]
      return names.join(' + ') || 'Product not identified'
    },
    async loadSubscriptions() {
      this.loading = true
      this.errorMessage = ''
      try {
        const response = await this.$api.subscription.getSubscriptions({
          page: 1,
          perPage: 100,
        })
        this.subscriptions = response?.data?.data || []
        if (this.activeSubscriptions.length === 1) {
          this.sourceSubscriptionId = String(this.activeSubscriptions[0].id)
          this.targetSeats = Number(this.activeSubscriptions[0].no_of_users || 1)
          await this.loadChanges()
        }
      } catch (error) {
        this.errorMessage = this.parseError(error)
      } finally {
        this.loading = false
      }
    },
    async onSourceChanged() {
      this.clearQuote()
      this.targetPlanId = ''
      this.targetSeats = Number(this.selectedSource?.no_of_users || 1)
      await this.loadChanges()
    },
    async loadChanges() {
      this.planChanges = []
      if (!this.sourceSubscriptionId) return
      try {
        const response = await this.$api.subscription.getPlanChanges(
          this.sourceSubscriptionId,
          { perPage: 50 }
        )
        this.planChanges = response?.data?.data || []
        const payable = this.planChanges.find(
          (change) =>
            String(change.status || '').toLowerCase() === 'pending_payment' &&
            change.target_subscription_id
        )
        if (payable && !this.acceptedChange) this.acceptedChange = payable
      } catch (error) {
        this.errorMessage = this.parseError(error)
      }
    },
    normalizeTargetSeats() {
      let seats = Number.parseInt(this.targetSeats, 10)
      if (!Number.isFinite(seats)) seats = this.targetMinimumSeats
      seats = Math.max(this.targetMinimumSeats, seats)
      this.targetSeats = seats
      return seats
    },
    async requestQuote() {
      this.clearQuote()
      this.normalizeTargetSeats()
      this.quoting = true
      this.errorMessage = ''
      try {
        this.quote = await this.$api.subscription.quotePlanChange(
          this.sourceSubscriptionId,
          {
            target_plan_id: Number(this.targetPlanId),
            target_seats: Number(this.targetSeats || 1),
          }
        )
        this.noRefundAcknowledged = false
        this.acceptedChange = null
      } catch (error) {
        this.errorMessage = this.parseError(error)
      } finally {
        this.quoting = false
      }
    },
    async acceptQuote() {
      if (!this.quote || !this.noRefundAcknowledged) return
      this.accepting = true
      this.errorMessage = ''
      try {
        this.acceptedChange = await this.$api.subscription.acceptPlanChange(
          this.quote.id
        )
        this.quote = this.acceptedChange
        await this.loadChanges()
        if (this.acceptedChange.status === 'scheduled') {
          this.$notify({
            type: 'success',
            title: 'Plan change scheduled',
            text: `Your current access remains available until ${this.formatDateTime(
              this.acceptedChange.effective_at
            )}.`,
            duration: 7000,
          })
        }
      } catch (error) {
        this.errorMessage = this.parseError(error)
      } finally {
        this.accepting = false
      }
    },
    async loadPaymentPreview() {
      this.paymentPreview = null
      if (!this.acceptedChange || !this.paymentMethodId) return
      this.previewing = true
      this.errorMessage = ''
      try {
        this.paymentPreview = await this.$api.subscription.previewPlanChangePayment(
          this.acceptedChange.id,
          { payment_method_id: Number(this.paymentMethodId) }
        )
      } catch (error) {
        this.errorMessage = this.parseError(error)
      } finally {
        this.previewing = false
      }
    },
    resumePayment(change) {
      this.acceptedChange = change
      this.quote = change
      this.paymentMethodId = ''
      this.paymentPreview = null
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          const section = this.$el.querySelector('.border-blue-200.bg-blue-50')
          section?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }
    },
    async initializePayment() {
      if (!this.acceptedChange || !this.paymentMethodId) return
      this.paying = true
      this.errorMessage = ''
      try {
        const payment = await this.$api.subscription.initializePlanChangePayment(
          this.acceptedChange.id,
          {
            payment_method_id: Number(this.paymentMethodId),
            callback_url: this.callbackUrl(),
          }
        )
        this.paymentPreview = {
          service_amount: payment.service_amount,
          provider_charge: payment.provider_charge,
          total_payable: payment.total_payable || payment.amount,
          expected_net_settlement: payment.expected_net_settlement,
          currency: payment.currency,
        }
        const paymentUrl = payment.authorization_url || payment.payment_url
        this.rememberPendingPayment(payment)
        if (!paymentUrl) {
          const gateway = String(payment?.gateway || '').toLowerCase()
          if (gateway !== 'manual') {
            throw new Error('This payment method did not return an online checkout link.')
          }

          this.$notify({
            type: 'success',
            title: 'Manual payment created',
            text: `${payment?.message || 'Manual payment is awaiting administrative confirmation.'} Reference: ${payment?.reference}.`,
            duration: 9000,
          })
          await this.loadChanges()
          return
        }
        window.location.assign(paymentUrl)
      } catch (error) {
        this.errorMessage = this.parseError(error)
      } finally {
        this.paying = false
      }
    },
    async cancelChange(change) {
      this.errorMessage = ''
      try {
        await this.$api.subscription.cancelPlanChange(change.id)
        if (this.acceptedChange?.id === change.id) this.acceptedChange = null
        if (this.quote?.id === change.id) this.quote = null
        await this.loadChanges()
        this.$notify({
          type: 'success',
          title: 'Plan change cancelled',
          text: 'The unpaid or scheduled plan change has been cancelled.',
          duration: 5000,
        })
      } catch (error) {
        this.errorMessage = this.parseError(error)
      }
    },
    canCancel(change) {
      const cancellableStatus = ['quoted', 'pending_payment', 'scheduled'].includes(
        String(change.status || '').toLowerCase()
      )
      const hasUnresolvedProviderCheckout = (change.payments || []).some(
        (payment) =>
          String(payment.status || '').toLowerCase() !== 'paid' &&
          Boolean(payment.initialized_at) &&
          !payment.failed_at &&
          !payment.cancelled_at
      )

      return cancellableStatus && !hasUnresolvedProviderCheckout
    },
    clearQuote() {
      this.quote = null
      this.acceptedChange = null
      this.noRefundAcknowledged = false
      this.paymentMethodId = ''
      this.paymentPreview = null
    },
    entitlementBucket(name) {
      return Array.isArray(this.quote?.entitlement_diff?.[name])
        ? this.quote.entitlement_diff[name]
        : []
    },
    entitlementKey(item) {
      return `${item.product_id || 0}:${item.feature_slug || item.key || ''}`
    },
    entitlementLabel(item) {
      return this.humanize(item.feature_slug || item.key || 'Feature')
    },
    humanize(value) {
      return String(value || '')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    },
    money(amount, currency = 'NGN') {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency || 'NGN',
        maximumFractionDigits: 2,
      }).format(Number(amount || 0))
    },
    formatAmount(value) {
      return this.$helper?.formatAmount
        ? this.$helper.formatAmount(value)
        : Number(value || 0).toLocaleString('en-NG')
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString('en-NG') : '—'
    },
    formatDateTime(value) {
      return value ? new Date(value).toLocaleString('en-NG') : '—'
    },
    callbackUrl() {
      const url = new URL(window.location.href)
      return `${url.protocol}//${url.host}/dashboard/my-subscription`
    },
    rememberPendingPayment(payment) {
      if (typeof window === 'undefined' || !window.sessionStorage) return
      window.sessionStorage.setItem(
        PENDING_SUBSCRIPTION_PAYMENT_KEY,
        JSON.stringify({
          reference: payment.reference,
          external_reference: payment.external_reference || null,
          gateway: payment.gateway || null,
          subscription_id: payment.subscription_id || payment.payable_id || null,
          plan_change_id: this.acceptedChange?.id || null,
          auto_renew_requested: Boolean(
            this.acceptedChange?.target_subscription?.auto_renew
          ),
          created_at: Date.now(),
        })
      )
    },
    parseError(error) {
      const parsed = this.$errorHandler?.setAndParse
        ? this.$errorHandler.setAndParse(error)
        : null
      return parsed?.message || error?.message || 'The plan change could not be processed.'
    },
  },
}
</script>
