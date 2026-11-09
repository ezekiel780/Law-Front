<template>
  <section
    class="bg-gradient-to-br from-[#08085E] via-[#0C0C7A] to-[#2020B3] text-white"
  >
    <div class="max-w-6xl mx-auto px-6 py-16">
      <div class="flex flex-col gap-6">
        <p class="uppercase tracking-[0.2em] text-sm text-[#DDC524]">
          Nigerian Case Law Dictionary
        </p>
        <h1 class="text-3xl md:text-5xl font-semibold">
          Dictionary, Glossary & Legal Maxims
        </h1>
        <p class="text-base md:text-lg text-white/80 max-w-2xl">
          Search trusted legal terms with instant previews, then dive deeper
          into full definitions, citations, and maxims with one click.
        </p>
        <div
          class="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in typeOptions"
                :key="option.value"
                type="button"
                class="px-4 py-2 rounded-full text-sm font-medium border transition"
                :class="optionClasses(option)"
                :aria-disabled="!option.available"
                @click="setActiveType(option)"
              >
                {{ option.label }}
                <span v-if="!option.available" class="ml-1 text-[10px] uppercase">Locked</span>
              </button>
            </div>
            <div class="relative">
              <label class="sr-only" for="reference-search">Search</label>
              <input
                id="reference-search"
                v-model="searchQuery"
                type="text"
                placeholder="Search for a term, phrase, or maxim"
                class="w-full rounded-xl border border-transparent bg-white text-[#0E0E4D] px-5 py-4 text-base focus:ring-2 focus:ring-[#DDC524] focus:outline-none"
                @focus="panelOpen = true"
                @keydown.enter.prevent="goToResults"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-[#DDC524] text-[#08085E] px-4 py-2 rounded-lg text-sm font-semibold shadow"
                @click="goToResults"
              >
                Search
              </button>

              <div
                v-if="panelOpen && searchQuery"
                class="absolute left-0 right-0 mt-3 bg-white text-[#0E0E4D] rounded-2xl shadow-2xl border border-[#E4E8F0] z-20"
              >
                <div
                  class="px-5 py-4 border-b border-[#EEF1F7] flex items-center justify-between"
                >
                  <div>
                    <p
                      class="text-xs uppercase tracking-[0.3em] text-[#8A94B7]"
                    >
                      Quick Results
                    </p>
                    <p class="text-lg font-semibold">
                      {{ typeLabel }}
                    </p>
                  </div>
                  <div class="text-sm text-[#6871A6]">
                    {{ total }} result<span v-if="total !== 1">s</span>
                  </div>
                </div>

                <div v-if="loading" class="px-5 py-6 text-sm text-[#6871A6]">
                  Searching...
                </div>
                <div
                  v-else-if="results.length === 0"
                  class="px-5 py-6 text-sm text-[#6871A6]"
                >
                  No results found yet. Try another spelling or term.
                </div>
                <ul v-else class="max-h-[360px] overflow-y-auto">
                  <li
                    v-for="item in results"
                    :key="item.id"
                    class="px-5 py-4 border-b border-[#EEF1F7] last:border-b-0"
                  >
                    <nuxt-link
                      class="block hover:text-[#08085E] transition"
                      :to="detailLink(item.id)"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div>
                          <p class="font-semibold">{{ item.term }}</p>
                          <p class="text-sm text-[#6871A6] mt-1">
                            {{ snippetFor(item) }}
                          </p>
                        </div>
                        <span class="text-xs text-[#6871A6] whitespace-nowrap">
                          View
                        </span>
                      </div>
                    </nuxt-link>
                  </li>
                </ul>
                <div
                  class="px-5 py-4 flex items-center justify-between bg-[#F7F9FC] rounded-b-2xl"
                >
                  <button
                    type="button"
                    class="text-sm font-medium text-[#08085E] hover:text-[#2020B3]"
                    @click="goToResults"
                    v-if="remainingCount > 0"
                  >
                    See more ({{ remainingCount }} left)
                  </button>
                  <button
                    type="button"
                    class="text-sm text-[#6871A6]"
                    @click="panelOpen = false"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
            <p class="text-sm text-white/70">
              Tip: press <span class="font-semibold text-white">Enter</span> to
              jump to full results.
            </p>
          </div>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white/10 rounded-2xl p-5 border border-white/10">
            <p class="text-sm uppercase tracking-[0.2em] text-[#DDC524]">
              Dictionary
            </p>
            <p class="text-sm text-white/80 mt-2">
              Explore clear legal definitions supported by citations from
              superior courts.
            </p>
          </div>
          <div class="bg-white/10 rounded-2xl p-5 border border-white/10">
            <p class="text-sm uppercase tracking-[0.2em] text-[#DDC524]">
              Glossary
            </p>
            <p class="text-sm text-white/80 mt-2">
              Find related case references and authoritative sources tied to
              each term.
            </p>
          </div>
          <div class="bg-white/10 rounded-2xl p-5 border border-white/10">
            <p class="text-sm uppercase tracking-[0.2em] text-[#DDC524]">
              Legal Maxims
            </p>
            <p class="text-sm text-white/80 mt-2">
              Decode Latin maxims with straightforward translations for quick
              clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { NCLD_CAPABILITIES } from '~/services/auth/ncld-access'

export default {
  name: 'ReferenceSearchPage',
  layout: 'dashboard',
  data() {
    return {
      searchQuery: '',
      activeType: 'dictionary',
      results: [],
      total: 0,
      loading: false,
      panelOpen: false,
      fetchTimer: null,
      activeRequestId: 0,
    }
  },
  computed: {
    typeOptions() {
      return [
        {
          label: 'Dictionary',
          value: 'dictionary',
          capability: NCLD_CAPABILITIES.DICTIONARY_SEARCH,
        },
        {
          label: 'Glossary',
          value: 'glossary',
          capability: NCLD_CAPABILITIES.GLOSSARY_SEARCH,
        },
        {
          label: 'Legal Maxims',
          value: 'legal-maxims',
          capability: NCLD_CAPABILITIES.LEGAL_MAXIM,
        },
      ].map((option) => ({
        ...option,
        available: this.$user.can(option.capability),
      }))
    },
    activeTypeOption() {
      return this.typeOptions.find(
        (option) => option.value === this.activeType
      )
    },
    hasActiveTypeAccess() {
      return Boolean(this.activeTypeOption?.available)
    },
    typeLabel() {
      const match = this.typeOptions.find(
        (option) => option.value === this.activeType
      )
      return match ? match.label : 'Dictionary'
    },
    remainingCount() {
      return Math.max(this.total - this.results.length, 0)
    },
  },
  watch: {
    searchQuery() {
      this.queueSearch()
    },
    activeType() {
      if (this.searchQuery) {
        this.queueSearch()
      }
    },
  },
  methods: {
    optionClasses(option) {
      if (!option.available) {
        return 'bg-white/5 text-white/50 border-white/10 cursor-not-allowed'
      }

      return option.value === this.activeType
        ? 'bg-[#DDC524] text-[#08085E] border-transparent shadow'
        : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
    },
    setActiveType(option) {
      if (!option.available) {
        this.$router.push({
          path: '/dashboard/my-subscription',
          query: { required: option.capability },
        })
        return
      }

      this.activeType = option.value
    },
    ensureActiveTypeAccess() {
      if (this.hasActiveTypeAccess) return true

      this.$router.push({
        path: '/dashboard/my-subscription',
        query: {
          required:
            this.activeTypeOption?.capability ||
            NCLD_CAPABILITIES.DICTIONARY_SEARCH,
        },
      })
      return false
    },
    queueSearch() {
      if (this.fetchTimer) {
        clearTimeout(this.fetchTimer)
      }
      if (!this.searchQuery) {
        this.results = []
        this.total = 0
        this.loading = false
        return
      }
      this.fetchTimer = setTimeout(() => {
        this.fetchResults()
      }, 350)
    },
    async fetchResults() {
      if (!this.ensureActiveTypeAccess()) return

      const requestId = ++this.activeRequestId
      this.loading = true
      try {
        const { data } = await this.searchApi({
          query: this.searchQuery,
          size: 10,
          page: 1,
        })
        if (requestId !== this.activeRequestId) return
        this.results = data.data || []
        this.total = data.total || this.results.length
      } catch (err) {
        if (requestId !== this.activeRequestId) return
        this.results = []
        this.total = 0
      } finally {
        if (requestId !== this.activeRequestId) return
        this.loading = false
      }
    },
    searchApi(params) {
      if (this.activeType === 'glossary') {
        return this.$api.dictionary.searchGlossary(params)
      }
      if (this.activeType === 'legal-maxims') {
        return this.$api.dictionary.searchLegalMaxims(params)
      }
      return this.$api.dictionary.searchDictionary(params)
    },
    snippetFor(item) {
      if (this.activeType === 'legal-maxims') {
        return item.definition || 'Latin maxim translation'
      }
      if (this.activeType === 'glossary') {
        const count = item.citations ? item.citations.length : 0
        return count
          ? `${count} citation${count === 1 ? '' : 's'} available`
          : 'Glossary citations'
      }
      const firstDefinition =
        item.definitions && item.definitions.length > 0
          ? item.definitions[0].definition || item.definitions[0].text
          : ''
      return firstDefinition || 'Dictionary definition'
    },
    detailLink(id) {
      return `/dashboard/legal-dictionary/${this.activeType}/${id}`
    },
    goToResults() {
      if (!this.ensureActiveTypeAccess()) return

      if (!this.searchQuery) {
        return
      }
      this.$router.push({
        path: '/dashboard/legal-dictionary/results',
        query: {
          q: this.searchQuery,
          type: this.activeType,
          page: 1,
        },
      })
      this.panelOpen = false
    },
  },
  mounted() {
    if (!this.hasActiveTypeAccess) {
      const firstAvailable = this.typeOptions.find((option) => option.available)
      if (firstAvailable) this.activeType = firstAvailable.value
    }
  },
  beforeDestroy() {
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer)
    }
  },
}
</script>
