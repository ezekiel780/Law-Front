<template>
  <div>
    <div class="bg-white rounded-lg my-5 py-10 px-5">
      <div
        class="flex flex-col gap-6 md:flex-row md:items-center md:gap-8"
      >
        <!-- avatar -->
        <div class="flex justify-center md:justify-start">
          <utils-image-fallback
            :src="user.avatar"
            :alt="`${user.firstname || 'User'}'s avatar`"
            :fallback-title="fullName"
            :initials="profileInitials"
            variant="avatar"
            container-class="h-24 w-24"
            image-class="object-cover"
          />
        </div>
        <!-- profile -->
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap gap-2">
            <div class="w-48">
              <span class="text-[#9C9C9C]">First Name</span><br />
              <span class="font-medium text-[#08085E]">{{
                user.firstname
              }}</span>
            </div>

            <div class="w-48">
              <span class="text-[#9C9C9C]">Last Name</span><br />
              <span class="font-medium text-[#08085E]">{{
                user.lastname
              }}</span>
            </div>

            <div class="w-48">
              <span class="text-[#9C9C9C]">Email</span><br />
              <span class="font-medium text-[#08085E]">{{ user.email }}</span>
            </div>

            <div class="w-48">
              <span class="text-[#9C9C9C]">Phone Number</span><br />
              <span class="font-medium text-[#08085E]">{{ user.phone }}</span>
            </div>

            <div class="w-48">
              <span class="text-[#9C9C9C]">Address</span><br />
              <span class="font-medium text-[#08085E]">{{ user.address }}</span>
            </div>

            <div class="w-48">
              <span class="text-[#9C9C9C]">City</span><br />
              <span class="font-medium text-[#08085E]">{{ user.area }}</span>
            </div>

            <div class="w-48">
              <span class="text-[#9C9C9C]">State</span><br />
              <span class="font-medium text-[#08085E]">{{ user.state }}</span>
            </div>

            <div class="w-48">
              <span class="text-[#9C9C9C]">Country</span><br />
              <span class="font-medium text-[#08085E]">{{ user.country }}</span>
            </div>
          </div>
        </div>
        <!-- actions -->
        <div>
          <div class="w-full flex flex-col gap-4">
            <utils-button
              class="py-3 px-10 rounded-xl border border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
              :on-click="showEditProfile"
            >
              Edit Profile
            </utils-button>
            <utils-button
              class="py-3 px-10 rounded-xl border border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
              :on-click="showChangePassword"
            >
              Change Password
            </utils-button>
          </div>
        </div>
      </div>
    </div>

    <dashboard-my-account-edit-profile
      :user="user"
      v-show="isEditProfile"
      @profile-updated="handleProfileUpdated"
    />
    <dashboard-my-account-change-password
      :user="user"
      v-show="isChangePassword"
    />
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isEditProfile: false,
      isChangePassword: false,
    }
  },
  computed: {
    fullName() {
      return (
        [this.user.firstname, this.user.lastname].filter(Boolean).join(' ') ||
        'NWLR Member'
      )
    },
    profileInitials() {
      return `${this.user.firstname?.charAt(0) || ''}${
        this.user.lastname?.charAt(0) || ''
      }`
    },
  },
  methods: {
    showEditProfile() {
      this.isEditProfile = true
      this.isChangePassword = false
    },

    showChangePassword() {
      this.isEditProfile = false
      this.isChangePassword = true
    },

    handleProfileUpdated(user) {
      this.isEditProfile = false
      this.$emit('profile-updated', user)
    },
  },
}
</script>
