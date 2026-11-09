<template>
  <div class="my-6">
    <dashboard-legal-research-search />
    <div class="grid md:grid-cols-4 gap-4 md:gap-8">
      <!-- Sections & Pages -->
      <div class="bg-white rounded-xl">
        <p class="text-[#08085E] my-5">Navigation</p>
        <div class="flex justify-center gap-4 my-5">
          <div class="">
            <utils-button
              class="py-3 px-5 rounded-xl border border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
              :on-click="() => {}"
            >
              Sections
            </utils-button>
          </div>
          <div class="">
            <utils-button
              class="py-3 px-5 rounded-xl border border-transparent bg-[#08085E1A] text-[#08085E] hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
              :on-click="() => {}"
            >
              Pages
            </utils-button>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 mb-10">
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2023
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2022
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2021
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2020
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            2019
          </button>
        </div>
      </div>
      <!-- Case -->
      <div class="col-span-3">
        <div class="flex items-center gap-4 my-15">
          <p class="font-medium">{{ caseTitle }}</p>
          <utils-button
            v-if="!isInstitutionalSession"
            class="py-2 w-20 rounded-xl border border-transparent bg-[#08085E1A] text-[#08085E] hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
            :on-click="saveCase"
            :button-state="isSaving"
          >
            <div class="flex justify-center items-center gap-2">
              <span>Save</span>
              <utils-svg-loader
                icon="save-icon"
                class="cursor-pointer"
                color="#08085E1A"
              />
            </div>
          </utils-button>
        </div>
        <div>
          <div>
            <dashboard-legal-research-old-case :case-file="caseFile" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caseFile: {
      type: String,
      default: 'Hello World!',
    },
    caseTitle: {
      type: String,
      default: 'Hello World!',
    },
    caseStyle: {
      type: String,
      default: 'Hello World!',
    },
    imageAvailable: {
      type: Boolean,
      default: false,
    },
  },
  name: 'Search',
  data() {
    return {
      isSaving: false,
    }
  },
  computed: {
    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },
  },
  methods: {
    async saveCase() {
      if (this.isInstitutionalSession) return
      this.isSaving = true
      try {
        await this.$api.subscription.saveCase({
          case_id: this.query,
          case_name: this.query,
        })
        this.$notify({
          type: 'success',
          title: 'Success',
          text: `Case ${this.query} has been saved successfully`,
          duration: 5000,
        })
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
        this.isSaving = false
      }
    },

    showCaseImage(imageProps) {},
  },
}
</script>
