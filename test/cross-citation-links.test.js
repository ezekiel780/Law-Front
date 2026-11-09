const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const utilitySource = read('services/legal-dictionary/citations.js')
  .replace(/export const /g, 'const ')
  .concat(
    '\nmodule.exports = { normalizeCitation, extractCitationHref, extractCaseId, isSafeCitationHref, citationDestination };'
  )

const sandbox = {
  module: { exports: {} },
  exports: {},
  URL,
  Buffer,
  encodeURIComponent,
}
vm.runInNewContext(utilitySource, sandbox)

const {
  normalizeCitation,
  extractCaseId,
  citationDestination,
} = sandbox.module.exports

assert.deepStrictEqual(
  JSON.parse(
    JSON.stringify(
      normalizeCitation({
        citationText: 'Oye v. Odidan (2025) 19 NWLR',
        citationLink: '/dashboard/legal-research/2020_1_263',
      })
    )
  ),
  {
    citationText: 'Oye v. Odidan (2025) 19 NWLR',
    citationLink: '/dashboard/legal-research/2020_1_263',
    text: 'Oye v. Odidan (2025) 19 NWLR',
    hyperlink: '/dashboard/legal-research/2020_1_263',
    caseId: '',
  }
)

assert.strictEqual(
  extractCaseId({
    citationText: 'Oye v. Odidan',
    citationLink: '/dashboard/legal-research/2020_1_263',
  }),
  '2020_1_263'
)

assert.strictEqual(
  extractCaseId({
    citationText: 'Oye v. Odidan',
    citationLink:
      '<a href="/dashboard/legal-research/MjAyMF8xXzI2Mw==">Open</a>',
  }),
  '',
  'Legacy Base64 case routes are intentionally unsupported.'
)

assert.strictEqual(
  extractCaseId({
    text: 'Oye v. Odidan',
    hyperlink: 'https://dev.nwlronline.com/case-document/2020_1_263',
  }),
  '2020_1_263'
)

assert.deepStrictEqual(
  JSON.parse(
    JSON.stringify(
      citationDestination({
        citationText: 'Oye v. Odidan',
        citationLink: '/dashboard/legal-research/2020_1_263',
      })
    )
  ),
  {
    href: '/dashboard/legal-research/2020_1_263',
    external: false,
    caseId: '2020_1_263',
  }
)

const resultsPage = read('pages/dashboard/legal-dictionary/results.vue')
const detailPage = read('pages/dashboard/legal-dictionary/_type/_id.vue')
const linkComponent = read(
  'components/dashboard/legal-dictionary/citation-link.vue'
)

assert.match(resultsPage, /citationsFor\(item\)/)
assert.match(resultsPage, /this\.activeType === 'glossary'/)
assert.match(resultsPage, /this\.activeType === 'dictionary'/)
assert.match(resultsPage, /DashboardLegalDictionaryCitationLink/)
assert.match(detailPage, /DashboardLegalDictionaryCitationLink/)
assert.match(linkComponent, /canUseCrossCitation/)
assert.match(linkComponent, /hasCaseAccess/)
assert.match(linkComponent, /required=CASE_ACCESS/)
assert.doesNotMatch(resultsPage, /v-html="formatCitation/)
assert.doesNotMatch(detailPage, /v-html="formatCitation/)

const caseRouteSources = [
  'components/dashboard/home/my-research.vue',
  'components/dashboard/home/recent-judgements.vue',
  'components/dashboard/my-research/saved-cases.vue',
  'components/dashboard/legal-research/result.vue',
  'components/dashboard/legal-research/html-case.vue',
  'pages/dashboard/legal-research/_slug.vue',
]
for (const file of caseRouteSources) {
  const source = read(file)
  assert.doesNotMatch(source, /base64(?:encode|decode)/i, `${file} must use raw case IDs.`)
}
assert.match(read('pages/dashboard/legal-research/_slug.vue'), /\^\\d\+_1_\\d\+\$/)

console.log('Cross-citation link regression checks passed.')
