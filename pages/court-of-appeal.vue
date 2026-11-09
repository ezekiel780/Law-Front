<template>
  <div>
    <landing-justices-court-of-appeal />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'Court of Appeal Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Court of Appeal | NWLR Online',
        description: 'Justice of the Court of Appeal',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
