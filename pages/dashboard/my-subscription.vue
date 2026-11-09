<template>
  <div>
    <div
      v-if="!isInstitutionalSession && !isIpUser && requiredAccessNotice"
      class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 shadow-sm"
      role="status"
    >
      <p class="font-semibold">Additional subscription access required</p>
      <p class="mt-1 text-sm leading-6">{{ requiredAccessNotice }}</p>
    </div>
    <div
      v-if="isIpUser && !isInstitutionalSession"
      class="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
      role="region"
      aria-label="IP access administration"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="font-semibold text-slate-900">IP access administration</p>
          <p class="mt-1 text-sm leading-6 text-slate-600">
            {{ ipAccessAccountMessage }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          :disabled="ipAccessLoading"
          @click="fetchIpAccessOverview"
        >
          {{ ipAccessLoading ? 'Refreshing…' : 'Refresh network status' }}
        </button>
      </div>

      <div v-if="ipAccessOverview" class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Current IP</p>
          <p class="mt-1 break-all font-semibold text-slate-900">{{ ipAccessOverview.current_ip || 'Unavailable' }}</p>
        </div>
        <div class="rounded-xl bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Network status</p>
          <p
            class="mt-1 font-semibold"
            :class="ipAccessOverview.inside_network ? 'text-green-700' : 'text-amber-700'"
          >
            {{ ipAccessOverview.inside_network ? 'Inside approved range' : 'Outside approved range' }}
          </p>
        </div>
        <div class="rounded-xl bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Research access</p>
          <p
            class="mt-1 font-semibold"
            :class="ipAccessOverview.content_access_available ? 'text-green-700' : 'text-amber-700'"
          >
            {{ ipAccessOverview.content_access_available ? 'Available' : 'Network required' }}
          </p>
        </div>
        <div class="rounded-xl bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Active systems</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">{{ Number(ipAccessOverview.active_systems || 0) }}</p>
        </div>
      </div>

      <div v-if="ipAccessOverview" class="mt-5">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Configured institutional IP ranges</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="(range, index) in ipAccessOverview.ranges || []"
            :key="`ip-range-${index}-${range.start_ip}-${range.end_ip}`"
            class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800"
          >
            {{ range.start_ip === range.end_ip ? range.start_ip : `${range.start_ip} – ${range.end_ip}` }}
          </span>
        </div>
      </div>

      <div
        v-else-if="!ipAccessLoading"
        class="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
        role="status"
      >
        Network status is temporarily unavailable. Use Refresh network status to try again.
      </div>
    </div>

    <div
      v-if="!isInstitutionalSession && !isIpUser && isConfirmingPayment"
      class="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-950 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <p class="font-semibold">Confirming your payment</p>
      <p class="mt-1 text-sm text-blue-800">
        We are checking the payment directly with the provider. Do not close
        this page.
      </p>
    </div>

    <div
      v-else-if="!isInstitutionalSession && !isIpUser && paymentReturnMessage && !isPaymentConfirmed"
      class="mb-5 rounded-2xl border px-5 py-4 shadow-sm"
      :class="
        paymentReturnTone === 'error'
          ? 'border-red-200 bg-red-50 text-red-950'
          : 'border-amber-200 bg-amber-50 text-amber-950'
      "
      role="alert"
    >
      <p class="font-semibold">
        {{
          paymentReturnTone === 'error'
            ? 'Payment confirmation failed'
            : 'Payment confirmation pending'
        }}
      </p>
      <p class="mt-1 text-sm">{{ paymentReturnMessage }}</p>
    </div>

    <div v-if="!isInstitutionalSession && !isIpUser && isPaymentConfirmed">
      <dashboard-subscription-success-modal
        @toggle-modal="toggleSuccessModal"
      />
    </div>

    <div
      v-if="!isInstitutionalSession && !isIpUser && !isPaymentConfirmed && canLeaveCorporatePlan"
      class="mb-5 space-y-4"
      role="region"
      aria-label="Corporate subscription memberships"
    >
      <div
        v-for="membership in joinedCorporateMemberships"
        :key="`corporate-membership-${membership.id}`"
        class="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="font-semibold text-slate-900">Corporate plan membership</p>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              You are using {{ membership.title || 'a corporate plan' }} as an
              invited member. Leaving removes only this corporate seat. Your
              overlapping personal subscription, if one is paused, resumes with
              all unused time preserved when no other corporate plan still covers
              it. You may join again through a new invite.
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="leavingCorporateSubscriptionId === membership.id"
            @click="leaveCorporatePlan(membership)"
          >
            {{
              leavingCorporateSubscriptionId === membership.id
                ? 'Leaving…'
                : 'Leave corporate plan'
            }}
          </button>
        </div>
      </div>
    </div>

    <dashboard-subscription-list
      v-if="!isInstitutionalSession && !isIpUser && !isPaymentConfirmed"
      :data="{
        premium: premiumPlans,
        individual: individualPlans,
        corporate: corporatePlans,
        payment: paymentMethods,
      }"
      :can-manage-corporate-users="canManageCorporateUsers"
      :can-manage-auto-renewal="canManageAutoRenewal"
      :can-manage-plan-changes="canManagePlanChanges"
    />
  </div>
