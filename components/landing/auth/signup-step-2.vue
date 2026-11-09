<template>
  <div class="px-4 sm:px-6 lg:px-8 my-2">
    <!-- Hero -->
    <div class="max-w-[85rem] md:max-w-[40rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        Sign Up
      </h1>
      <div class="w-full flex justify-end">
        <button
          type="button"
          class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm bg-[#08085E] text-[#fff] my-5"
          @click.prevent="goBack"
        >
          <i class="ri-arrow-left-s-line text-[#fff]"></i>
          Back
        </button>
      </div>
      <!-- Form -->
      <div
        class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-3 gap-4 md:gap-8"
      >
        <div class="relative">
          <label for="input-label" class="block text-sm font-medium mb-2"
            >Country</label
          >
          <select
            class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.country.$error,
            }"
            v-model="selectedCountry"
            @change="updateStates"
          >
            <option :selected="selectedCountry == null ? true : false">
              Select Country
            </option>
            <template v-if="countryList">
              <option
                v-for="country in countryList"
                :key="country.name"
                :value="country"
              >
                {{ country.name }}
              </option>
            </template>
          </select>
          <div
            class="absolute top-10 right-4 cursor-pointer"
            v-show="$v.country.$error"
          >
            <i class="ri-information-fill text-[#E02424]" />
          </div>
          <utils-input-validation
            :field="$v.country"
            :field-name="'Country'"
            v-show="$v.country.$error"
          />
        </div>
        <div class="relative">
          <label for="input-label" class="block text-sm font-medium mb-2"
            >State</label
          >
          <select
            class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.state.$error,
            }"
            v-model="selectedState"
            @change="updateLocalGovernments"
          >
            <option :selected="selectedState == null ? true : false">
              Select State
            </option>
            <template v-if="stateList">
              <option
                v-for="state in stateList"
                :key="state.name"
                :value="state"
              >
                {{ state.name }}
              </option>
            </template>
          </select>
          <div
            class="absolute top-10 right-4 cursor-pointer"
            v-show="$v.state.$error"
          >
            <i class="ri-information-fill text-[#E02424]" />
          </div>
          <utils-input-validation
            :field="$v.state"
            :field-name="'State'"
            v-show="$v.state.$error"
          />
        </div>
        <div class="relative">
          <label for="input-label" class="block text-sm font-medium mb-2"
            >Area</label
          >
          <input
            type="text"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.area.$error,
            }"
            placeholder="Enter your Area"
            v-model="area"
            v-if="areaManualFill"
          />
          <select
            class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.area.$error,
            }"
            v-model="selectedLocalGovernment"
            @change="selectArea"
            v-else
          >
            <option :selected="selectedLocalGovernment == null ? true : false">
              Select Area
            </option>
            <template v-if="citiesList">
              <option
                v-for="localGovernment in citiesList"
                :key="localGovernment.name"
              >
                {{ localGovernment.name }}
              </option>
            </template>
          </select>
          <div
            class="absolute top-10 right-4 cursor-pointer"
            v-show="$v.area.$error"
          >
            <i class="ri-information-fill text-[#E02424]" />
          </div>
          <utils-input-validation
            :field="$v.area"
            :field-name="'Area'"
            v-show="$v.area.$error"
          />
        </div>
        <div class="col-span-3 relative">
          <label for="input-label" class="block text-sm font-medium mb-2"
            >Address</label
          >
          <input
            type="text"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.address.$error,
            }"
            placeholder="Enter your address"
            v-model="address"
          />
          <div
            class="absolute top-10 right-4 cursor-pointer"
            v-show="$v.address.$error"
          >
            <i class="ri-information-fill text-[#E02424]" />
          </div>
          <utils-input-validation
            :field="$v.address"
            :field-name="'Address'"
            v-show="$v.address.$error"
          />
        </div>
        <!-- <div class="col-span-2 mt-6 grid gap-3 w-full flex justify-center">
          <button
            type="button"
            class="py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            Proceed
          </button>
        </div> -->
        <div class="col-span-3 mt-6 grid gap-3 w-full flex justify-center">
          <utils-button
            class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10"
            :on-click="sendUserDataToBackend"
            :button-state="isLoading"
          >
            Proceed
          </utils-button>
        </div>
      </div>
      <!-- End Form -->
      <!-- modal -->
      <div v-if="termsModalState">
        <landing-auth-terms-modal @toggle-modal="toggleTermsModal" />
      </div>
    </div>
    <!-- End Hero -->
  </div>
