<template>
  <div>
    <div
      v-if="hasAuthenticatedSession"
      class="text-sm font-light text-[#1A1A1A]"
    >
      <dashboard-base-sidebar />
      <div
        class="w-full min-h-screen px-4 sm:px-6 md:px-8 lg:pl-72 bg-[#F5F6FB]"
      >
        <dashboard-base-header />
        <utils-auto-logout />
        <nuxt />
      </div>
    </div>

    <div v-else>
      <landing-base-header />
      <utils-auto-logout />
      <nuxt />
      <landing-base-footer />
    </div>

    <notifications position="top right" class="absolute top-4 right-4">
      <template slot="body" slot-scope="props">
        <utils-toast-notification :notice-props="props" />
      </template>
    </notifications>
  </div>
</template>

<script>
export default {
  name: 'DictionaryHardcopyLayout',
  computed: {
    hasAuthenticatedSession() {
      return Boolean(
        this.$store.getters['user/getIsLoggedIn'] ||
          this.$store.getters['user/getLaravelToken'] ||
          this.$store.getters['user/getToken'] ||
          this.$store.getters['user/getIsIpUser']
      )
    },
  },
}
</script>
