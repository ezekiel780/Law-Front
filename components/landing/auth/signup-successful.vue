<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <!-- Hero -->
    <div class="max-w-[85rem] md:max-w-[40rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        {{ corporateInvitation ? 'Complete Your Corporate Invitation' : 'Sign Up Successful' }}
      </h1>
      <div class="w-full flex justify-center">
        <img class="" src="~assets/images/mail-sent.gif" alt="" srcset="" />
      </div>
      <p class="text-sm text-[#7C7C7C] text-center my-8">
        <template v-if="corporateInvitation">
          This email already belongs to an invited corporate user. A fresh
          invitation link has been sent. Open that link to verify your email,
          complete your basic details, and create your password.
        </template>
        <template v-else>
          Your account has been created. Check your email and use the verification
          link before signing in.
        </template>
      </p>
    </div>
    <!-- End Hero -->
  </div>
</template>

<script>
import data from '@/data/countries_data.js'
export default {
  data() {
    return {
      corporateInvitation: false,
      countryList: data,
      selectedCountry: null,
      selectedState: null,
      selectedLocalGovernment: null,
    }
  },
  mounted() {
    this.corporateInvitation = String(this.$route.query.corporate_invitation || '') === '1'
    if (
      process.client &&
      sessionStorage.getItem('nwlr_corporate_invitation_notice') === '1'
    ) {
      sessionStorage.removeItem('nwlr_corporate_invitation_notice')
      this.$notify({
        type: 'success',
        title: 'Invitation sent',
        text: 'Open the fresh corporate invitation email to verify your address, complete your details, and create your password.',
        duration: 9000,
      })
      return
    }

    if (
      process.client &&
      sessionStorage.getItem('nwlr_registration_verification_notice') === '1'
    ) {
      sessionStorage.removeItem('nwlr_registration_verification_notice')
      this.$notify({
        type: 'success',
        title: 'Registration successful',
        text: 'Your account has been created. Check your email and verify your email address before signing in.',
        duration: 8000,
      })
    }
  },
  methods: {
    updateStates() {
      this.selectedState = null // Reset selected state when changing country
    },
    updateLocalGovernments() {
      this.selectedLocalGovernment = null // Reset selected local government when changing state
    },
  },
}
</script>
