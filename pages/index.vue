<template>
  <div>
    <landing-base-notice v-if="true === false" />
    <landing-home-hero />
    <landing-home-recent-publications :recent-judgement="recentJudgement" />
    <landing-home-how-it-works />
    <landing-home-subscriptions :all-plans="allPlans" />
    <landing-home-links />
    <landing-home-contact />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'Homepage',
  mixins: [SEO],
  async asyncData({ $api, $errorHandler }) {
    try {
      const {
        data: { success },
      } = await $api.auth.landingPage()

      return {
        recentJudgement: success.data.recentJudgement,
        allPlans: success.data.plans.all || [
          ...(success.data.plans.premium || []),
          ...(success.data.plans.individual || []),
          ...(success.data.plans.corporate || []),
        ],
      }
    } catch (error) {
      const errorResponse = $errorHandler.setAndParse(error)
      if (process.env.NODE_ENV === 'development') {
        console.trace(errorResponse)
      }
      return {
        recentJudgement: [],
        allPlans: [],
        error: errorResponse,
      }
    }
  },
  data() {
    return {
      seo: {
        title: 'Home | NWLR Online',
        description:
          'Most Authoritative, Consistent, Exhaustive Law Reports in Nigeria',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
  mounted() {
    if (this.error) {
      this.$notify({
        type: 'error',
        title: 'Error',
        text: this.error.message,
        duration: 5000,
      })
    }
  },
}
</script>
