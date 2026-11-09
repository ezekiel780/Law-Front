<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
      <div
        v-for="(savedCase, index) in allSavedCases"
        :key="`saved_cases_${index}`"
      >
        <div
          class="flex gap-3 items-center justify-between border-[1px] border-[#08085E] rounded-md p-5"
          v-if="!savedCase.case.includes('http')"
        >
          <div class="w-4/5">
            <a
              class="flex gap-3 items-center w-full"
              :href="`/dashboard/legal-research/${encodeURIComponent(
                savedCase.case
              )}`"
              target="_blank"
              v-if="!savedCase.case.includes('http')"
            >
              <utils-svg-loader class="w-1/4" icon="gavelblue" />
              <div class="w-3/4">
                <p class="">{{ savedCase.title }}</p>
                <p class="text-xs font-light text-[#B0B0B0]">
                  {{ $moment(savedCase.created_at).format('DD MMM, YYYY') }}
                </p>
              </div>
            </a>
          </div>
          <div class="w-1/5">
            <utils-button
              class="w-full justify-end"
              :on-click="
                () => {
                  processDeleteResearch(index)
                }
              "
              :button-state="deleteStatus[index]"
            >
              <i
                class="cursor-pointer text-red-500 ri-delete-bin-line text-lg"
              ></i>
            </utils-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    allSavedCases: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      deleteStatus: [],
    }
  },
  methods: {
    async processDeleteResearch(index) {
      try {
        // this.deleteStatus[index] = true;
        this.deleteStatus = this.allSavedCases.map((status, i) =>
          i == index ? true : false
        )
        const id = this.allSavedCases[index].id
        const {
          data: { success },
        } = await this.$api.account.deleteResearch({
          type: 'cases',
          id,
        })
        this.$notify({
          type: 'success',
          title: 'Success',
          text: success.message,
          duration: 5000,
        })
        // refresh page
        this.$nuxt.$router.go()
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
        this.deleteStatus = this.allSavedCases.map(() => false)
      }
    },
  },
  mounted() {
    this.deleteStatus = this.allSavedCases.map(() => false)
  },
}
</script>
