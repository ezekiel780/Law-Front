<template>
  <section class="bg-[#F7F9FC] min-h-screen">
    <div class="max-w-5xl mx-auto px-6 py-14">
      <nuxt-link
        :to="backLink"
        class="inline-flex items-center gap-2 text-[#6871A6] hover:text-[#08085E]"
      >
        <i class="ri-arrow-left-line"></i>
        Back to results
      </nuxt-link>

      <div
        class="mt-6 bg-white rounded-3xl shadow-lg border border-[#EEF1F7] p-8"
      >
        <p class="text-xs uppercase tracking-[0.3em] text-[#8A94B7]">
          {{ typeLabel }}
        </p>
        <h1 class="text-3xl font-semibold text-[#08085E] mt-2">
          {{ entry.term }}
        </h1>

        <div v-if="type === 'legal-maxims'" class="mt-6">
          <p class="text-lg text-[#6871A6] leading-relaxed">
            {{ entry.definition }}
          </p>
        </div>

        <div v-else-if="type === 'glossary'" class="mt-6">
          <p class="text-sm text-[#6871A6] mb-4">
            {{ entry.citations.length }} citation<span
              v-if="entry.citations.length !== 1"
              >s</span
            >
          </p>
          <ul class="space-y-4">
            <li
              v-for="(citation, index) in entry.citations"
              :key="index"
              class="bg-[#F7F9FC] rounded-2xl p-4 border border-[#EEF1F7]"
            >
              <p class="text-sm text-[#08085E]">
                <DashboardLegalDictionaryCitationLink
                  :citation="citation"
                  :can-use-cross-citation="canUseCrossCitation"
                  :has-case-access="hasNwlrCaseAccess"
                />
              </p>
            </li>
          </ul>
        </div>

        <div v-else class="mt-6">
          <p class="text-sm text-[#6871A6] mb-4">
            {{ entry.definitions.length }} definition<span
              v-if="entry.definitions.length !== 1"
              >s</span
            >
          </p>
          <div class="space-y-4">
            <div
              v-for="(definition, index) in entry.definitions"
              :key="index"
              class="bg-[#F7F9FC] rounded-2xl p-4 border border-[#EEF1F7]"
            >
              <p class="text-sm text-[#08085E] leading-relaxed">
                {{ definition.definition || definition.text }}
              </p>
              <p
                v-if="
                  definition.citation &&
                  (definition.citation.hyperlink ||
                    definition.citation.text ||
                    definition.citation.caseId)
                "
                class="text-xs text-[#6871A6] mt-3 flex justify-end"
              >
                <DashboardLegalDictionaryCitationLink
                  :citation="definition.citation"
                  :can-use-cross-citation="canUseCrossCitation"
                  :has-case-access="hasNwlrCaseAccess"
                />
              </p>
            </div>
          </div>
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

const normalizeEntry = (entry) => ({
  term: entry.term || '',
  definition: entry.definition || '',
  definitions: (entry.definitions || []).map(normalizeDefinition),
  citations: (entry.citations || []).map(
    (citation) => normalizeCitation(citation) || citation
  ),
})
export default {
  name: 'ReferenceDetailPage',
  layout: 'dashboard',
  async asyncData({ app, params, query, error }) {
    const type = params.type
    const id = params.id

    if (!['dictionary', 'glossary', 'legal-maxims'].includes(type)) {
      error({ statusCode: 404, message: 'Entry not found' })
    }

    try {
      const { data } = await app.$api.dictionary.fetchEntry({ type, id })
      return {
        type,
        entry: normalizeEntry(data.data || {}),
        backQuery: {
          q: query.q || '',
          type: query.type || type,
          page: query.page || 1,
        },
      }
    } catch (err) {
      error({ statusCode: 404, message: 'Entry not found' })
    }
  },
  computed: {
    canUseCrossCitation() {
      return this.$user.can(NCLD_CAPABILITIES.CROSS_CITATION)
    },
    hasNwlrCaseAccess() {
      return this.$user.can('CASE_ACCESS')
    },
    typeLabel() {
      if (this.type === 'glossary') return 'Glossary Term'
      if (this.type === 'legal-maxims') return 'Legal Maxim'
      return 'Dictionary Term'
    },
    backLink() {
      if (!this.backQuery.q) return '/dashboard/legal-dictionary'
      return {
        path: '/dashboard/legal-dictionary/results',
        query: this.backQuery,
      }
    },
  },
}
</script>