</template>

<script>
import data from '@/data/countries_data.js'
import { required } from 'vuelidate/lib/validators'
import GtagEvents from '~/mixins/GtagEvents.js'

export default {
  mixins: [GtagEvents],
  data() {
    return {
      countryList: data.countries(),
      stateList: null,
      citiesList: null,
      selectedCountry: null,
      selectedState: null,
      selectedLocalGovernment: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      email: null,
      password: null,
      confirmPassword: null,
      country: null,
      state: null,
      area: null,
      address: null,
      agreeToTerms: null,
      termsModalState: false,
      areaManualFill: false,
      isLoading: false,
    }
  },
  validations: {
    country: {
      required,
    },
    state: {
      required,
    },
    area: {
      required,
    },
    address: {
      required,
    },
  },
  methods: {
    toggleTermsModal() {
      this.termsModalState = !this.termsModalState
    },
    updateStates() {
      this.selectedState = null // Reset selected state when changing country
      this.selectedLocalGovernment = null
      this.area = null
      this.areaManualFill = false
      this.citiesList = []

      if (!this.selectedCountry || !this.selectedCountry.isoCode) {
        this.stateList = []
        this.country = null
        return
      }

      try {
        this.stateList = data.states(this.selectedCountry.isoCode)
        this.country = this.selectedCountry.name
      } catch (error) {
        this.stateList = []
        this.country = this.selectedCountry.name || null
      }
    },
    updateLocalGovernments() {
      this.selectedLocalGovernment = null // Reset selected local government when changing state
      this.area = null
      this.areaManualFill = false

      if (
        !this.selectedCountry ||
        !this.selectedCountry.isoCode ||
        !this.selectedState ||
        !this.selectedState.isoCode
      ) {
        this.citiesList = []
        this.state = null
        return
      }

      try {
        this.citiesList = [
          ...data.cities(
            this.selectedCountry.isoCode,
            this.selectedState.isoCode
          ),
          { name: 'Others' },
        ]
        this.state = this.selectedState.name
      } catch (error) {
        this.citiesList = []
        this.state = this.selectedState.name || null
      }
    },
    selectArea() {
      this.area = this.selectedLocalGovernment
      if (this.area == 'Others') {
        this.areaManualFill = true
        this.area = null
      }
    },
    // retrieve what I saved in LocalStorage in step 1
    getUserData() {
      try {
        const userData = JSON.parse(localStorage.getItem('nwlr_user'))
        this.firstName = userData.firstName
        this.lastName = userData.lastName
        this.phoneNumber = userData.phoneNumber
        this.email = userData.email
        this.password = userData.password
        this.confirmPassword = userData.confirmPassword
        return true
      } catch (error) {
        return false
      }
    },
    goBack() {
      this.$router.go(-1) // Navigate back one step in the history
    },
    async sendUserDataToBackend() {
      // check if country, state and local government are selected
      this.$v.$touch()
      if (this.$v.$invalid) return false
      this.isLoading = true
      const userData = {
        firstname: this.firstName,
        lastname: this.lastName,
        phone: this.phoneNumber,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        country: this.country,
        state: this.state,
        area: this.area,
        address: this.address,
      }
      try {
        const response = await this.$api.auth.register(userData)
        if (process.client && this.$gtag) {
          this.$gtag('event', 'sign_up', {
            method: 'email',
          })
        }
        // Remove the staged registration data and set a one-time notice
        // for the success screen. The notice is consumed after navigation so
        // it is not lost during the route transition or repeated on refresh.
        localStorage.removeItem('nwlr_user')
        sessionStorage.setItem('nwlr_registration_verification_notice', '1')
        await this.$router.push('/auth/registration-successful')
      } catch (error) {
        const completionCode = error?.response?.data?.data?.code
        if (completionCode === 'corporate_invitation_completion_required') {
          localStorage.removeItem('nwlr_user')
          sessionStorage.setItem('nwlr_corporate_invitation_notice', '1')
          await this.$router.push('/auth/registration-successful?corporate_invitation=1')
          return
        }

        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
        this.$notify({
          type: 'error',
          title: 'Error',
          text: errorResponse.message,
          duration: 5000,
        })
      } finally {
        this.isLoading = false
      }
    },
  },
  mounted() {
    if (!this.getUserData()) this.$router.push('/auth/register-step-1')
  },
}
</script>
