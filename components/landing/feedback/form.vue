<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <div class="max-w-[85rem] mx-auto">
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20">
        <div class="mb-10">
          <h1
            class="block text-xl font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
          >
            Feedback
          </h1>

          <div
            class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-2 gap-4 md:gap-8"
          >
            <div>
              <label class="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your fullname"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="text"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
                placeholder="Enter your subject"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium mb-2">Issue Type</label>
              <select
                class="bg-[#E6E6F4] py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              >
                <option selected>Select Issue Type</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-16">
          <div class="col-span-2">
            <label class="block text-sm font-medium mb-2">
              Details Description
            </label>
            <textarea
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              rows="10"
              placeholder="Enter your details description"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="mt-6 gap-3 w-full flex justify-center">
        <button
          type="button"
          class="py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          @click.prevent="trackFeedbackSubmitClick"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import GtagEvents from '~/mixins/GtagEvents.js'

export default {
  name: 'FeedbackForm',
  mixins: [GtagEvents],

  methods: {
    trackFeedbackSubmitClick() {
      this.trackGtagEvent('feedback_submit_click', {
        form_name: 'Feedback',
      })
    },
  },
}
</script>
