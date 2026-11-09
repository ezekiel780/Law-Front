<template>
  <div>
    <landing-about-info />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'About Us Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'About Us | NWLR Online',
        description: "Nigeria's Leading Law Reports",
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
