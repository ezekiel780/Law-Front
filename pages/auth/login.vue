<template>
  <div>
    <landing-auth-login-form />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Login | NWLR Online',
        description: 'Login to your NWLR Online account',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
