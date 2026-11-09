<template>
  <div class="text-sm font-light text-[#1A1A1A]">
    <dashboard-base-sidebar />
    <!-- Content -->
    <div class="w-full h-full px-4 sm:px-6 md:px-8 lg:pl-72 bg-[#F5F6FB]">
      <dashboard-base-header />
      <utils-auto-logout />
      <nuxt />
    </div>
    <!-- End Content -->
    <notifications position="top right" class="absolute top-4 right-4">
      <template slot="body" slot-scope="props">
        <utils-toast-notification :notice-props="props" />
      </template>
    </notifications>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout',
  middleware: 'auth.middleware',
  methods: {},
  async mounted() {
    if (this.$user.getRequiresPasswordChange()) return

    try {
      await this.$user.ensureNodeToken()
      await this.$user.refreshAccess()
    } catch (error) {
      // Product routes perform their own fail-closed entitlement check.
    }
  },
}
</script>
