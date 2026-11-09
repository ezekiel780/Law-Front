<template>
  <div>
    <div v-if="!isTokenAvailable">
      <landing-auth-reset-password-form
        v-if="!showSuccess"
        @reset-request-accepted="toggleSuccess"
      />
      <landing-auth-reset-password-success v-else />
    </div>
    <div v-else>
      <landing-auth-reset-new-password-form
        v-if="!isPasswordUpdated"
        :token="token"
        :email="email"
        :invited="invited"
        @password-updated="togglePasswordUpdated"
      />
      <landing-auth-reset-new-password-success v-else />
    </div>
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'LandingAuthResetPassword',
  mixins: [SEO],
  asyncData({ query }) {
    const token = typeof query.token === 'string' ? query.token : ''
    const email = typeof query.email === 'string' ? query.email : ''
    const invited = String(query.invited || '') === '1'

    return {
      isTokenAvailable: Boolean(token && email),
      token: token || null,
      email: email || null,
      invited,
    }
  },
  data() {
    return {
      showSuccess: false,
      isPasswordUpdated: false,
      invited: false,
      seo: {
        title: 'Reset Password | NWLR Online',
        description: 'Reset your password for your NWLR Online account',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
  methods: {
    toggleSuccess(status = false) {
      this.showSuccess = status
    },
    togglePasswordUpdated(status = false) {
      this.isPasswordUpdated = status
    },
  },
}
</script>
