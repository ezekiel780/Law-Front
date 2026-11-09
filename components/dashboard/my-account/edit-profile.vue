<template>
  <div class="bg-white rounded-lg my-5 py-10 px-5">
    <div class="flex flex-col justify-center items-center gap-5">
      <h4 class="font-medium text-lg">My Account</h4>
      <div class="w-full">
        <!-- Form -->
        <div
          class="mt-6 text-[#4A4A4A] font-light grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
        >
          <div class="relative">
            <label for="input-label" class="block text-sm font-medium mb-2"
              >First name</label
            >
            <input
              type="text"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              :class="{
                'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                  $v.firstName.$error,
              }"
              placeholder="Enter your first name"
              @input="$helper.resetInputValidation($v)"
              v-model="firstName"
            />
            <div
              class="absolute top-10 right-4 cursor-pointer"
              v-show="$v.firstName.$error"
            >
              <i class="ri-information-fill text-[#E02424]" />
            </div>
            <utils-input-validation
              :field="$v.firstName"
              :field-name="'First name'"
              v-show="$v.firstName.$error"
            />
          </div>
          <div class="relative">
            <label for="input-label" class="block text-sm font-medium mb-2"
              >Last name</label
            >
            <input
              type="text"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="Enter your last name"
              @input="$helper.resetInputValidation($v)"
              :class="{
                'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                  $v.lastName.$error,
              }"
              v-model="lastName"
            />
            <div
              class="absolute top-10 right-4 cursor-pointer"
              v-show="$v.lastName.$error"
            >
              <i class="ri-information-fill text-[#E02424]" />
            </div>
            <utils-input-validation
              :field="$v.lastName"
              :field-name="'Last name'"
              v-show="$v.lastName.$error"
            />
          </div>
          <div class="relative">
            <label for="input-label" class="block text-sm font-medium mb-2"
              >Phone number</label
            >
            <input
              type="text"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              :class="{
                'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                  $v.phoneNumber.$error,
              }"
              placeholder="Enter your phone no"
              @input="$helper.resetInputValidation($v)"
              v-model="phoneNumber"
            />
            <div
              class="absolute top-10 right-4 cursor-pointer"
              v-show="$v.phoneNumber.$error"
            >
              <i class="ri-information-fill text-[#E02424]" />
            </div>
            <utils-input-validation
              :field="$v.phoneNumber"
              :field-name="'Phone number'"
              v-show="$v.phoneNumber.$error"
            />
          </div>
          <div class="relative">
            <label for="input-label" class="block text-sm font-medium mb-2"
              >Email</label
            >
            <input
              type="email"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              :class="{
                'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                  $v.email.$error,
              }"
              placeholder="Enter your email"
              @input="$helper.resetInputValidation($v)"
              v-model="email"
            />
            <div
              class="absolute top-10 right-4 cursor-pointer"
              v-show="$v.email.$error"
            >
              <i class="ri-information-fill text-[#E02424]" />
            </div>
            <utils-input-validation
              :field="$v.email"
              :field-name="'Email'"
              v-show="$v.email.$error"
            />
          </div>
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
              <option :value="null" disabled>Select Country</option>
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
              <option :value="null" disabled>Select State</option>
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
              <option :value="null" disabled>Select Area</option>
              <template v-if="citiesList">
                <option
                  v-for="localGovernment in citiesList"
                  :key="localGovernment.name"
                  :value="localGovernment.name"
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
          <div class="md:col-span-2 relative">
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
        </div>
        <!-- End Form -->
      </div>
      <utils-button
        class="py-3 px-10 rounded-xl border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
        :on-click="submitForm"
        :button-state="isLoading"
      >
        Save Changes
      </utils-button>
    </div>
  </div>
</template>

<script>
import { required, email, numeric } from 'vuelidate/lib/validators'
import data from '@/data/countries_data.js'

