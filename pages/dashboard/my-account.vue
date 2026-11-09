<template>
  <div class="my-6">
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
    <!-- breadcrumb -->
    <div class="flex gap-5 items-center">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">My Account</span>
    </div>
    <!-- content -->
    <div v-if="user && user.data">
      <dashboard-my-account-profile
        :user="userProps"
        @profile-updated="handleProfileUpdated"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyAccountPage',
  layout: 'dashboard',
  data() {
    return {
      isPageLoaded: false,
      profileError: '',
      user: {
        data: {
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          address: '',
          country: '',
          state: '',
          area: '',
          avatar: '',
        },
      },
    }
  },
  computed: {
    userProps() {
      const profile = this.user && this.user.data ? this.user.data : {}
      const {
        firstname,
        lastname,
        email,
        phone,
        address,
        country,
        state,
        area,
        avatar,
        auto_debit,
      } = profile
      return {
        firstname,
        lastname,
        email,
        phone,
        address,
        country,
        state,
        area,
        avatar,
        auto_debit,
      }
    },
  },
  methods: {
    handleProfileUpdated(updatedUser = {}) {
      const normalized = {
        ...updatedUser,
        area: updatedUser.area || updatedUser.town || '',
      }

      this.user = {
        ...(this.user || {}),
        data: {
          ...(this.user?.data || {}),
          ...normalized,
        },
      }

      this.$user.setFirstName(normalized.firstname || '')
      this.$user.setLastName(normalized.lastname || '')
      this.$user.setAvatar(normalized.avatar || '')
    },

    async getUserRecords() {
      this.profileError = ''
      try {
        const response = await this.$api.auth.profile()
        const success = response && response.data ? response.data.success : null

        if (!success || !success.data) {
          throw new Error('The account profile response was incomplete.')
        }

        this.user = success
      } catch (error) {
        this.user = null
        if (error?.response?.status === 401) {
          this.$user.logout()
          return
        }
        const parsed = this.$errorHandler.setAndParse(error)
        this.profileError =
          parsed?.message || 'Unable to load your account information.'
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
      this.isPageLoaded = true
    },
  },
  mounted() {
    this.fillData()
  },
}
</script>
