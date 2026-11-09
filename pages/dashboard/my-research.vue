<template>
  <div class="">
    <div
      class="fixed left-0 top-0 z-[1000] overscroll-contain"
      v-if="!isPageLoaded"
    >
      <utils-page-loader />
    </div>
    <dashboard-my-research-list
      :saved-cases="savedCases"
      :saved-search="savedSearch"
    />
  </div>
</template>

<script>
export default {
  name: 'LegalResearchListPage',
  layout: 'dashboard',
  data() {
    return {
      savedCases: [],
      savedSearch: [],
      isPageLoaded: false,
    }
  },
  methods: {
    async getResearch() {
      try {
        const getSavedCases = await this.$api.account.savedCases()
        const getSavedSearch = await this.$api.account.savedResults()
        this.savedCases = getSavedCases.data.success
          ? getSavedCases.data.success.data
          : []
        this.savedSearch = getSavedSearch.data.success
          ? getSavedSearch.data.success.data
          : []
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development')
          console.trace(error.message, errorResponse)
      } finally {
        this.isPageLoaded = true
      }
    },
  },
  mounted() {
    this.getResearch()
  },
}
</script>