export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      countryList: data.countries(),
      stateList: [],
      citiesList: [],
      selectedCountry: null,
      selectedState: null,
      selectedLocalGovernment: null,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      country: '',
      state: '',
      area: '',
      address: '',
      isLoading: false,
      areaManualFill: false,
    }
  },
  validations() {
    return {
      firstName: { required },
      lastName: { required },
      phoneNumber: { required, numeric },
      email: { required, email },
      country: { required },
      state: { required },
      area: { required },
      address: { required },
    }
  },
  watch: {
    user: {
      immediate: true,
      deep: true,
      handler(user) {
        this.hydrateForm(user || {})
      },
    },
  },
  methods: {
    normalize(value) {
      return String(value || '').trim()
    },
    findByName(items, name) {
      const target = this.normalize(name).toLowerCase()
      if (!target) return null
      return (
        items.find(
          (item) => this.normalize(item.name).toLowerCase() === target
        ) || null
      )
    },
    hydrateForm(user) {
      this.firstName = this.normalize(user.firstname)
      this.lastName = this.normalize(user.lastname)
      this.phoneNumber = this.normalize(user.phone)
      this.email = this.normalize(user.email)
      this.address = this.normalize(user.address)
      this.country = this.normalize(user.country)
      this.state = this.normalize(user.state)
      this.area = this.normalize(user.area || user.city || user.town)

      this.selectedCountry = this.findByName(this.countryList, this.country)
      this.stateList = this.selectedCountry
        ? data.states(this.selectedCountry.isoCode)
        : []
      this.selectedState = this.findByName(this.stateList, this.state)
      this.citiesList = this.availableCities()

      const knownArea = this.findByName(this.citiesList, this.area)
      if (knownArea) {
        this.selectedLocalGovernment = knownArea.name
        this.areaManualFill = false
      } else if (this.area) {
        this.selectedLocalGovernment = 'Others'
        this.areaManualFill = true
      } else {
        this.selectedLocalGovernment = null
        this.areaManualFill = false
      }

      if (this.$v) this.$v.$reset()
    },
    availableCities() {
      if (!this.selectedCountry || !this.selectedState) return []

      try {
        return [
          ...data.cities(
            this.selectedCountry.isoCode,
            this.selectedState.isoCode
          ),
          { name: 'Others' },
        ]
      } catch (error) {
        return [{ name: 'Others' }]
      }
    },
    updateStates() {
      this.country = this.selectedCountry ? this.selectedCountry.name : ''
      this.state = ''
      this.area = ''
      this.selectedState = null
      this.selectedLocalGovernment = null
      this.areaManualFill = false
      this.stateList = this.selectedCountry
        ? data.states(this.selectedCountry.isoCode)
        : []
      this.citiesList = []
    },
    updateLocalGovernments() {
      this.state = this.selectedState ? this.selectedState.name : ''
      this.area = ''
      this.selectedLocalGovernment = null
      this.areaManualFill = false
      this.citiesList = this.availableCities()
    },
    selectArea() {
      if (this.selectedLocalGovernment === 'Others') {
        this.areaManualFill = true
        this.area = ''
        return
      }

      this.areaManualFill = false
      this.area = this.selectedLocalGovernment || ''
    },
    submitForm() {
      this.$v.$touch()
      if (this.$v.$invalid) return false
      this.updateProfile()
    },
    async updateProfile() {
      this.isLoading = true
      const emailChanged =
        String(this.email || '').trim().toLowerCase() !==
        String(this.user?.email || '').trim().toLowerCase()
      const userData = {
        firstname: this.firstName,
        lastname: this.lastName,
        phone: this.phoneNumber,
        email: this.email,
        address: this.address,
        country: this.country,
        state: this.state,
        town: this.area,
      }

      try {
        const response = await this.$api.account.updateProfile({
          ...userData,
          _emailChanged: emailChanged,
        })

        if (emailChanged || response?.emailChanged) {
          this.$notify({
            type: 'info',
            title: 'Email verification required',
            text: 'A verification link was sent to your new email address. Sign in again after verification.',
            duration: 7000,
          })
          await this.$user.logout({
            force: true,
            revoke: false,
            redirectTo: '/auth/login?email_changed=1',
          })
          return
        }

        const updatedUser = response?.data?.data || {}
        this.$emit('profile-updated', {
          ...userData,
          ...updatedUser,
          area: updatedUser.area || updatedUser.town || userData.town,
        })
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Profile updated successfully!',
          duration: 5000,
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
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
}
</script>
