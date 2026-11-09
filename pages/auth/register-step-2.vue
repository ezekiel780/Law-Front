<template>
  <div>
    <landing-auth-signup-step-2 />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Signup | NWLR Online',
        description: 'Create an account on NWLR Online',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