</template>

<script>
const PENDING_SUBSCRIPTION_PAYMENT_KEY = 'nwlr_pending_subscription_payment'
const PENDING_PAYMENT_MAX_AGE_MS = 24 * 60 * 60 * 1000
const PAYMENT_RETURN_QUERY_KEYS = [
  'reference',
  'trxref',
  'tx_ref',
  'txn_ref',
  'txnref',
  'transaction_reference',
  'transaction_id',
  'payment_id',
  'paymentReference',
  'payment_reference',
  'status',
  'type',
  'gateway',
]

export default {
  name: 'MySubscribtionPage',
  layout: 'dashboard',

  computed: {
    isIpUser() {
      return this.$user.getIsIpUser()
    },
    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },
    ipAccessAccountMessage() {
      return this.ipAccessOverview?.inside_network === true
        ? 'You are currently logged in to an institutional network access account'
        : 'This user account is an institutional network access account. Please login to access your personal account.'
    },
    requiredCapability() {
      const raw = Array.isArray(this.$route.query.required)
        ? this.$route.query.required[0]
        : this.$route.query.required

      return String(raw || '')
        .trim()
        .replace(/[\s-]+/g, '_')
        .toUpperCase()
    },
    requiredCapabilityLabel() {
      const capability = this.requiredCapability
      if (!capability) return ''

      const plans = [...this.premiumPlans, ...this.individualPlans, ...this.corporatePlans]
      for (const plan of plans) {
        const entitlements = Array.isArray(plan.feature_entitlements)
          ? plan.feature_entitlements
          : []
        const entitlement = entitlements.find((item) => {
          const codes = [
            item.feature_slug,
            ...(Array.isArray(item.capabilities) ? item.capabilities : []),
          ].map((value) =>
            String(value || '')
              .trim()
              .replace(/[\s-]+/g, '_')
              .toUpperCase()
          )
          return codes.includes(capability)
        })

        if (entitlement?.feature_name) return entitlement.feature_name
      }

      return capability
        .toLowerCase()
        .split('_')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    requiredAccessNotice() {
      if (!this.requiredCapability) return ''

      return `Your current entitlements do not include ${this.requiredCapabilityLabel}. Select a plan that includes this capability.`
    },
  },

  data() {
    return {
      isPaymentConfirmed: false,
      isConfirmingPayment: false,
      paymentReturnMessage: '',
      paymentReturnTone: 'warning',
      premiumPlans: [],
      individualPlans: [],
      corporatePlans: [],
      paymentMethods: [],
      canManageCorporateUsers: false,
      canManageAutoRenewal: false,
      canManagePlanChanges: false,
      canLeaveCorporatePlan: false,
      joinedCorporateMemberships: [],
      leavingCorporateSubscriptionId: null,
      ipAccessOverview: null,
      ipAccessLoading: false,
      error: null,
    }
  },

  mounted() {
    this.initializePage()
  },

  methods: {
    async initializePage() {
      if (this.isIpUser && !this.isInstitutionalSession) {
        await this.fetchIpAccessOverview()
      }

      if (this.isInstitutionalSession || this.isIpUser) return

      await this.confirmPayment()
      await Promise.all([
        this.fetchPlans(),
        this.resolveCorporateUserManagementAccess(),
      ])
    },

    firstQueryValue(value) {
      if (Array.isArray(value)) return value[0] || ''
      return value == null ? '' : String(value)
    },

    readPendingPayment() {
      if (typeof window === 'undefined' || !window.sessionStorage) return null

      try {
        const raw = window.sessionStorage.getItem(
          PENDING_SUBSCRIPTION_PAYMENT_KEY
        )
        if (!raw) return null

        const payment = JSON.parse(raw)
        const createdAt = Number(payment?.created_at || 0)

        if (
          !payment?.reference ||
          !createdAt ||
          Date.now() - createdAt > PENDING_PAYMENT_MAX_AGE_MS
        ) {
          this.clearPendingPayment()
          return null
        }

        return payment
      } catch (error) {
        this.clearPendingPayment()
        return null
      }
    },

    clearPendingPayment() {
      if (typeof window === 'undefined' || !window.sessionStorage) return
      window.sessionStorage.removeItem(PENDING_SUBSCRIPTION_PAYMENT_KEY)
    },

    paymentReturnContext() {
      const query = this.$route.query || {}
      const pending = this.readPendingPayment()
      const queryReference =
        this.firstQueryValue(query.reference) ||
        this.firstQueryValue(query.trxref) ||
        this.firstQueryValue(query.tx_ref) ||
        this.firstQueryValue(query.txn_ref) ||
        this.firstQueryValue(query.txnref) ||
        this.firstQueryValue(query.transaction_reference)
      const queryExternalReference =
        this.firstQueryValue(query.transaction_id) ||
        this.firstQueryValue(query.payment_id) ||
        this.firstQueryValue(query.paymentReference) ||
        this.firstQueryValue(query.payment_reference)
      const hasProviderReturn = PAYMENT_RETURN_QUERY_KEYS.some(
        (key) => query[key] !== undefined
      )
      const reference = queryReference || pending?.reference || ''

      if (!reference || (!hasProviderReturn && !pending)) return null

      return {
        type:
          this.firstQueryValue(query.type) ||
          this.firstQueryValue(query.gateway) ||
          pending?.gateway ||
          '',
        reference,
        external_reference:
          queryExternalReference || pending?.external_reference || null,
        auto_renew_requested: Boolean(pending?.auto_renew_requested),
      }
    },

    async confirmPayment() {
      const paymentReturn = this.paymentReturnContext()
      if (!paymentReturn) return false

      this.isConfirmingPayment = true
      this.paymentReturnMessage = ''
      this.paymentReturnTone = 'warning'

      try {
        let payment = null

        for (let attempt = 1; attempt <= 3; attempt += 1) {
          const {
            data: { success },
          } = await this.$api.subscription.confirmSubscription(paymentReturn)
          payment = success.data

          const paymentIsPaid =
            String(payment?.status || '').toLowerCase() === 'paid'
          const subscriptionAccessGranted = Boolean(
            payment?.subscription_access_granted
          )

          if (paymentIsPaid && subscriptionAccessGranted) {
            this.clearPendingPayment()
            await this.cleanPaymentReturnQuery()
            this.isPaymentConfirmed = true
            this.$notify({
              type: 'success',
              title: 'Payment confirmed',
              text: 'Your payment was confirmed and the subscription entitlements are available.',
              duration: 5000,
            })

            if (
              paymentReturn.auto_renew_requested &&
              !payment?.subscription_auto_renew
            ) {
              this.$notify({
                type: 'warning',
                title: 'Auto-renewal not enabled',
                text: 'The provider did not return a reusable authorization. Your subscription access is available, but you will need to enable auto-renewal after a reusable card payment.',
                duration: 9000,
              })
            }

            return true
          }

          if (paymentIsPaid) {
            if (payment?.subscription_access_state === 'expired') {
              this.paymentReturnMessage =
                'Your payment is confirmed, but this historical subscription period has already expired, so no access was granted. Customer Service has been notified automatically. Do not make another payment.'
            } else if (payment?.subscription_access_state === 'entitlements_pending') {
              this.paymentReturnMessage =
                'Your payment is confirmed, but the subscription entitlements are not available yet. Customer Service has been notified automatically. Do not make another payment.'
            } else {
              this.paymentReturnMessage =
                'Your payment is confirmed, but subscription access is still being completed. Customer Service has been notified automatically. Do not make another payment.'
            }
            this.paymentReturnTone = 'warning'
          }

          if (attempt < 3) {
            await this.delay(attempt * 1500)
          }
        }

        await this.cleanPaymentReturnQuery()
        this.paymentReturnMessage =
          this.paymentReturnMessage ||
          'The provider has not confirmed the payment yet. We will keep the payment attempt available for another verification.'
        this.paymentReturnTone = 'warning'
        return false
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        this.paymentReturnMessage =
          errorResponse.message ||
          'We could not confirm the payment. The payment attempt has been retained and can be checked again.'
        this.paymentReturnTone = 'error'

        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }

        return false
      } finally {
        this.isConfirmingPayment = false
      }
    },

    delay(milliseconds) {
      return new Promise((resolve) =>
        window.setTimeout(resolve, milliseconds)
      )
    },

    async cleanPaymentReturnQuery() {
      const query = { ...this.$route.query }
      let changed = false

      PAYMENT_RETURN_QUERY_KEYS.forEach((key) => {
        if (query[key] !== undefined) {
          delete query[key]
          changed = true
        }
      })

      if (!changed) return

      try {
        await this.$router.replace({ path: this.$route.path, query })
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.trace(error)
        }
      }
    },

    async fetchIpAccessOverview() {
      if (!this.isIpUser || !this.$user.getLaravelToken() || this.$user.getIsInstitutionalSession()) {
        this.ipAccessOverview = null
        return
      }

      this.ipAccessLoading = true
      try {
        const response = await this.$api.subscription.getIpAccessOverview()
        this.ipAccessOverview = response?.data?.success?.data || null
      } catch (error) {
        this.ipAccessOverview = null
        if (process.env.NODE_ENV === 'development') console.trace(error)
      } finally {
        this.ipAccessLoading = false
      }
    },

    async resolveCorporateUserManagementAccess() {
      this.canManageCorporateUsers = false
      this.canManageAutoRenewal = false
      this.canManagePlanChanges = false
      this.canLeaveCorporatePlan = false
      this.joinedCorporateMemberships = []

      const hasLaravelSession = Boolean(this.$user.getLaravelToken())
      const isInstitutionalSession = this.$user.getIsInstitutionalSession()

      try {
        if (hasLaravelSession && !isInstitutionalSession) {
          const membershipsResponse =
            await this.$api.subscription.getCorporateMemberships()
          const memberships = membershipsResponse?.data?.success?.data || {}
          const isCorporateMembership = (membership) =>
            String(membership?.category || '').trim().toLowerCase() === 'corporate'
          const owned = (Array.isArray(memberships.owned) ? memberships.owned : []).filter(
            isCorporateMembership
          )
          const joined = (Array.isArray(memberships.joined) ? memberships.joined : []).filter(
            isCorporateMembership
          )

          this.canManageCorporateUsers = owned.length > 0
          this.joinedCorporateMemberships = joined
          this.canLeaveCorporatePlan = joined.length > 0

          if (owned[0]?.id) {
            await this.$user.setSubscriptionId(owned[0].id)
            this.canManageAutoRenewal = true
            this.canManagePlanChanges = true
          }
        }

        // Personal subscription management still uses the Node profile when a
        // content token is available. IP administrators outside their approved
        // network deliberately have no Node token but retain the Laravel account
        // session and the corporate administration permissions resolved above.
        if (this.$user.getToken() && !isInstitutionalSession) {
          try {
            const response = await this.$api.auth.profile()
            const subscription = response?.data?.success?.data?.subscription || {}
            const isActive =
              subscription.subscription_status === true ||
              Number(subscription.subscription_status) === 1
            const isPrimary = Number(subscription.primary) === 1
            if (isActive && isPrimary && hasLaravelSession) {
              this.canManageAutoRenewal = true
              this.canManagePlanChanges = true
            }
          } catch (profileError) {
            if (process.env.NODE_ENV === 'development') console.trace(profileError)
          }
        }

        this.$user.setIsParent(this.canManageCorporateUsers)
      } catch (error) {
        this.canManageCorporateUsers = false
        this.canManageAutoRenewal = false
        this.canManagePlanChanges = false
        this.canLeaveCorporatePlan = false
        this.joinedCorporateMemberships = []
        this.$user.setIsParent(false)

        if (process.env.NODE_ENV === 'development') {
          console.trace(error)
        }
      }
    },

    async leaveCorporatePlan(membership) {
      const subscriptionId = Number(membership?.id || 0)
      if (!this.canLeaveCorporatePlan || !subscriptionId) {
        return
      }

      if (
        typeof window !== 'undefined' &&
        !window.confirm(
          'Leave this corporate plan? Your corporate access will end immediately. Any overlapping personal subscription will resume if no other corporate plan still covers it.'
        )
      ) {
        return
      }

      this.leavingCorporateSubscriptionId = subscriptionId

      try {
        const { data } =
          await this.$api.subscription.leaveCorporateSubscription(
            subscriptionId
          )

        await this.$user.recoverNodeSession()
        await this.resolveCorporateUserManagementAccess()

        this.$notify({
          type: 'success',
          title: 'Corporate plan left',
          text:
            data?.success?.message ||
            'You have left the corporate plan. Your personal subscription is active again when available.',
          duration: 7000,
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        this.$notify({
          type: 'info',
          title: 'Notice',
          text: errorResponse.message,
          duration: 5000,
        })

        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
      } finally {
        this.leavingCorporateSubscriptionId = null
      }
    },

    async fetchPlans() {
      try {
        const {
          data: { success },
        } = await this.$api.subscription.getPlans()
        this.premiumPlans = [...(success.data.plans.premium || [])]
        this.individualPlans = [...success.data.plans.individual]
        this.corporatePlans = [...success.data.plans.corporate]
        this.paymentMethods = success.data.paymentMethod.filter(
          (method) => method.status == 1
        )
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)

        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }

        this.error = errorResponse
        this.premiumPlans = []
        this.individualPlans = []
        this.corporatePlans = []
        this.paymentMethods = []
      }
    },

    toggleSuccessModal() {
      this.isPaymentConfirmed = false
    },
  },
}
</script>
