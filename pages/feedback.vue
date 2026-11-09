<template>
  <div>
    <landing-feedback-form />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'

export default {
  name: 'Feedback Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Feedback | NWLR Online',
        description: 'Send feedback to NWLR Online',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
