<template>
  <div class="px-4 sm:px-6 lg:px-8 my-2">
    <!-- Hero -->
    <div class="max-w-[85rem] md:max-w-[26rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        Login
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
        <div class="col-span-2 relative">
          <label for="input-label" class="block text-sm font-medium mb-2"
            >Password</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            id="input-label"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            :class="{
              'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                $v.password.$error,
            }"
            placeholder="********"
            autocomplete="off"
            @input="$helper.resetInputValidation($v)"
            @keyup.enter="validateForm"
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
            :field-name="'Password'"
            v-show="$v.password.$error"
          />
          <div class="mt-4 flex justify-between">
            <span class="font-thin text-[#08085E]">
              New here?
              <nuxt-link
                to="/auth/register-step-1"
                class="text-[#DDC524] font-medium hover:underline"
              >
                Register
              </nuxt-link>
            </span>
            <nuxt-link
              to="/auth/reset-password"
              class="font-thin text-[#08085E]"
              >Forgot Password?</nuxt-link
            >
          </div>
        </div>
        <div class="col-span-2 mt-6 grid gap-3 w-full flex justify-center">
          <utils-button
            class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10"
            :on-click="validateForm"
            :button-state="isLoading"
          >
            Login
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
import { mapActions } from 'vuex'
import GtagEvents from '~/mixins/GtagEvents.js'

export default {
  mixins: [GtagEvents],
  data() {
    return {
      email: null,
      password: null,
      showPassword: false,
      isLoading: false,
    }
  },

  validations() {
    return {
      email: { required, email },
      password: { required },
    }
  },

  mounted() {
    if (typeof this.$route.query.email === 'string') {
      this.email = this.$route.query.email
    }

    if (String(this.$route.query.verified || '') === '1') {
      this.$notify({
        type: 'success',
        title: 'Email verified',
        text: 'Your email has been verified. You can now sign in.',
        duration: 5000,
      })
    }


    if (String(this.$route.query.email_changed || '') === '1') {
      this.$notify({
        type: 'info',
        title: 'Verify your new email',
        text: 'Your email address changed. Verify the new address before signing in again.',
        duration: 7000,
      })
    }


    if (
      process.client &&
      sessionStorage.getItem('nwlr_password_changed_notice') === '1'
    ) {
      sessionStorage.removeItem('nwlr_password_changed_notice')
      this.$notify({
        type: 'success',
        title: 'Password changed',
        text: 'Your password was changed successfully. Sign in again with your new password.',
        duration: 7000,
      })
    }
  },

  methods: {
    ...mapActions({
      saveLoginTime: 'app/UpdateLastLoginTime',
    }),
    showPasswordToggle() {
      this.showPassword = !this.showPassword
    },
    validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) return false
      this.login()
    },
    // login endpoint
    async login() {
      this.isLoading = true
      try {
        const response = await this.$api.auth.login({
          email: this.email,
          password: this.password,
        })
        if (process.client && this.$gtag) {
          this.$gtag('event', 'login', {
            method: 'email',
          })
        }
        const token = response.data.success.access_token
        const laravelToken = response.data.success.laravel_token
        const user = response.data.success.user || {}
        const isIpUser = Boolean(response.data.success.ipuser)
        const ipAccess = response.data.success.ip_access || null
        const sessionMode =
          response.data.success.session?.mode ||
          (isIpUser ? 'ip_user_account' : 'account')
        const requiresPasswordChange = Boolean(
          user.requires_password_change ||
            response.data?.requires_password_change ||
            response.data?.success?.requires_password_change
        )
        await this.$user.setToken(token)
        await this.$user.setLaravelToken(laravelToken)
        await this.$user.setFirstName(user.firstname || '')
        await this.$user.setLastName(user.lastname || '')
        await this.$user.setAvatar(user.avatar || null)
        await this.$user.setIsIpUser(isIpUser)
        await this.$user.setSessionMode(sessionMode)
        await this.$user.setIsLoggedIn(true)
        await this.$user.setRequiresPasswordChange(requiresPasswordChange)

        if (!requiresPasswordChange) {
          try {
            await this.$user.refreshAccess({ force: true })
          } catch (error) {
            // The dashboard and protected routes will retry current entitlement
            // synchronization. Login itself must not fail on a transient access
            // service error.
          }
        }
        this.saveLoginTime(Date.now())
        this.$router.push(
          requiresPasswordChange
            ? '/dashboard/password-change-required'
            : ipAccess?.administrator && ipAccess?.inside_network === false
            ? '/dashboard/my-subscription?ip_access=outside'
            : '/dashboard'
        )
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
        const message = String(errorResponse.message || '')
        const suspended = /account.+suspend|suspend.+account/i.test(message)
        this.$notify({
          type: 'error',
          title: suspended ? 'Account suspended' : 'Error',
          text: suspended
            ? 'Your account is suspended. Please contact Customer Service for assistance.'
            : message,
          duration: suspended ? 8000 : 5000,
        })
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
