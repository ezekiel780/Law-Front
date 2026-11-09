<template>
  <div class="w-full text-center my-8">
    <p class="font-semibold">{{ message }}</p>
    <nuxt-link
      class="inline-block mt-4 text-[#08085E] underline"
      to="/auth/login"
    >
      Continue to sign in
    </nuxt-link>
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'AccountActivationStatus',
  mixins: [SEO],
  data() {
    return {
      message:
        'This activation link is no longer valid. Request a new verification email or contact customer service.',
      seo: {
        title: 'Activate Account | NWLR Online',
        description: 'Activate your NWLR Online account',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
