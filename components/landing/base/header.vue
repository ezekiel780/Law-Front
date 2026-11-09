<template>
  <header
    class="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-3 sm:py-0"
    :class="{ 'border-b-[1px] border-b-[#08085E] mb-5': openNavbar }"
  >
    <nav
      class="relative max-w-[85rem] w-full mx-auto px-4 sm:py-6 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex items-center justify-between">
        <nuxt-link
          class="flex-none border-r-[0.188rem] rounded-r-sm pr-4 sm:pr-7"
          to="/"
          aria-label="Nigerian Weekly Law Reports home"
        >
          <img
            src="@/assets/icons/logo-v2.svg"
            alt="Nigerian Weekly Law Reports"
            class="h-10 w-auto object-contain sm:hidden"
          />
          <img
            src="/nwlr-logo.png"
            alt="Nigerian Weekly Law Reports"
            class="hidden h-12 w-auto max-w-[12rem] object-contain sm:block"
          />
        </nuxt-link>
        <div class="sm:hidden">
          <button
            type="button"
            class="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
            data-hs-collapse="#navbar-collapse-with-animation"
            aria-controls="navbar-collapse-with-animation"
            aria-label="/. navigation"
            @click="toggleNavbar(!openNavbar)"
          >
            <svg
              class="hs-collapse-open:hidden w-4 h-4"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
            <svg
              class="hs-collapse-open:block hidden w-4 h-4"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>
      </div>
      <!-- navbar list -->
      <div
        id="navbar-collapse-with-animation"
        class="hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
        :class="{ hidden: !openNavbar }"
      >
        <div
          class="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7"
        >
          <nuxt-link
            class="font-medium text-[#1A1A1A] hover:border-b-2 border-[#DDC524] rounded-b-sm"
            to="/"
            >Home
          </nuxt-link>
          <nuxt-link
            class="font-medium text-[#1A1A1A] hover:border-b-2 border-[#DDC524] rounded-b-sm"
            to="/dashboard/legal-research"
            >Legal Research
          </nuxt-link>
          <a
            class="font-medium text-[#1A1A1A] hover:border-b-2 border-[#DDC524] rounded-b-sm group"
            href="javascript:void(0);"
          >
            About Us

            <div
              class="absolute top-14 bg-[#08085E] rounded-lg hidden group-hover:flex flex-col gap-y-3 p-4 ml-[-2rem]"
            >
              <nuxt-link
                class="font-medium text-white hover:border-b-2 border-[#DDC524] rounded-b-sm"
                to="/about-us"
              >
                NWLR
              </nuxt-link>
              <nuxt-link
                class="font-medium text-white hover:border-b-2 border-[#DDC524] rounded-b-sm"
                to="/editorial-board"
              >
                Editorial Team
              </nuxt-link>
            </div>
          </a>
          <nuxt-link
            class="font-medium text-[#1A1A1A] hover:border-b-2 border-[#DDC524] rounded-b-sm"
            to="/dictionary-hardcopy"
            >Dictionary (Hardcopy)</nuxt-link
          >
          <nuxt-link
            class="font-medium text-[#1A1A1A] hover:border-b-2 border-[#DDC524] rounded-b-sm"
            to="/contact-us"
            >Enquiries</nuxt-link
          >

          <div
            class="flex flex-col md:flex-row md:items-center gap-y-6 md:gap-y-0 gap-x-6 sm:ml-auto"
          >
            <nuxt-link
              class="flex items-center gap-x-2 font-medium text-[#08085E] hover:text-[#3939A2]"
              to="/auth/login"
              v-if="!isAuthenticated"
            >
              Login
            </nuxt-link>
            <button
              type="button"
              class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
              v-if="!isAuthenticated"
            >
              <nuxt-link to="/auth/register-step-1"> Sign Up </nuxt-link>
            </button>
            <button
              type="button"
              class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
              v-if="isAuthenticated"
            >
              <nuxt-link to="/dashboard"> Dashboard </nuxt-link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'LandingHeader',
  data() {
    return {
      openNavbar: false,
    }
  },
  computed: {
    isAuthenticated() {
      return this.$user.getIsLoggedIn()
    },
  },
  methods: {
    toggleNavbar(status = false) {
      this.openNavbar = status
    },
  },
  mounted() {},
}
</script>
