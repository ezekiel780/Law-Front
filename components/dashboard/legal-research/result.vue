<template>
  <div class="my-6">
    <dashboard-legal-research-search
      ref="search"
      @update-search-results="updateSearchResults"
      @search-error="updateSearchError"
      @reset-page-number="resetPageNumber"
      :page-number="pageNumber"
    />

    <section
      v-if="searchError"
      class="my-6 overflow-hidden rounded-2xl border border-[#D8DAED] bg-white shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div class="flex items-start gap-4">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4F4FB] text-[#08085E]"
          >
            <i class="ri-search-eye-line text-2xl"></i>
          </div>
          <div>
            <p class="text-base font-semibold text-[#08085E]">
              Search could not be completed
            </p>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-[#6871A6]">
              {{ searchError.message }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="rounded-xl bg-[#08085E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2"
          @click="retrySearch"
        >
          Try search again
        </button>
      </div>
    </section>

    <!-- DID YOU MEAN -->
    <div
      v-if="didYouMean"
      class="my-5 rounded-2xl border border-[#08085E1A] bg-[#F5F6FB] p-4 md:p-5 text-[#08085E] shadow-sm"
    >
      <div class="flex items-start gap-3">
        <div
          class="mt-0.5 h-9 w-9 rounded-xl bg-white border border-[#08085E1A] flex items-center justify-center"
        >
          <i class="ri-lightbulb-flash-line text-lg"></i>
        </div>

        <div class="flex-1">
          <p class="text-sm md:text-base font-medium">
            Did you mean
            <button
              type="button"
              class="font-semibold underline underline-offset-4 decoration-[#DDC524] hover:decoration-[#08085E] transition-all"
              @click="applyDidYouMean(didYouMean)"
              :title="`Search for ${didYouMean}`"
            >
              “{{ didYouMean }}”
            </button>
            ?
          </p>
          <p class="text-xs md:text-sm text-[#08085E] opacity-70 mt-1">
            Click it to search with the corrected term.
          </p>
        </div>

        <button
          type="button"
          class="text-xs md:text-sm px-3 py-2 rounded-xl bg-white border border-[#08085E1A] hover:bg-[#08085E] hover:text-white transition-all"
          @click="applyDidYouMean(didYouMean)"
        >
          Search instead
        </button>
      </div>
    </div>

    <!-- search results -->
    <div class="grid md:grid-cols-4 gap-4 md:gap-8">
      <div class="col-span-4">
        <div class="flex justify-between items-center my-5 text-[#08085E]">
          <p class="font-medium">Search Results</p>
        </div>

        <div
          class="mb-5"
          v-for="(cases, index) in allCases"
          :key="`search_result_${index}`"
        >
          <div
            class="w-auto h-auto bg-white rounded-lg shadow-xl flex flex-col justify-between text-[#1A1A1A] p-4 gap-5"
          >
            <div class="font-medium">
              [{{ index + 1 }}] &nbsp; {{ cases.title }}
            </div>
            <div class="text-sm" v-html="cases.content"></div>

            <div
              class="flex flex-row justify-between items-center text-[#B0B0B0] border-t"
            >
              <div
                class="flex flex-col md:flex-row md:justify-between gap-2 md:gap-6 text-[#013220]"
              >
                <p class="text-sm font-medium">{{ cases.citation }}</p>
                <p class="text-sm font-medium">Court: {{ cases.court }}</p>
                <p class="text-sm font-medium">
                  {{
                    $moment(cases.dateOfJudgment).format('dddd, DD MMMM, YYYY')
                  }}
                </p>
              </div>

              <a
                :href="caseHref(cases)"
                target="_blank"
              >
                <button
                  class="font-medium flex gap-3 rounded-[1.5rem] text-[#08085E] bg-[#F5F6FB] button px-4 py-2 w-24 hover:bg-[#08085E] hover:text-[#fff]"
                >
                  View
                  <utils-svg-loader icon="arrow-down-icon" class="-rotate-90" />
                </button>
              </a>
            </div>
          </div>
        </div>

        <!-- NOT FOUND -->
        <div
          class="flex flex-col justify-center items-center gap-20 my-20"
          v-show="allCases.length === 0 && !searchError"
        >
          <i class="ri-book-open-line text-[#08085E] text-[10rem] block"></i>
          <p class="text-[#B0B0B0] text-sm">
            Enter a search query to get started
          </p>
        </div>
      </div>
    </div>

    <!-- pagination -->
    <div v-show="allCases.length > 0 || currentPage > 1">
      <utils-pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :window-size="2"
        @go-to-page="goToPage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Search',
  data() {
    return {
      searchResults: null,
      currentPage: 1,
      pageNumber: 1,
      searchError: null,
    }
  },
  computed: {
    ...mapGetters({
      searchQuery: 'app/getQuery',
    }),

    allCases() {
      return this.searchResults?.data || []
    },

    totalPages() {
      const n = Number(this.searchResults?.last_page)
      return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
    },

    didYouMean() {
      const raw = this.searchResults?.did_you_mean
      if (!raw || typeof raw !== 'string') return null

      const suggestion = raw.trim()
      if (!suggestion) return null

      // Compare against what is ACTUALLY in the input box first
      const typed = (
        this.$refs.search?.query ||
        this.$route.query.search_term ||
        this.searchQuery ||
        ''
      )
        .toString()
        .trim()

      if (typed && typed.toLowerCase() === suggestion.toLowerCase()) return null
      return suggestion
    },
  },
  methods: {
    caseHref(caseResult = {}) {
      const part = Number(caseResult.part)
      const pageStart = Number(caseResult.pageStart)
      if (!Number.isInteger(part) || part < 1 || !Number.isInteger(pageStart) || pageStart < 1) {
        return '#'
      }
      return `/dashboard/legal-research/${part}_1_${pageStart}`
    },
    updateSearchResults(data) {
      this.searchError = null
      // If someone ever emits an array, normalize it
      this.searchResults = Array.isArray(data) ? { data } : data || null

      const cp = Number(this.searchResults?.current_page)
      this.currentPage = Number.isFinite(cp) && cp >= 1 ? Math.floor(cp) : 1

      // Clamp if server returns something odd
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1
        this.pageNumber = 1
      }
    },

    updateSearchError(error) {
      this.searchError = error || null
    },

    retrySearch() {
      this.searchError = null
      if (this.$refs.search?.performSearch) {
        this.$refs.search.performSearch()
      }
    },

    goToPage(page) {
      const p = Number(page)
      if (!Number.isFinite(p) || p < 1) return
      this.pageNumber = Math.min(Math.floor(p), this.totalPages)
    },

    resetPageNumber() {
      this.pageNumber = 1
    },

    applyDidYouMean(term) {
      if (!term) return

      this.pageNumber = 1
      this.currentPage = 1

      this.$router.push({
        name: this.$route.name,
        query: { ...this.$route.query, search_term: term },
      })

      if (this.$refs.search?.applyQueryAndSearch) {
        this.$refs.search.applyQueryAndSearch(term)
      }
    },
  },
}
</script>
