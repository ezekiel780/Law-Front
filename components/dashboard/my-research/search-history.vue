<template>
  <div>
    <div class="flex justify-between items-center px-5 pt-2">
      <div class="font-medium">Search History</div>

      <utils-button
        class="text-sm text-red-600"
        :on-click="clearAll"
        v-if="history.length > 0"
      >
        Clear All
      </utils-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
      <div v-if="history.length === 0" class="col-span-full">
        <p class="text-[#B0B0B0] text-sm">No Search History</p>
      </div>

      <div v-for="(h, index) in history" :key="`history_${h.id}_${index}`">
        <div
          class="flex gap-3 items-center justify-between border-[1px] border-[#08085E] rounded-md p-5"
        >
          <div class="w-4/5">
            <nuxt-link
              class="flex gap-3 items-center w-full"
              :to="{
                name: 'dashboard-legal-research',
                query: historyToQuery(h),
              }"
            >
              <utils-svg-loader class="w-1/4" icon="search" color="#babcd4" />
              <div class="w-3/4">
                <p class="">{{ h.search_term }}</p>
                <p class="text-xs font-light text-[#B0B0B0]">
                  {{ $moment(h.created_at).format('DD MMM, YYYY') }}
                </p>
              </div>
            </nuxt-link>
          </div>

          <div class="w-1/5">
            <utils-button
              class="w-full justify-end"
              :on-click="() => removeOne(h.id)"
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
import {
  getSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  buildLegalResearchQuery,
} from '~/services/utilities/searchHistory'

export default {
  name: 'SearchHistory',
  data() {
    return {
      history: [],
    }
  },
  methods: {
    historyToQuery(record) {
      return buildLegalResearchQuery(record)
    },
    load() {
      if (!process.client) return
      this.history = getSearchHistory()
    },
    removeOne(id) {
      this.history = removeSearchHistory(id)
    },
    clearAll() {
      this.history = clearSearchHistory()
    },
  },
  mounted() {
    this.load()
  },
  activated() {
    this.load()
  },
}
</script>
