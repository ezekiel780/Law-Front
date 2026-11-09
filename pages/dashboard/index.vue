<template>
  <div class="">
    <div
      class="fixed left-0 top-0 z-[1000] overscroll-contain"
      v-if="!isPageLoaded"
    >
      <utils-page-loader />
    </div>
    <div
      v-if="profileError"
      class="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      {{ profileError }}
    </div>
    <div
      v-if="isInstitutionalSession"
      class="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm"
      role="status"
      aria-live="polite"
    >
      You are currently logged in to an institutional network access account
    </div>
    <dashboard-legal-research-search
      v-if="hasNwlrAccess"
      :page-number="1"
    />
    <div
      v-else-if="!isIpUser"
      class="mb-6 rounded-2xl border border-indigo-200 bg-white px-6 py-6 shadow-sm"
    >
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
        NWLR Legal Research
      </p>
      <h2 class="mt-2 text-xl font-semibold text-[#08085E]">
        Your current subscription does not include NWLR access
      </h2>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
        Choose a plan that includes the Legal Research and Case Access
        capabilities to search cases, open judgments, and use My Research.
      </p>
      <nuxt-link
        v-if="!isInstitutionalSession"
        to="/dashboard/my-subscription?required=LEGAL_RESEARCH"
        class="mt-4 inline-flex items-center rounded-lg bg-[#08085E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#17178A]"
      >
        View NWLR plans
      </nuxt-link>
    </div>
    <dashboard-home-header-cards v-if="!isIpUser" :subscription="subscription" />
    <div
      class="grid grid-cols-1 gap-4 md:gap-8"
      :class="{
        'md:grid-cols-3': hasNwlrAccess && !isInstitutionalSession,
      }"
    >
      <div
        :class="{
          'md:col-span-2': hasNwlrAccess && !isInstitutionalSession,
        }"
      >
        <dashboard-home-recent-judgements
          :all-recent-judgements="allRecentJudgements"
          :can-open-cases="hasNwlrAccess"
        />
      </div>
      <div v-if="hasNwlrAccess && !isInstitutionalSession" class="">
        <dashboard-home-my-research
          :all-saved-cases="savedCases"
          :all-saved-search="savedSearch"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'DashboardHomePage',
  layout: 'dashboard',
  mixins: [SEO],
  data() {
    return {
      user: null,
      isPageLoaded: false,
      profileError: '',
      recentJudgementPreview: [],
      seo: {
        title: 'Dashboard | NWLR Online',
        description: 'Dashboard for NWLR Online',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },

  computed: {
    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },
    isIpUser() {
      return this.$user.getIsIpUser()
    },
    hasNwlrAccess() {
      return this.$user.can('LEGAL_RESEARCH', 'CASE_ACCESS')
    },
    subscription() {
      try {
        const res = this.user.data.subscription
        return res
      } catch (error) {
        return {
          message1: null,
          subscription_status: null,
        }
      }
    },
    allRecentJudgements() {
      try {
        const records =
          this.user?.data?.recent_judgement || this.recentJudgementPreview || []
        const groupedByPart = records.reduce((acc, current) => {
          const part = current.part
          if (!acc[part]) {
            acc[part] = []
          }
          acc[part].push(current)
          return acc
        }, {})

        const sortedGroupedByPart = new Map(
          Object.entries(groupedByPart).sort(([a], [b]) => b.localeCompare(a))
        )

        const result = {}
        sortedGroupedByPart.forEach((value, key) => {
          result[`${key.toString()}:`] = value
        })
        return result
      } catch (error) {
        return {}
      }
    },
    savedCases() {
      try {
        const records = this.user.data.saved_cases
        return [...records]
      } catch (error) {
        return []
      }
    },
    savedSearch() {
      try {
        const records = this.user.data.saved_result
        return [...records]
      } catch (error) {
        return []
      }
    },
  },
  methods: {
    async loadRecentJudgementPreview() {
      try {
        const response = await this.$api.auth.landingPage()
        this.recentJudgementPreview =
          response?.data?.success?.data?.recentJudgement || []
      } catch (error) {
        this.recentJudgementPreview = []
      }
    },
    apiErrorMessage(error) {
      const parsed = this.$errorHandler.setAndParse(error)
      return parsed?.message || 'Unable to load your account information.'
    },
    isIpNetworkRestriction(error) {
      if (error?.response?.status !== 403 || !this.$user.getIsIpUser()) {
        return false
      }

      const message = String(error?.response?.data?.error?.message || '')
      return (
        message.includes('IP-restricted access') ||
        message.includes('configured institutional IP ranges')
      )
    },
    async getUserRecords() {
      this.profileError = ''
      try {
        const {
          data: { success },
        } = await this.$api.auth.profile()
        this.user = success
        this.recentJudgementPreview = success?.data?.recent_judgement || []
      } catch (error) {
        this.user = null
        if (error?.response?.status === 401) {
          this.$user.logout()
          return
        }

        this.profileError = this.apiErrorMessage(error)

        if (this.isIpNetworkRestriction(error)) {
          // A corporate IP restriction controls subscriber content, not the
          // customer's ability to use the dashboard. Remove any entitlement
          // state persisted from an earlier in-network session and fall back
          // to the same metadata-only recent-judgment feed used publicly.
          await this.$user.setAccessFromProfile({})
          this.$user.setIsSubscribed(false)
          this.$user.setSubscriptionId(null)
          await this.loadRecentJudgementPreview()
        }
      }
    },
    async fillData() {
      await this.getUserRecords()
      if (!this.user) {
        this.isPageLoaded = true
        return
      }
      this.$user.setFirstName(this.user.data.firstname)
      this.$user.setLastName(this.user.data.lastname)
      this.$user.setAvatar(this.user.data.avatar)
      const subscription = this.user.data.subscription || {}
      this.$user.setIsSubscribed(Boolean(subscription.subscription_status))
      this.$user.setSubscriptionId(subscription.subscription_id || null)
      this.$user.setAutoDebit(this.user.data.auto_debit)
      await this.$user.setAccessFromProfile(this.user.data)
      const isCorporateParent = subscription.primary === 1
      this.$user.setIsParent(isCorporateParent)
      try {
        await this.$user.ensureNodeToken()
        await this.$user.refreshAccess({ force: true })
      } catch (error) {
        // Product routes remain fail-closed. The dashboard can still show the
        // subscription recovery path while access synchronization is retried.
      }
      this.isPageLoaded = true
    },
  },
  mounted() {
    this.fillData()
  },
}
</script>
