<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <!-- Hero -->
    <div class="max-w-[85rem] mx-auto">
      <!-- Grid -->
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div class="mb-10">
          <h1
            class="block text-xl font-bold text-[#1A1A1A] sm:text-2xl lg:text-5xl leading-10"
            id="calisto-font-bold"
          >
            Most Authoritative, Consistent, Exhaustive Law Reports in Nigeria
          </h1>
          <div class="mt-6 text-[#4A4A4A] font-light flex flex-col space-y-4">
            <div class="flex items-center gap-x-4">
              <img class="" src="@/assets/icons/plus.svg" alt="Plus Icon" />
              <span> Nigeria's Leading Law Reports </span>
            </div>
            <div class="flex items-center gap-x-4">
              <img class="" src="@/assets/icons/plus.svg" alt="Plus Icon" />
              <span> Up-to-date publications of the latest Judgment. </span>
            </div>
            <div class="flex items-center gap-x-4">
              <img class="" src="@/assets/icons/plus.svg" alt="Plus Icon" />
              <span>
                Relevant materials including: Statutes &amp; Rules and Laws of
                the Federation.
              </span>
            </div>
            <div class="flex items-center gap-x-4">
              <img class="" src="@/assets/icons/plus.svg" alt="Plus Icon" />
              <span> Access to over 50,000 Cases. </span>
            </div>
          </div>

          <!-- Button -->
          <div
            class="mt-7 grid content-center items-center gap-3 w-full sm:inline-flex"
          >
            <nuxt-link to="/auth/register-step-1" v-if="!isAuthenticated">
              <button
                type="button"
                class="py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border-[1px] border-[#08085E] font-medium bg-[#08085E] text-[#fff] hover:bg-[#fff] hover:text-[#08085E] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
              >
                Get Started
              </button>
            </nuxt-link>

            <p class="font-medium" v-if="!isAuthenticated">OR</p>

            <div class="">
              <nuxt-link to="/auth/login" v-if="!isAuthenticated">
                <button
                  type="button"
                  class="w-[13rem] py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border-[1px] border-[#08085E] font-medium text-[#08085E] hover:text-[#fff] hover:bg-[#08085E] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
                >
                  Login
                </button>
              </nuxt-link>
              <p class="italic text-[#4A4A4A] text-xs" v-if="!isAuthenticated">
                If you are already registered.
              </p>
              <nuxt-link to="/dashboard" v-if="isAuthenticated">
                <button
                  type="button"
                  class="py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border-[1px] border-[#08085E] font-medium text-[#08085E] hover:text-[#fff] hover:bg-[#08085E] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
                >
                  Dashboard
                </button>
              </nuxt-link>
            </div>
          </div>
          <!-- End Button -->
        </div>
        <!-- End Col -->

        <div class="">
          <img
            class="w-full h-auto"
            src="@/assets/images/hero-v2.png"
            alt="Hero Image"
          />
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->
    </div>
    <!-- End Hero -->
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    isAuthenticated() {
      return this.$user.getIsLoggedIn()
    },
  },
}
</script>
