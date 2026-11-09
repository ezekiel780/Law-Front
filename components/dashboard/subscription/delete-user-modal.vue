<template>
  <div>
    <utils-modal @close="toggleModal" v-show="modalState">
      <template v-slot:header>
        <span class="flex gap-4 items-center cursor-pointer">
          <utils-svg-loader
            icon="filter-icon"
            class="cursor-pointer"
            color="#08085E"
          />
          <span class="font-medium text-[#08085E]">Remove Corporate User</span>
        </span>
      </template>

      <!-- Body slot -->
      <template v-slot:body>
        <div class="flex flex-col items-center justify-center gap-8 w-full">
          <div class="w-full italic text-center">
            Removing this user ends their corporate access immediately. The user
            may rejoin later through a new invitation. Do you want to continue?
          </div>
          <div class="w-full flex justify-between items-center space-3">
            <utils-button
              class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10"
              :on-click="toggleModal"
              :button-state="false"
            >
              No
            </utils-button>

            <utils-button
              class="bg-white text-[#E02424] hover:bg-[#E02424] border-[1px] border-[#E02424] hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10"
              :on-click="removeUser"
              :button-state="isLoading"
            >
              Yes
            </utils-button>
          </div>
        </div>
      </template>
    </utils-modal>
  </div>
</template>

<script>
export default {
  props: {
    modalState: {
      type: Boolean,
      default: true,
    },
    userId: {
      default: null,
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    toggleModal(status = 'notice', msg = null) {
      this.$emit('toggle-modal', { status, msg })
    }, //end of toggle modal
    async removeUser() {
      try {
        if (!this.userId) {
          this.toggleModal('notice', 'Invalid User ID')
          return false
        }
        this.isLoading = true
        const { data } = await this.$api.subscription.removeCorporateUser(
          this.userId
        )
        this.toggleModal('success', data.success.message)
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.toggleModal('notice', errorResponse.message)
      }
    }, //end of remove user
  },
}
</script>
