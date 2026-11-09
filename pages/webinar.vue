<template>
  <div>
    <landing-justices-tech-law />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'

export default {
  name: 'Justices Tech Law Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Justices Tech Law | NWLR Online',
        description:
          'Technology law resources and justice information from NWLR Online',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
