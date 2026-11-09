<template>
  <div class="px-4 sm:px-6 lg:px-8 my-2">
    <!-- Hero -->
    <div class="max-w-[85rem] md:max-w-[40rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        Sign Up
      </h1>
      <!-- Form -->
      <div
        class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-2 gap-4 md:gap-8"
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
            >Password</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.password.$error,
            }"
            placeholder="******"
            @input="$helper.resetInputValidation($v)"
            v-model="password"
          />
          <!-- password meter component -->
          <utils-password-meter
            v-show="password.length > 0"
            :password="password"
            @graded-result="handlePasswordScore"
            class="mt-3"
          />
          <div
            class="absolute top-10 right-4 cursor-pointer"
            type="button"
            @click="showPasswordToggle"
          >
            <i class="ri-eye-line" v-show="!showPassword" />
            <i class="ri-eye-close-line" v-show="showPassword" />
          </div>
          <div
            class="absolute top-10 right-10 cursor-pointer"
            v-show="$v.password.$error"
          >
            <i class="ri-information-fill text-[#E02424]" />
          </div>
          <utils-input-validation
            :field="$v.password"
            :field-name="'Password'"
            v-show="$v.password.$error"
          />
        </div>
        <div class="relative">
          <label for="input-label" class="block text-sm font-medium mb-2"
            >Confirm Password</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.confirmPassword.$error,
            }"
            placeholder="******"
            @input="$helper.resetInputValidation($v)"
            v-model="confirmPassword"
          />
          <div
            class="absolute top-10 right-4 cursor-pointer"
            type="button"
            @click="showPasswordToggle"
            v-if="!$v.password.$error"
          >
            <i class="ri-eye-line" v-show="!showPassword" />
            <i class="ri-eye-close-line" v-show="showPassword" />
          </div>
          <div
            class="absolute top-10 right-4 cursor-pointer"
            v-show="$v.confirmPassword.$error"
          >
            <i class="ri-information-fill text-[#E02424]" />
          </div>
          <utils-input-validation
            :field="$v.confirmPassword"
            :field-name="'Confirm password'"
            v-show="$v.confirmPassword.$error"
          />
        </div>

        <div class="col-span-2 mt-6 gap-2 w-full flex justify-center relative">
          <input
            type="checkbox"
            class="shrink-0 mt-0.5 border-gray-200 rounded text-white focus:ring-[#3939A2] checked:bg-[#08085E] checked:border-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.agreeToTerms.$error,
            }"
            v-model="agreeToTerms"
          />
          <label for="hs-default-checkbox" class="text-sm text-[#08085E]">
            By signing up using the Register button, you agree to our
            <span
              class="font-semibold cursor-pointer"
              @click.prevent="toggleTermsModal"
              >Terms & conditions.</span
            >
            <utils-input-validation
              :field="$v.agreeToTerms"
              :field-name="'Agree to terms'"
              v-show="$v.agreeToTerms.$error"
            />
          </label>
          <div
            class="absolute right-4 cursor-pointer"
            v-show="$v.agreeToTerms.$error"
          >
            <i class="ri-information-fill text-[#E02424]" />
          </div>
        </div>

        <div class="col-span-2 mt-6 grid gap-3 w-full flex justify-center">
          <utils-button
            class="py-3 px-10 border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
            :on-click="validateForm"
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
import { minLength } from 'vuelidate/lib/validators'
import { required, email, numeric, sameAs } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      termsModalState: false,
      agreeToTerms: null,
    }
  },
  validations() {
    return {
      firstName: {
        required,
        minLength: minLength(3),
      },
      lastName: {
        required,
        minLength: minLength(3),
      },
      phoneNumber: {
        required,
        numeric,
        phoneLength: (value) => value && value.length === 11,
      },
      email: { required, email },
      password: {
        required,
        passwordPolicy: (value) => {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
          return passwordRegex.test(value)
        },
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password'),
      },
      agreeToTerms: {
        required,
      },
    }
  },
  methods: {
    toggleTermsModal() {
      this.termsModalState = !this.termsModalState
    },
    showPasswordToggle() {
      this.showPassword = !this.showPassword
    },
    validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) return false

      // save to localStorage and go to next step
      if (this.saveToLocalStorage()) this.$router.push('/auth/register-step-2')
    },
    // turn everything to json object and save to LocalStorage
    saveToLocalStorage() {
      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      }
      localStorage.setItem('nwlr_user', JSON.stringify(user))
      return true
    },
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
    handlePasswordScore(score) {
      // trigger vuelidate to validate password field
      this.$v.password.$touch()
    },
  },
  mounted() {
    this.getUserData()
  },
}
</script>
