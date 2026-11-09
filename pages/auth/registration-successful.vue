<template>
  <div>
    <landing-auth-signup-successful />
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
        description: 'Registration successful',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
