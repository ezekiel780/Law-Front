<template>
  <div>
    <landing-editorial-board />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'Editorial Board Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Editorial Board | NWLR Online',
        description: 'The Editorial Board of the Nigerian Weekly Law Reports',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
