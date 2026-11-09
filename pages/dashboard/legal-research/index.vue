<template>
  <div class="">
    <dashboard-legal-research-result />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'LegalResearchPage',
  layout: 'dashboard',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Legal Research | NWLR Online',
        description: 'Access to over 50,000 Cases',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
