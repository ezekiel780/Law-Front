<template>
  <span class="inline-flex items-start gap-1.5">
    <a
      v-if="destination"
      :href="destination.href"
      :target="opensInNewTab ? '_blank' : null"
      :rel="opensInNewTab ? 'noopener noreferrer' : null"
      class="font-medium text-[#08085E] underline decoration-[#B8BDE1] underline-offset-2 hover:text-[#2020B3] hover:decoration-[#2020B3]"
    >
      {{ displayText }}
      <i class="ri-external-link-line text-[0.75rem]" aria-hidden="true"></i>
    </a>
    <span v-else>{{ displayText }}</span>
  </span>
</template>

<script>
import {
  citationDestination,
  normalizeCitation,
} from '~/services/legal-dictionary/citations'

export default {
  name: 'DashboardLegalDictionaryCitationLink',
  props: {
    citation: {
      type: [Object, String],
      required: true,
    },
    canUseCrossCitation: {
      type: Boolean,
      default: false,
    },
    hasCaseAccess: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    normalizedCitation() {
      return normalizeCitation(this.citation) || {
        text: '',
        hyperlink: '',
        caseId: '',
      }
    },
    resolvedCaseDestination() {
      return citationDestination(this.normalizedCitation)
    },
    opensCaseDocument() {
      return Boolean(this.resolvedCaseDestination?.caseId)
    },
    destination() {
      if (!this.canUseCrossCitation || !this.resolvedCaseDestination) {
        return null
      }

      if (!this.hasCaseAccess) {
        return {
          href: '/dashboard/my-subscription?required=CASE_ACCESS',
          external: false,
        }
      }

      return this.resolvedCaseDestination
    },
    opensInNewTab() {
      return Boolean(
        this.hasCaseAccess &&
          this.destination &&
          (this.destination.external || this.opensCaseDocument)
      )
    },
    displayText() {
      return (
        this.normalizedCitation.text ||
        this.normalizedCitation.caseId ||
        this.normalizedCitation.hyperlink ||
        'View cited case'
      )
    },
  },
}
</script>
