<template>
  <section class="bg-[#F5F7FC] min-h-screen">
    <div class="max-w-6xl mx-auto px-6 py-14">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-[#8A94B7]">
            Full results
          </p>
          <h1 class="text-3xl font-semibold text-[#08085E]">
            {{ typeLabel }} results for "{{ searchQuery }}"
          </h1>
        </div>
        <nuxt-link
          to="/dashboard/legal-dictionary"
          class="inline-flex items-center gap-2 text-[#08085E] font-medium hover:text-[#2020B3]"
        >
          <span>New search</span>
          <i class="ri-arrow-right-line"></i>
        </nuxt-link>
      </div>

      <div class="mt-8 grid gap-5">
        <div
          v-if="loading"
          class="bg-white rounded-2xl p-8 shadow text-[#6871A6]"
        >
          Loading results...
        </div>
        <div
          v-else-if="results.length === 0"
          class="bg-white rounded-2xl p-8 shadow text-[#6871A6]"
        >
          No results found. Try a different term or search type.
        </div>
        <div
          v-for="item in results"
          :key="item.id"
          class="bg-white rounded-2xl p-6 shadow border border-[#EEF1F7]"
        >
          <div
            class="flex flex-col md:flex-row md:items-start md:justify-between gap-4"
          >
            <div>
              <p class="text-lg font-semibold text-[#08085E]">
                {{ item.term }}
              </p>
              <p class="text-sm text-[#6871A6] mt-2">
                {{ snippetFor(item) }}
              </p>
              <ul
                v-if="citationsFor(item).length"
                class="mt-3 space-y-2 text-xs text-[#6871A6]"
              >
                <li
                  v-for="(citation, citationIndex) in citationsFor(item)"
                  :key="`${item.id}-citation-${citationIndex}`"
                  class="flex items-start gap-2"
                >
                  <i
                    class="ri-bookmark-line mt-0.5 text-[#8A94B7]"
                    aria-hidden="true"
                  ></i>
                  <DashboardLegalDictionaryCitationLink
                    :citation="citation"
                    :can-use-cross-citation="canUseCrossCitation"
                    :has-case-access="hasNwlrCaseAccess"
                  />
                </li>
              </ul>
              <p class="text-xs text-[#8A94B7] mt-3">
                {{ metaFor(item) }}
              </p>
            </div>
            <nuxt-link
              :to="detailLink(item.id)"
              class="inline-flex items-center gap-2 text-sm font-medium text-[#08085E] hover:text-[#2020B3]"
            >
              View details
              <i class="ri-arrow-right-up-line"></i>
            </nuxt-link>
          </div>
        </div>
      </div>

      <div
        class="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <p class="text-sm text-[#6871A6]">
          Showing page {{ page }} of {{ pageCount }} ({{ total }} total results)
        </p>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-[#D7DCEC] text-sm text-[#6871A6] hover:text-[#08085E] hover:border-[#08085E] disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="page <= 1"
            @click="goToPage(page - 1)"
          >
            Previous
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-[#D7DCEC] text-sm text-[#6871A6] hover:text-[#08085E] hover:border-[#08085E] disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="page >= pageCount"
            @click="goToPage(page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { NCLD_CAPABILITIES } from '~/services/auth/ncld-access'
import { normalizeCitation } from '~/services/legal-dictionary/citations'

const normalizeDefinition = (definition) => ({
  ...definition,
  citation: normalizeCitation(definition.citation || definition),
})

const normalizeResult = (item) => ({
  ...item,
  definitions: (item.definitions || []).map(normalizeDefinition),
  citations: (item.citations || []).map(
    (citation) => normalizeCitation(citation) || citation
  ),
})
export default {
  name: 'ReferenceResultsPage',
  layout: 'dashboard',
  data() {
    return {
      results: [],
      total: 0,
      loading: false,
      pageSize: 20,
      activeRequestId: 0,
    }
  },
  computed: {
    searchQuery() {
      return this.$route.query.q || ''
    },
    activeType() {
      return this.$route.query.type || 'dictionary'
    },
    page() {
      const page = Number(this.$route.query.page || 1)
      return Number.isFinite(page) && page > 0 ? page : 1
    },
    canUseCrossCitation() {
      return this.$user.can(NCLD_CAPABILITIES.CROSS_CITATION)
    },
    hasNwlrCaseAccess() {
      return this.$user.can('CASE_ACCESS')
    },
    typeLabel() {
      if (this.activeType === 'glossary') return 'Glossary'
      if (this.activeType === 'legal-maxims') return 'Legal Maxims'
      return 'Dictionary'
    },
    pageCount() {
      return Math.max(Math.ceil(this.total / this.pageSize), 1)
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.fetchResults()
      },
      immediate: true,
    },
  },
  methods: {
    searchApi(params) {
      if (this.activeType === 'glossary') {
        return this.$api.dictionary.searchGlossary(params)
      }
      if (this.activeType === 'legal-maxims') {
        return this.$api.dictionary.searchLegalMaxims(params)
      }
      return this.$api.dictionary.searchDictionary(params)
    },
    async fetchResults() {
      const requestId = ++this.activeRequestId
      if (!this.searchQuery) {
        this.results = []
        this.total = 0
        return
      }
      this.loading = true
      try {
        const { data } = await this.searchApi({
          query: this.searchQuery,
          size: this.pageSize,
          page: this.page,
        })

        if (requestId !== this.activeRequestId) return

        this.results = (data.data || []).map(normalizeResult)
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
    snippetFor(item) {
      if (this.activeType === 'legal-maxims') {
        return item.definition || 'Latin maxim translation'
      }
      if (this.activeType === 'glossary') {
        const firstCitation =
          item.citations && item.citations.length > 0
            ? item.citations[0].text
            : ''
        return firstCitation || 'Related citations available'
      }
      const firstDefinition =
        item.definitions && item.definitions.length > 0
          ? item.definitions[0].definition || item.definitions[0].text
          : ''
      return firstDefinition || 'Dictionary definition'
    },
    citationsFor(item) {
      if (this.activeType === 'glossary') {
        return (item.citations || []).filter(
          (citation) =>
            citation &&
            (citation.text || citation.hyperlink || citation.caseId)
        )
      }

      if (this.activeType === 'dictionary') {
        return (item.definitions || [])
          .map((definition) => definition.citation)
          .filter(
            (citation) =>
              citation && (citation.text || citation.hyperlink || citation.caseId)
          )
      }

      return []
    },
    metaFor(item) {
      if (this.activeType === 'glossary') {
        const count = item.citations ? item.citations.length : 0
        return `${count} citation${count === 1 ? '' : 's'}`
      }
      if (this.activeType === 'legal-maxims') {
        return 'Latin maxim'
      }
      const count = item.definitions ? item.definitions.length : 0
      return `${count} definition${count === 1 ? '' : 's'}`
    },
    detailLink(id) {
      return {
        path: `/dashboard/legal-dictionary/${this.activeType}/${id}`,
        query: { q: this.searchQuery, type: this.activeType, page: this.page },
      }
    },
    goToPage(page) {
      this.$router.push({
        path: '/dashboard/legal-dictionary/results',
        query: { q: this.searchQuery, type: this.activeType, page },
      })
    },
  },
}
</script>
