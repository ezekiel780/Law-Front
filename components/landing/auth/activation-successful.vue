<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <!-- Hero -->
    <div class="max-w-[85rem] md:max-w-[40rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        Account activated
      </h1>
      <p class="text-sm text-[#7C7C7C] text-center my-8">
        Account activation successful, please login.
      </p>
      <div class="mt-6 gap-3 w-full flex justify-center">
        <button
          type="button"
          class="py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
        >
          <nuxt-link to="/auth/login">Login</nuxt-link>
        </button>
      </div>
    </div>
    <!-- End Hero -->
  </div>
</template>

<script>
import data from '@/data/countries_data.js'
export default {
  data() {
    return {
      countryList: data,
      selectedCountry: null,
      selectedState: null,
      selectedLocalGovernment: null,
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
