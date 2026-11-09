<template>
  <div class="my-2 py-10">
    <!-- Hero -->
    <div class="max-w-[85rem] mx-auto">
      <!-- Grid -->
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div
          class="p-4 sm:p-6 lg:p-8 bg-[#eff0f4] h-[25rem]"
          v-if="true === false"
        >
          <p class="text-[#DDC524]">Newsletter</p>
          <h4 class="text-[#1A1A1A] text-2xl font-semibold mt-6">
            Subscribe to our Newsletter
          </h4>
          <p class="mt-6 font-light text-[#4A4A4A] text-sm">
            Stay updated with new publications as they are released. We'll send
            you official updates directly to your email. You may unsubsribe at
            any time in your browser settings.
          </p>
          <div class="mt-6">
            <label for="input-label" class="block text-sm font-medium mb-2"
              >Email</label
            >
            <input
              type="email"
              id="input-label"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="you@site.com"
            />
          </div>
          <div class="mt-6 grid gap-3 w-full flex justify-center">
            <button
              type="button"
              class="py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
            >
              Subscribe
            </button>
          </div>
        </div>
        <!-- End Col -->

        <div class="p-4 sm:p-6 lg:px-8 bg-[#eff0f4] h-[25rem]">
          <p class="text-[#DDC524]">Links</p>
          <h4 class="text-[#1A1A1A] text-2xl font-semibold mt-6">
            Relevant Links
          </h4>
          <div class="mt-12 text-sm font-light">
            <nuxt-link to="/supreme-court">
              <div class="flex items-center gap-x-4">
                <img
                  class=""
                  src="@/assets/icons/hyperlink.svg"
                  alt="hyperlink Icon"
                />
                <span> Justices of The Supreme Court </span>
              </div>
            </nuxt-link>
            <nuxt-link to="/court-of-appeal">
              <div class="flex items-center gap-x-4 mt-4">
                <img
                  class=""
                  src="@/assets/icons/hyperlink.svg"
                  alt="hyperlink Icon"
                />
                <span> Justices of The Court of Appeal </span>
              </div>
            </nuxt-link>
            <nuxt-link to="/body-of-benchers">
              <div class="flex items-center gap-x-4 mt-4">
                <img
                  class=""
                  src="@/assets/icons/hyperlink.svg"
                  alt="hyperlink Icon"
                />
                <span> Legal Practitioners Disciplinary Committee </span>
              </div>
            </nuxt-link>
            <nuxt-link to="/webinar">
              <div class="flex items-center gap-x-4 mt-4">
                <img
                  class=""
                  src="@/assets/icons/hyperlink.svg"
                  alt="hyperlink Icon"
                />
                <span> Webinar - Technology & Law Practice in Nigeria </span>
              </div>
            </nuxt-link>
          </div>
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->
    </div>
    <!-- End Hero -->
  </div>
</template>
