const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const accountPage = fs.readFileSync(
  path.join(root, 'pages/dashboard/my-account.vue'),
  'utf8'
)
const authApi = fs.readFileSync(path.join(root, 'api/Auth.js'), 'utf8')

assert.match(
  accountPage,
  /v-if="user && user\.data"/,
  'The profile component must not render when the profile request failed'
)
assert.match(
  accountPage,
  /const profile = this\.user && this\.user\.data \? this\.user\.data : \{\}/,
  'The computed profile must tolerate a null API response'
)
assert.match(accountPage, /this\.profileError = ''/)
assert.match(accountPage, /if \(!success \|\| !success\.data\)/)
assert.match(accountPage, /this\.user = null/)
assert.match(
  accountPage,
  /this\.\$errorHandler\.setAndParse\(error\)/,
  'A failed request should surface the backend API error message when available'
)
assert.doesNotMatch(
  accountPage,
  /Your account information is temporarily unavailable/,
  'The old generic profile error must not mask a more useful backend message'
)
assert.match(authApi, /axios\.get\('\/auth\/profile'/)
assert.match(authApi, /axios\.get\('\/auth\/me\/access'/)

console.log('Account-page network failure and null-response checks passed.')
