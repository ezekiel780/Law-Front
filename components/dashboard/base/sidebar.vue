<template>
  <div>
    <!-- Sidebar Toggle -->
    <div
      class="sticky top-0 inset-x-0 z-20 border-b-[1px] border-b-[#08085E] shadow-lg px-4 sm:px-6 md:px-8 lg:hidden bg-transparent"
    >
      <div class="flex justify-between items-center py-4">
        <!-- Navigation Toggle -->
        <button
          type="button"
          class="text-gray-500 hover:text-gray-600"
          aria-controls="application-sidebar-brand"
          :aria-expanded="String(isSidebarOpened)"
          aria-label="Toggle navigation"
          @click="toggleSidebar"
        >
          <span class="sr-only">Toggle Navigation</span>
          <svg
            class="w-5 h-5"
            width="16"
            height="16"
            fill="#08085E"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
        <!-- End Navigation Toggle -->

        <!-- Breadcrumb -->
        <ol
          class="hidden ml-3 flex items-center whitespace-nowrap min-w-0"
          aria-label="Breadcrumb"
        >
          <li
            class="flex items-center text-sm text-gray-800 dark:text-gray-400"
          >
            Application Layout
            <svg
              class="flex-shrink-0 mx-3 overflow-visible h-2.5 w-2.5 text-gray-400 dark:text-gray-600"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </li>
          <li
            class="text-sm font-semibold text-gray-800 truncate dark:text-gray-400"
            aria-current="page"
          >
            Dashboard
          </li>
        </ol>
        <!-- End Breadcrumb -->

        <nuxt-link
          class="flex-none text-xl font-semibold"
          to="/"
          aria-label="NWLR home"
        >
          <img
            class="h-10"
            src="@/assets/images/dashboard-logo.png"
            alt="NWLR Logo"
          />
        </nuxt-link>
      </div>
    </div>
    <!-- End Sidebar Toggle -->

    <!-- Mobile Backdrop -->
    <div
      v-show="isSidebarOpened"
      class="fixed inset-0 z-[50] bg-gray-600/75 lg:hidden"
      @click.prevent="isSidebarOpened = false"
    ></div>

    <!-- Sidebar -->
    <div
      id="application-sidebar-brand"
      class="fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white pt-7 pb-10 overflow-y-auto transform transition-transform duration-300 lg:translate-x-0 lg:block"
      :class="isSidebarOpened ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="mt-5 px-6">
        <nuxt-link
          class="flex-none text-xl font-semibold"
          to="/"
          aria-label="NWLR home"
        >
          <img src="@/assets/images/dashboard-logo.png" alt="NWLR Logo" />
        </nuxt-link>
      </div>

      <nav
        class="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
        data-hs-accordion-always-open
      >
        <ul
          class="space-y-5 text-[#B0B0B0]"
          @click.prevent="isSidebarOpened = false"
        >
          <li>
            <nuxt-link
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive('/dashboard'),
              }"
              to="/dashboard"
            >
              <utils-svg-loader icon="dashboard-icon" color="#B0B0B0" />
              Dashboard
            </nuxt-link>
          </li>

          <li v-if="showLegalResearch">
            <nuxt-link
              :to="featureDestination('/dashboard/legal-research', ['LEGAL_RESEARCH'])"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive(
                  '/dashboard/legal-research'
                ),
              }"
            >
              <utils-svg-loader icon="legal-research-icon" color="#B0B0B0" />
              <span class="flex-1">Legal Research</span>
              <span
                v-if="!isInstitutionalSession && !hasNwlrAccess"
                class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
              >
                Upgrade
              </span>
            </nuxt-link>
          </li>

          <li v-if="showLawDictionary">
            <nuxt-link
              :to="anyFeatureDestination('/dashboard/legal-dictionary', ncldSearchCapabilities)"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive(
                  '/dashboard/legal-dictionary'
                ),
              }"
            >
              <utils-svg-loader icon="legal-research-icon" color="#B0B0B0" />
              <span class="flex-1">Law Dictionary</span>
              <span
                v-if="!isInstitutionalSession && !hasNcldAccess"
                class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
              >
                Upgrade
              </span>
            </nuxt-link>
          </li>

          <li v-if="!isInstitutionalSession">
            <nuxt-link
              :to="featureDestination('/dashboard/my-research', ['LEGAL_RESEARCH', 'CASE_ACCESS'])"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive(
                  '/dashboard/my-research'
                ),
              }"
            >
              <utils-svg-loader icon="my-research-icon" color="#B0B0B0" />
              <span class="flex-1">My Research</span>
              <span
                v-if="!hasNwlrAccess"
                class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
              >
                Upgrade
              </span>
            </nuxt-link>
          </li>

          <li v-if="showSubscription">
            <nuxt-link
              to="/dashboard/my-subscription"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive(
                  '/dashboard/my-subscription'
                ),
              }"
            >
              <utils-svg-loader icon="my-subscription-icon" color="#B0B0B0" />
              My Subscription
            </nuxt-link>
          </li>

          <li>
            <nuxt-link
              to="/dashboard/statutes-and-rules"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-[#B0B0B0] hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive(
                  '/dashboard/statutes-and-rules'
                ),
              }"
            >
              <utils-svg-loader icon="statutes-rules-icon" color="#B0B0B0" />
              Statutes &amp; Rules
            </nuxt-link>
          </li>

          <li>
            <a
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-[#B0B0B0] hover:text-[#08085E] cursor-pointer"
              @click.prevent="
                openNewTab('https://shop.nigerianlawpublications.com/books')
              "
              target="_blank"
              :class="{
                'text-[#08085E] font-medium': isRouteActive('/dashboard/shop'),
              }"
            >
              <utils-svg-loader icon="shop-icon" color="#B0B0B0" />
              Shop
            </a>
          </li>

          <li>
            <nuxt-link
              to="/dictionary-hardcopy"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-[#B0B0B0] hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive('/dictionary-hardcopy'),
              }"
            >
              <utils-svg-loader icon="statutes-rules-icon" color="#B0B0B0" />
              Dictionary (Hardcopy)
            </nuxt-link>
          </li>

          <li v-if="!isInstitutionalSession && !isIpUser">
            <nuxt-link
              to="/dashboard/my-account"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-[#B0B0B0] hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive(
                  '/dashboard/my-account'
                ),
              }"
            >
              <utils-svg-loader icon="my-account-icon" color="#B0B0B0" />
              My Account
            </nuxt-link>
          </li>

          <li>
            <nuxt-link
              to="/dashboard/help"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-[#B0B0B0] hover:text-[#08085E]"
              :class="{
                'text-[#08085E] font-medium': isRouteActive('/dashboard/help'),
              }"
            >
              <utils-svg-loader icon="help-icon" color="#B0B0B0" />
              Help
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
    <!-- End Sidebar -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NCLD_SEARCH_CAPABILITIES } from '~/services/auth/ncld-access'

