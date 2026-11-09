const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const casePage = read('pages/dashboard/legal-research/_slug.vue')
const search = read('components/dashboard/legal-research/search.vue')
const results = read('components/dashboard/legal-research/result.vue')

assert.match(casePage, /loadState:\s*'loading'/)
assert.match(casePage, /v-else-if="loadState === 'error'"/)
assert.match(casePage, /this\.loadState = 'error'/)
assert.match(casePage, /this\.loadState = 'loaded'/)
assert.match(casePage, /@click="retryCaseFile"/)
assert.match(casePage, /@click="returnToResearch"/)
assert.doesNotMatch(
  casePage,
  /<div v-else>[\s\S]*Processing document, Please Wait![\s\S]*<\/div>/
)

assert.match(search, /this\.\$emit\('search-error', null\)/)
assert.match(search, /this\.\$emit\('search-error', \{/)
assert.match(search, /finally \{[\s\S]*this\.isLoading = false/)
assert.match(results, /@search-error="updateSearchError"/)
assert.match(results, /Search could not be completed/)
assert.match(results, /@click="retrySearch"/)

console.log('Legal-research failure-state regression checks passed.')
