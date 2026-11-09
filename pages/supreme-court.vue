<template>
  <div>
    <landing-justices-supreme-court />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'Supreme Court Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Supreme Court | NWLR Online',
        description: 'Justices of the Supreme Court of Nigeria',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