export default {
  name: 'Sidebar',
  data() {
    return {
      isSidebarOpened: false,
    }
  },
  computed: {
    ...mapGetters({
      isCorporateParent: 'user/getIsParent',
    }),

    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },

    isIpUser() {
      return this.$user.getIsIpUser()
    },

    hasNwlrAccess() {
      return this.$user.can('LEGAL_RESEARCH', 'CASE_ACCESS')
    },

    ncldSearchCapabilities() {
      return [...NCLD_SEARCH_CAPABILITIES]
    },

    hasNcldAccess() {
      return this.ncldSearchCapabilities.some((capability) =>
        this.$user.can(capability)
      )
    },

    showLegalResearch() {
      return !this.isInstitutionalSession || this.$user.can('LEGAL_RESEARCH')
    },

    showLawDictionary() {
      return !this.isInstitutionalSession || this.hasNcldAccess
    },

    showSubscription() {
      return !this.isInstitutionalSession
    },
  },
  methods: {
    featureDestination(route, capabilities = []) {
      const requiredCapabilities = Array.isArray(capabilities)
        ? capabilities
        : [capabilities]
      const missingCapability = requiredCapabilities.find(
        (capability) => !this.$user.can(capability)
      )

      return !missingCapability
        ? route
        : {
            path: '/dashboard/my-subscription',
            query: { required: missingCapability },
          }
    },

    anyFeatureDestination(route, capabilities = []) {
      const available = capabilities.some((capability) =>
        this.$user.can(capability)
      )

      return available
        ? route
        : {
            path: '/dashboard/my-subscription',
            query: { required: capabilities[0] || 'DICTIONARY_SEARCH' },
          }
    },

    toggleSidebar() {
      this.isSidebarOpened = !this.isSidebarOpened
    },

    isRouteActive(route) {
      if (route === '/dashboard') return this.$route.path === route
      else return this.$route.path.includes(route)
    },

    openNewTab(url) {
      window.open(url, '_blank')
    },
  },
  mounted() {},
}
</script>
