<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <div class="max-w-[85rem] md:max-w-[32rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        {{ invited ? 'Complete Your Account' : 'Set New Password' }}
      </h1>
      <p v-if="invited" class="mt-3 text-center text-sm leading-6 text-[#6B7280]">
        Complete your basic details and create the password you will use to sign
        in to NWLR Online.
      </p>

      <div class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-2 gap-4 md:gap-6">
        <template v-if="invited">
          <div class="relative">
            <label class="block text-sm font-medium mb-2">First Name</label>
            <input
              v-model.trim="firstname"
              type="text"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              :class="{ 'border-[1px] border-[#F05252] bg-[#FDF2F2]': $v.firstname.$error }"
              @input="$helper.resetInputValidation($v)"
            />
            <utils-input-validation
              :field="$v.firstname"
              :field-name="'First Name'"
              v-show="$v.firstname.$error"
            />
          </div>
          <div class="relative">
            <label class="block text-sm font-medium mb-2">Last Name</label>
            <input
              v-model.trim="lastname"
              type="text"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              :class="{ 'border-[1px] border-[#F05252] bg-[#FDF2F2]': $v.lastname.$error }"
              @input="$helper.resetInputValidation($v)"
            />
            <utils-input-validation
              :field="$v.lastname"
              :field-name="'Last Name'"
              v-show="$v.lastname.$error"
            />
          </div>
          <div class="col-span-2 relative">
            <label class="block text-sm font-medium mb-2">Phone Number</label>
            <input
              v-model.trim="phone"
              type="tel"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              :class="{ 'border-[1px] border-[#F05252] bg-[#FDF2F2]': $v.phone.$error }"
              @input="$helper.resetInputValidation($v)"
            />
            <utils-input-validation
              :field="$v.phone"
              :field-name="'Phone Number'"
              v-show="$v.phone.$error"
            />
          </div>
          <div class="col-span-2 relative">
            <label class="block text-sm font-medium mb-2">Address <span class="font-normal text-gray-500">(optional)</span></label>
            <input
              v-model.trim="address"
              type="text"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            />
          </div>
        </template>

        <div class="col-span-2 relative">
          <label class="block text-sm font-medium mb-2">New Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.password.$error,
            }"
            placeholder="********"
            v-model="password"
            @keyup.enter="submit"
            @input="$helper.resetInputValidation($v)"
          />
          <button
            class="absolute top-10 right-4 cursor-pointer"
            type="button"
            @click="showPasswordToggle"
            v-if="!$v.password.$error"
          >
            <i class="ri-eye-line" v-show="!showPassword" />
            <i class="ri-eye-close-line" v-show="showPassword" />
          </button>
          <utils-input-validation
            :field="$v.password"
            :field-name="'Password'"
            v-show="$v.password.$error"
          />
          <p class="mt-2 text-xs text-gray-500">
            Use at least 8 characters with uppercase, lowercase, a number, and a special character.
          </p>
        </div>
        <div class="col-span-2 relative">
          <label class="block text-sm font-medium mb-2">Confirm New Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.confirmPassword.$error,
            }"
            placeholder="********"
            v-model="confirmPassword"
            @input="$helper.resetInputValidation($v)"
            @keyup.enter="submit"
          />
          <utils-input-validation
            :field="$v.confirmPassword"
            :field-name="'Confirm Password'"
            v-show="$v.confirmPassword.$error"
          />
        </div>
        <div class="col-span-2 mt-6 grid gap-3 w-full flex justify-center">
          <utils-button
            class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10"
            :on-click="submit"
            :button-state="isLoading"
          >
            {{ invited ? 'Complete Account' : 'Set Password' }}
          </utils-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'ResetNewPasswordForm',
  props: {
    token: { type: String, default: '' },
    email: { type: String, default: '' },
    invited: { type: Boolean, default: false },
  },
  data: () => ({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    isLoading: false,
  }),
  validations() {
    const requiredWhenInvited = this.invited ? { required } : {}
    return {
      firstname: requiredWhenInvited,
      lastname: requiredWhenInvited,
      phone: requiredWhenInvited,
      password: {
        required,
        minLength: minLength(8),
        passwordPolicy: (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
            value || ''
          ),
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password'),
      },
    }
  },
  methods: {
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return false
      this.isLoading = true
      try {
        await this.$api.auth.updatePassword({
          token: this.token,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
          firstname: this.invited ? this.firstname : undefined,
          lastname: this.invited ? this.lastname : undefined,
          phone: this.invited ? this.phone : undefined,
          address: this.invited ? this.address : undefined,
        })
        this.$emit('password-updated', true)
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

    showPasswordToggle() {
      this.showPassword = !this.showPassword
    },
  },
}
</script>
