<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
      <div
        v-for="(savedSearch, index) in allSavedSearch"
        :key="`saved_cases_${index}`"
      >
        <div
          class="flex gap-3 items-center justify-between border-[1px] border-[#08085E] rounded-md p-5"
        >
          <div class="w-4/5">
            <nuxt-link
              class="flex gap-3 items-center w-full"
              :to="{
                name: 'dashboard-legal-research',
                query: {
                  case_type: savedSearch.case_type,
                  match: savedSearch.match,
                  search_term: savedSearch.search_term,
                  sort: savedSearch.sort,
                },
              }"
            >
              <utils-svg-loader class="w-1/4" icon="search" color="#babcd4" />
              <div class="w-3/4">
                <p class="">{{ savedSearch.search_term }}</p>
                <p class="text-xs font-light text-[#B0B0B0]">
                  {{ $moment(savedSearch.created_at).format('DD MMM, YYYY') }}
                </p>
              </div>
            </nuxt-link>
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
    allSavedSearch: {
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
        this.deleteStatus = this.allSavedSearch.map((status, i) =>
          i == index ? true : false
        )
        const id = this.allSavedSearch[index].id
        const {
          data: { success },
        } = await this.$api.account.deleteResearch({
          type: 'result',
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
        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
        this.$notify({
          type: 'error',
          title: 'Error',
          text: errorResponse.message,
          duration: 5000,
        })
      } finally {
        this.deleteStatus = this.allSavedSearch.map(() => false)
      }
    },
  },
  mounted() {
    this.deleteStatus = this.allSavedSearch.map(() => false)
  },
}
</script>
