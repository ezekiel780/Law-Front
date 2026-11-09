const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const authApi = read('api/Auth.js')
const accountApi = read('api/Account.js')
const activationPage = read('pages/auth/activate-account/_slug.vue')

const packageJson = JSON.parse(read('package.json'))
const apiSource = [
  'api/Auth.js',
  'api/Account.js',
  'api/Research.js',
  'api/Dictionary.js',
  'api/Subscription.js',
].map(read).join('\n')

assert.doesNotMatch(apiSource, /signature\s*[:,]/)
assert.doesNotMatch(apiSource, /encodeApiData|JWT_SECRET|user_token/)
assert.equal(fs.existsSync(path.join(root, 'plugins', 'jwtencode.js')), false)
assert.equal(packageJson.dependencies.njwt, undefined)
assert.doesNotMatch(read('nuxt.config.js'), /jwtencode|encodeApi|JWT_SECRET/)
assert.doesNotMatch(read('.env.example'), /JWT_SECRET/)
assert.match(read('scripts/remove-legacy-runtime.js'), /jwtencode\.js/)
assert.doesNotMatch(authApi, /\/secure\/v1\/shop|\/shop\//)

assert.match(authApi, /\/auth\/register\/customer/)
assert.match(authApi, /\/auth\/forgot-password/)
assert.match(authApi, /\/auth\/reset-password/)
assert.match(authApi, /\/plans\?per_page=100/)
assert.match(authApi, /\/payment-methods/)
assert.doesNotMatch(authApi, /axios\.post\('\/register'/)
assert.doesNotMatch(authApi, /\/verify-user/)
assert.doesNotMatch(authApi, /\/password-reset/)
assert.doesNotMatch(authApi, /\/validate-token/)
assert.doesNotMatch(authApi, /\/update-password/)

assert.match(
  accountApi,
  /\/account\/subscriptions\/\$\{subscriptionId\}\/auto-renew/
)
assert.match(accountApi, /\/auth\/node-token/)
assert.doesNotMatch(accountApi, /\/auth\/update-debit/)

assert.doesNotMatch(activationPage, /\/verify-user/)
assert.doesNotMatch(activationPage, /Laravel|Node authentication|retired/i)

console.log('Frontend ownership regression checks passed.')
