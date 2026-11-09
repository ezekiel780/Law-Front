<template>
  <div>
    <header>
      <div
        class="flex flex-row justify-between items-center gap-2 sm:flex-row sm:gap-3 pt-5"
      >
        <div>
          <p>{{ todaysDate }}</p>
          <p class="font-medium">Hi {{ greetingName }}, {{ greet }}</p>
        </div>

        <div class="flex justify-between gap-10">
          <div class="hidden md:flex gap-8 items-center">
            <nuxt-link to="/">
              <utils-svg-loader icon="home-icon" class="cursor-pointer" />
            </nuxt-link>
            <a
              href="https://shop.nigerianlawpublications.com/books"
              target="_blank"
              rel="noopener noreferrer"
            >
              <utils-svg-loader icon="cart-icon" class="cursor-pointer" />
            </a>
            <utils-svg-loader icon="bell-notice-icon" class="cursor-pointer" />
          </div>

          <div ref="profileMenu" class="relative">
            <button
              type="button"
              class="flex items-center gap-2 cursor-pointer"
              :aria-expanded="profileMenuOpen ? 'true' : 'false'"
              aria-haspopup="menu"
              @click="toggleProfileMenu"
              @keydown.esc.prevent="closeProfileMenu"
            >
              <utils-image-fallback
                :src="profilePicture"
                :alt="`${firstName}'s avatar`"
                :fallback-title="`${firstName} ${lastName}`"
                :initials="profileInitials"
                variant="avatar"
                container-class="h-12 w-12"
                image-class="object-cover"
              />

              <span class="font-medium text-[#08085E] hidden md:block">
                {{ firstName }} {{ lastName }}
              </span>
              <utils-svg-loader icon="arrow-down-icon" />
            </button>

            <div
              v-if="profileMenuOpen"
              class="absolute right-0 top-full mt-2 bg-[#08085EA1] md:bg-[#08085E] rounded-lg flex flex-col gap-y-3 p-4 w-44 text-left"
              style="z-index: 60"
              role="menu"
            >
              <nuxt-link
                to="/"
                class="md:hidden hover:border-b-2 border-[#DDC524] rounded-b-sm flex items-center gap-4"
                role="menuitem"
                @click.native="closeProfileMenu"
              >
                <utils-svg-loader icon="home-icon" class="cursor-pointer" />
                <span class="font-medium text-white">Home</span>
              </nuxt-link>

              <a
                href="https://shop.nigerianlawpublications.com/books"
                target="_blank"
                rel="noopener noreferrer"
                class="md:hidden hover:border-b-2 border-[#DDC524] rounded-b-sm flex items-center gap-4"
                role="menuitem"
                @click="closeProfileMenu"
              >
                <utils-svg-loader
                  icon="cart-icon"
                  class="cursor-pointer"
                  color="#fff"
                />
                <span class="font-medium text-white">Shop</span>
              </a>

              <button
                type="button"
                class="md:hidden hover:border-b-2 border-[#DDC524] rounded-b-sm flex items-center gap-4 text-left"
                role="menuitem"
                @click="closeProfileMenu"
              >
                <utils-svg-loader
                  icon="bell-notice-icon"
                  class="cursor-pointer"
                />
                <span class="font-medium text-white">Notice</span>
              </button>


              <nuxt-link
                v-if="isInstitutionalSession"
                to="/auth/login"
                class="font-medium text-white hover:border-b-2 border-[#DDC524] rounded-b-sm flex items-center gap-3"
                role="menuitem"
                @click.native="closeProfileMenu"
              >
                <i class="ri-login-box-line"></i>
                <span>Administrator login</span>
              </nuxt-link>

              <nuxt-link
                v-if="!isInstitutionalSession && !isIpUser"
                to="/dashboard/my-account"
                class="font-medium text-white hover:border-b-2 border-[#DDC524] rounded-b-sm flex items-center gap-3"
                role="menuitem"
                @click.native="closeProfileMenu"
              >
                <i class="ri-user-line"></i>
                <span>My Profile</span>
              </nuxt-link>

              <button
                v-if="!isInstitutionalSession"
                type="button"
                class="font-medium text-white hover:border-b-2 border-[#DDC524] rounded-b-sm flex items-center gap-3 text-left"
                role="menuitem"
                @click="logout"
              >
                <i class="ri-logout-box-r-line"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileMenuOpen: false,
    }
  },
  computed: {
    firstName() {
      return this.$user.getFirstName()
    },

    greetingName() {
      return this.isInstitutionalSession ? 'Reader' : this.firstName
    },

    lastName() {
      return this.$user.getLastName()
    },

    profilePicture() {
      return this.$user.getAvatar()
    },

    profileInitials() {
      return `${this.firstName?.charAt(0) || ''}${
        this.lastName?.charAt(0) || ''
      }`
    },

    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },

    isIpUser() {
      return this.$user.getIsIpUser()
    },

    greet() {
      return this.$helper.greetUser()
    },

    todaysDate() {
      return this.$moment().format('dddd Do, MMMM YYYY')
    },
  },
  watch: {
    $route() {
      this.closeProfileMenu()
    },
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    toggleProfileMenu() {
      this.profileMenuOpen = !this.profileMenuOpen
    },

    closeProfileMenu() {
      this.profileMenuOpen = false
    },

    handleOutsideClick(event) {
      if (!this.profileMenuOpen) return
      if (this.$refs.profileMenu?.contains(event.target)) return
      this.closeProfileMenu()
    },

    async logout() {
      this.closeProfileMenu()
      await this.$user.logout()
    },
  },
}
</script>
