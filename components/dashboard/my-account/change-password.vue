<template>
  <div class="bg-white rounded-lg my-5 py-10 px-5">
    <div class="flex flex-col justify-center items-center gap-5">
      <h4 class="font-medium text-lg">Change Password</h4>
      <div class="w-full">
        <!-- Form -->
        <div
          class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-2 gap-4 md:gap-8"
        >
          <div class="relative">
            <label for="input-label" class="block text-sm font-medium mb-2"
              >Old Password</label
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
              v-show="$v.password.$error"
            >
              <i class="ri-information-fill text-[#E02424]" />
            </div>
            <utils-input-validation
              :field="$v.password"
              :field-name="'Old Password'"
              v-show="$v.password.$error"
            />
          </div>
          <div class="relative">
            <label for="input-label" class="block text-sm font-medium mb-2"
              >New Password</label
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
              :field-name="'New password'"
              v-show="$v.confirmPassword.$error"
            />
          </div>
        </div>
        <!-- End Form -->
      </div>
      <utils-button
        class="py-3 px-10 rounded-xl border font-medium border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
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
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      password: null,
      confirmPassword: null,
      showPassword: false,
      isLoading: false,
    }
  },
  validations() {
    return {
      password: { required },
      confirmPassword: { required },
    }
  },
  computed: {},
  methods: {
    showPasswordToggle() {
      this.showPassword = !this.showPassword
    },
    submitForm() {
      this.$v.$touch()
      if (this.$v.$invalid) return false

      this.changePassword()
    },
    async changePassword() {
      this.isLoading = true
      const userData = {
        old_password: this.password,
        new_password: this.confirmPassword,
      }

      try {
        const response = await this.$api.account.updatePassword(userData)
        this.password = null
        this.confirmPassword = null
        sessionStorage.setItem('nwlr_password_changed_notice', '1')
        await this.$user.logout({
          redirectTo: '/auth/login',
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.$nextTick(() => {
          this.$notify({
            type: 'error',
            title: 'Error',
            text: errorResponse.message,
            duration: 5000,
          })
        })
      } finally {
        this.isLoading = false
      }
    },
  },
  mounted() {
    this.firstName = this.user.firstname
    this.lastName = this.user.lastname
    this.phoneNumber = this.user.phone
    this.email = this.user.email
    this.address = this.user.address
    this.country = this.user.country
    this.state = this.user.state
    this.area = this.user.area
  },
}
</script>
