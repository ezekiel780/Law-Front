<template>
  <div class="text-[#1A1A1A] mb-10">
    <div class="flex justify-between items-center my-5">
      <p class="font-medium">My Research</p>
    </div>

    <div class="rounded-lg bg-white w-full h-full p-5">
      <!-- Search History (LocalStorage) -->
      <div class="flex justify-between items-center mb-1">
        <div class="font-medium">Search History</div>
        <p class="cursor-pointer">
          <nuxt-link
            :to="{ path: '/dashboard/my-research', query: { tab: 'history' } }"
            class="text-[#08085E]"
            >View All</nuxt-link
          >
        </p>
      </div>

      <div class="flex flex-col gap-3 mb-5">
        <div
          class="flex flex-col justify-center items-center"
          v-if="latestHistory.length === 0"
        >
          <p class="text-[#B0B0B0] text-sm">No Search History</p>
        </div>

        <div v-for="(h, i) in latestHistory" :key="`history_${h.id}_${i}`">
          <nuxt-link
            class="flex gap-3 items-center"
            :to="{ name: 'dashboard-legal-research', query: historyToQuery(h) }"
          >
            <utils-svg-loader icon="search" color="#babcd4" />
            <div>
              <p class="">{{ h.search_term }}</p>
              <p class="text-xs font-light text-[#B0B0B0]">
                {{ $moment(h.created_at).format('DD MMM, YYYY') }}
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>

      <!-- Saved Cases -->
      <div class="flex justify-between items-center mb-1">
        <div class="font-medium">Saved Cases</div>
        <p class="cursor-pointer">
          <nuxt-link
            :to="{ path: '/dashboard/my-research', query: { tab: 'cases' } }"
            class="text-[#08085E]"
            >View All</nuxt-link
          >
        </p>
      </div>

      <div class="flex flex-col gap-3 mb-5">
        <div
          class="flex flex-col justify-center items-center"
          v-if="allSavedCases.length === 0"
        >
          <p class="text-[#B0B0B0] text-sm">No Research Found</p>
        </div>

        <div
          v-for="(savedCase, index) in allSavedCases"
          :key="`saved_cases_${index}`"
        >
          <a
            class="flex gap-3 items-center"
            :href="`/dashboard/legal-research/${encodeURIComponent(
              savedCase.case
            )}`"
            target="_blank"
          >
            <utils-svg-loader icon="gavelblue" />
            <div>
              <p class="">{{ savedCase.title }}</p>
              <p class="text-xs font-light text-[#B0B0B0]">
                {{ $moment(savedCase.created_at).format('dddd, DD MMM, YYYY') }}
              </p>
            </div>
          </a>
        </div>
      </div>

      <!-- Saved Search (backend) -->
      <div class="flex justify-between items-center mb-1">
        <div class="font-medium">Saved Search</div>
        <p class="cursor-pointer">
          <nuxt-link
            :to="{ path: '/dashboard/my-research', query: { tab: 'saved' } }"
            class="text-[#08085E]"
            >View All</nuxt-link
          >
        </p>
      </div>

      <div class="flex flex-col gap-3 mb-5">
        <div
          class="flex flex-col justify-center items-center"
          v-if="allSavedSearch.length === 0"
        >
          <p class="text-[#B0B0B0] text-sm">No Research Found</p>
        </div>

        <div
          v-for="(savedSearch, i) in allSavedSearch"
          :key="`saved_search_${i}`"
        >
          <nuxt-link
            class="flex gap-3 items-center"
            :to="{
              name: 'dashboard-legal-research',
              query: {
                case_type: savedSearch.case_type,
                match: savedSearch.match,
                search_term: savedSearch.search_term,
                sort: savedSearch.sort,
                start_date: savedSearch.start_date,
                end_date: savedSearch.end_date,
                court: savedSearch.court,
                division: savedSearch.division,
                justice: savedSearch.justice,
                counsel: savedSearch.counsel,
                parties: savedSearch.parties,
              },
            }"
          >
            <utils-svg-loader icon="search" color="#babcd4" />
            <div>
              <p class="">{{ savedSearch.search_term }}</p>
              <p class="text-xs font-light text-[#B0B0B0]">
                {{ $moment(savedSearch.created_at).format('DD MMM, YYYY') }}
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSearchHistory,
  buildLegalResearchQuery,
} from '~/services/utilities/searchHistory'

export default {
  props: {
    allSavedCases: {
      type: Array,
      default: () => [],
    },
    allSavedSearch: {
      type: Array,
      default: () => [],
    },
  },
  name: 'MyResearch',
  data() {
    return {
      history: [],
    }
  },
  computed: {
    latestHistory() {
      return this.history.slice(0, 5)
    },
  },
  methods: {
    historyToQuery(record) {
      return buildLegalResearchQuery(record)
    },
    loadHistory() {
      if (!process.client) return
      this.history = getSearchHistory()
    },
  },
  mounted() {
    this.loadHistory()
  },
  activated() {
    // if page is keep-alive, refresh when returning
    this.loadHistory()
  },
}
</script>
