const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const editProfile = read('components/dashboard/my-account/edit-profile.vue')
const accountApi = read('api/Account.js')

assert.match(editProfile, /watch:\s*\{[\s\S]*user:\s*\{[\s\S]*immediate:\s*true/)
assert.match(editProfile, /hydrateForm\(user \|\| \{\}\)/)
assert.match(editProfile, /this\.firstName = this\.normalize\(user\.firstname\)/)
assert.match(editProfile, /this\.selectedCountry = this\.findByName/)
assert.match(editProfile, /this\.selectedState = this\.findByName/)
assert.match(editProfile, /this\.selectedLocalGovernment = knownArea\.name/)
assert.match(editProfile, /town: this\.area/)
assert.match(accountApi, /town: payload\.town \|\| payload\.area \|\| payload\.city/)

assert.match(
  accountApi,
  /axios\.patch\(\s*`\$\{laravelApiBaseUrl\(\)\}\/account\/profile`/
)
assert.match(accountApi, /getLaravelToken/)
assert.doesNotMatch(accountApi, /axios\.post\('\/auth\/profile'/)
assert.doesNotMatch(editProfile, /this\.\$router\.go\(0\)/)
assert.match(editProfile, /this\.\$emit\('profile-updated'/)

console.log('Profile form hydration and update checks passed.')
