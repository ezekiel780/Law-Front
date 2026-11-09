<template>
  <div>
    <landing-auth-reset-new-password-form />
    <landing-auth-reset-new-password-success />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'New Password | NWLR Online',
        description: 'Create a new password for your NWLR Online account',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
