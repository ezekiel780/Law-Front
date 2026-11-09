<template>
  <div>
    <landing-base-header />
    <utils-auto-logout />
    <nuxt />
    <landing-base-footer />
    <notifications position="top right" class="absolute top-4 right-4">
      <template slot="body" slot-scope="props">
        <utils-toast-notification :notice-props="props" />
      </template>
    </notifications>
  </div>
</template>

<script>
export default {
  name: 'LandingPageLayout',
  methods: {},
  mounted() {},
}
</script>
