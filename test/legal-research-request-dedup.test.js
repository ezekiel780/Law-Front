const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const api = read('api/Research.js')
const search = read('components/dashboard/legal-research/search.vue')

assert(api.includes('const inFlightRequests = new Map()'))
assert(api.includes("coalesceRequest(key"))
assert(api.includes("requestKey('/auth/search'"))
assert(search.includes('if (this.isLoading) return false'))
assert(search.includes('lastSearchFingerprint'))
assert(search.includes('now - this.lastSearchStartedAt < 2000'))
assert(search.includes('previousPage !== undefined'))
assert(search.includes('this.$nextTick(() => this.performSearch())'))
assert(search.includes("term.length < 3"))
assert(search.includes('suggestionRequestSequence'))
assert(search.includes("status === 429 || status === 503"))

console.log('Legal-research request deduplication regression checks passed.')
