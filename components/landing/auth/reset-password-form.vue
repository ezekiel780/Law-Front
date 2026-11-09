<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <!-- Hero -->
    <div class="max-w-[85rem] md:max-w-[26rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        Reset Password
      </h1>
      <!-- Form -->
      <div
        class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-2 gap-4 md:gap-8"
      >
        <div class="col-span-2 relative">
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
            @keyup.enter="submitForm"
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
        <div class="col-span-2 mt-6 grid gap-3 w-full flex justify-center">
          <utils-button
            class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10"
            :on-click="submitForm"
            :button-state="isLoading"
          >
            Reset Password
          </utils-button>
        </div>
      </div>
      <!-- End Form -->
    </div>
    <!-- End Hero -->
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'ResetNewPasswordForm',
  props: {
    onSubmitForm: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      email: null,
      isLoading: false,
    }
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  methods: {
    getCallbackUrl() {
      const url = new URL(window.location.href)
      return `${url.protocol}//${url.host}/auth/reset-password`
    },
    async submitForm() {
      this.$v.$touch()
      if (this.$v.$invalid) return false

      this.isLoading = true
      try {
        const { data } = await this.$api.auth.resetPassword({
          email: this.email,
          callback_url: this.getCallbackUrl(),
        })
        this.$emit('reset-request-accepted', true)
        this.$notify({
          type: 'success',
          title: 'Success',
          text: data.message,
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
