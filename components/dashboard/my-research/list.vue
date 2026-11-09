<template>
  <div class="my-6">
    <!-- breadcrumb -->
    <div class="flex gap-5 items-center">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">My Research</span>
    </div>

    <!-- content -->
    <div class="bg-white rounded-lg">
      <div class="flex justify-between items-center my-5 p-5 md:py-10">
        <div></div>

        <div
          class="rounded-md border-[1px] border-[#babcd4] flex flex-col md:flex-row w-full w-fit gap-3 p-1.5"
        >
          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border border-transparent font-medium hover:bg-[#3939A2] hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
            :class="
              activeTab === 'cases'
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="setTab('cases')"
          >
            Saved Cases
          </button>

          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border border-transparent font-medium hover:bg-[#3939A2] hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
            :class="
              activeTab === 'saved'
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="setTab('saved')"
          >
            Saved Search
          </button>

          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border border-transparent font-medium hover:bg-[#3939A2] hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
            :class="
              activeTab === 'history'
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="setTab('history')"
          >
            Search History
          </button>
        </div>

        <div></div>
      </div>

      <!-- tabs -->
      <dashboard-my-research-saved-cases
        :all-saved-cases="savedCases"
        v-if="activeTab === 'cases'"
      />

      <dashboard-my-research-saved-search
        :all-saved-search="savedSearch"
        v-else-if="activeTab === 'saved'"
      />

      <dashboard-my-research-search-history v-else />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    savedCases: {
      type: Array,
      default: () => [],
    },
    savedSearch: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTab: 'cases',
    }
  },
  watch: {
    '$route.query.tab': {
      immediate: true,
      handler() {
        this.syncTabFromRoute()
      },
    },
  },
  methods: {
    syncTabFromRoute() {
      const tab = (this.$route.query.tab || '').toString().toLowerCase()
      if (['cases', 'saved', 'history'].includes(tab)) {
        this.activeTab = tab
      } else {
        this.activeTab = 'cases'
      }
    },
    setTab(tab) {
      this.activeTab = tab
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, tab },
      })
    },
  },
}
</script>
