const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const middleware = read('middleware/auth.middleware.js')
const search = read('components/dashboard/legal-research/search.vue')
const sessionPlugin = read('plugins/auth-session-sync.client.js')

assert.ok(
  middleware.includes("if (/\\/dashboard\\/legal-research\\/[^/]+/.test(path))") &&
    middleware.indexOf("capabilities: ['CASE_ACCESS']") >
      middleware.indexOf("if (/\\/dashboard\\/legal-research\\/[^/]+/.test(path))"),
  'case document routes must check CASE_ACCESS before rendering'
)
assert.ok(
  middleware.includes("if (path.includes('/dashboard/legal-research'))") &&
    middleware.indexOf("capabilities: ['LEGAL_RESEARCH']") >
      middleware.indexOf("if (path.includes('/dashboard/legal-research'))"),
  'search routes must check LEGAL_RESEARCH'
)

const researchCall = search.match(
  /this\.\$api\.research\.search\([\s\S]*?\n\s*\)/
)?.[0]
assert.ok(researchCall, 'the legal research API call must exist')
assert.equal(
  (researchCall.match(/this\.justiceValue/g) || []).length,
  1,
  'justice must be passed once so counsel and parties are not shifted'
)
assert.equal((researchCall.match(/this\.counselValue/g) || []).length, 1)
assert.equal((researchCall.match(/this\.partiesValue/g) || []).length, 1)
assert.ok(
  search.includes("startDateValue: ''") &&
    search.includes("endDateValue: ''"),
  'judgement-date filters must be empty until the user explicitly selects dates'
)
assert.ok(
  !search.includes("startDateValue: 'dd/mm/yyyy'") &&
    !search.includes("endDateValue: 'dd/mm/yyyy'"),
  'placeholder text must not be sent as a date filter'
)


assert.ok(
  middleware.includes('await $user.recoverNodeSession()'),
  'a stale Node token should be recovered without clearing the primary login'
)
assert.ok(
  !/statusCode\(error\) === 401[\s\S]{0,120}\$user\.logout/.test(middleware),
  'a Node-side 401 must not force a full account logout during route access checks'
)


assert.ok(
  sessionPlugin.includes('event.timestamp < sessionStartedAt') &&
    sessionPlugin.includes('clearLatestSessionEvent()'),
  'a stale cross-tab logout marker must not log out a newly opened case tab'
)

console.log('Legal research access and filter wiring checks passed.')
