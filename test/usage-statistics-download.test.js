const fs = require('fs')
const path = require('path')
const assert = require('assert')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const accountApi = read('api/Account.js')
const profile = read('components/dashboard/my-account/profile.vue')

assert.match(
  accountApi,
  /account\/engagement\/usage-statistics\/download/,
  'The account API must download usage statistics from Laravel.'
)
assert.match(accountApi, /responseType:\s*'blob'/)
assert.match(accountApi, /headers:\s*laravelAuthHeaders\(store\)/)

assert.doesNotMatch(profile, />\s*Download Usage Statistics\s*</)
assert.doesNotMatch(profile, /downloadUsageStatistics\(/)
assert.doesNotMatch(profile, /usageDownloadError/)

console.log('Usage statistics download remains available at the API layer but hidden from the customer profile UI.')
