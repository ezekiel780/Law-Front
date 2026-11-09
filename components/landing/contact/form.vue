<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <!-- Hero -->
    <div class="max-w-[85rem] mx-auto">
      <!-- Grid -->
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div class="mb-10">
          <h1
            class="block text-xl font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
          >
            Contact Us
          </h1>
          <div
            class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-2 gap-4 md:gap-8"
          >
            <div class="relative">
              <label class="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your fullname"
                :class="{
                  'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                    $v.name.$error,
                }"
                @input="$helper.resetInputValidation($v)"
                v-model="name"
              />
              <div
                class="absolute top-10 right-4 cursor-pointer"
                v-show="$v.name.$error"
              >
                <i class="ri-information-fill text-[#E02424]" />
              </div>
              <utils-input-validation
                :field="$v.name"
                :field-name="'Full Name'"
                v-show="$v.name.$error"
              />
            </div>
            <div class="relative">
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your email"
                :class="{
                  'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                    $v.email.$error,
                }"
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
              <label class="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="text"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your phone number"
                :class="{
                  'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                    $v.phoneNumber.$error,
                }"
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
                :field-name="'Phone Number'"
                v-show="$v.phoneNumber.$error"
              />
            </div>
            <div class="relative">
              <label class="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your subject"
                :class="{
                  'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                    $v.title.$error,
                }"
                @input="$helper.resetInputValidation($v)"
                v-model="title"
              />
              <div
                class="absolute top-10 right-4 cursor-pointer"
                v-show="$v.title.$error"
              >
                <i class="ri-information-fill text-[#E02424]" />
              </div>
              <utils-input-validation
                :field="$v.title"
                :field-name="'Subject'"
                v-show="$v.title.$error"
              />
            </div>
            <div class="col-span-2 relative">
              <label class="block text-sm font-medium mb-2"
                >Details Description</label
              >
              <textarea
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                rows="7"
                placeholder="Enter your message"
                :class="{
                  'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
                    $v.message.$error,
                }"
                @input="$helper.resetInputValidation($v)"
                v-model="message"
              >
              </textarea>
              <div
                class="absolute top-10 right-4 cursor-pointer"
                v-show="$v.message.$error && true === false"
              >
                <i class="ri-information-fill text-[#E02424]" />
              </div>
              <utils-input-validation
                :field="$v.message"
                :field-name="'Details Description'"
                v-show="$v.message.$error"
              />
            </div>
            <div class="mt-6 gap-3 w-full flex justify-start">
              <utils-button
                class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10"
                :on-click="validateForm"
                :button-state="isLoading"
              >
                Submit
              </utils-button>
            </div>
          </div>
        </div>
        <!-- End Col -->

        <div class="">
          <!-- <img
            class="w-full h-auto rounded-md"
            src="@/assets/images/hero-v2.png"
            alt="Hero Image"
          /> -->
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->
    </div>
    <!-- End Hero -->
  </div>
</template>

<script>
import { required, email, minLength, numeric } from 'vuelidate/lib/validators'
import GtagEvents from '~/mixins/GtagEvents.js'

export default {
  mixins: [GtagEvents],
  data() {
    return {
      name: '',
      email: '',
      phoneNumber: '',
      title: '',
      message: '',
      isLoading: false,
    }
  },

  validations() {
    return {
      name: {
        required,
        minLength: minLength(3),
      },
      phoneNumber: {
        required,
        numeric,
        phoneLength: (value) => value && value.length === 11,
      },
      email: { required, email },
      title: {
        required,
        minLength: minLength(5),
      },
      message: {
        required,
        minLength: minLength(10),
      },
    }
  },

  methods: {
    validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) return false
      this.sendMessage()
    },

    async sendMessage() {
      this.isLoading = true
      try {
        const res = await this.$api.auth.contactUs({
          name: this.name,
          email: this.email,
          phoneNumber: this.phoneNumber,
          title: this.title,
          message: this.message,
        })
        if (process.client && this.$gtag) {
          this.$gtag('event', 'generate_lead', {
            form_name: 'Contact Us',
            method: 'website_contact_form',
          })
        }
        this.name = ''
        this.email = ''
        this.phoneNumber = ''
        this.title = ''
        this.message = ''
        this.$notify({
          type: 'success',
          title: 'SUCCESS',
          text: 'Message Sent Successfully!',
          duration: 5000,
        })
        this.$helper.resetInputValidation(this.$v)
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
