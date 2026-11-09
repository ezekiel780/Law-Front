const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const userStore = read('store/user.js')
const userService = read('services/auth/user.js')
const persister = read('plugins/vuex-persister.js')
const ipAuth = read('plugins/ip-auth.client.js')
const login = read('components/landing/auth/login-form.vue')
const defaultLayout = read('layouts/default.vue')
const dictionaryLayout = read('layouts/dictionary-hardcopy.vue')
const nuxtConfig = read('nuxt.config.js')

// IP account type must be explicit and SSR-safe; secret-token presence must not
// decide which Vue tree the server renders.
assert.match(userStore, /sessionMode: null/)
assert.match(userStore, /getSessionMode/)
assert.match(userService, /getSessionMode:/)
assert.match(userService, /=== 'institutional_reader'/)

// Both localStorage and the compact SSR cookie carry the same render mode.
assert.match(persister, /sessionMode: user\.sessionMode \|\| null/)
assert.match(persister, /VALID_SESSION_MODES/)
assert.match(
  persister,
  /user\.isLoggedIn && !VALID_SESSION_MODES\.has\(user\.sessionMode\)/
)

// Credential login records Laravel's canonical session mode before marking the
// store logged in, avoiding a transient ambiguous render state.
const modeIndex = login.indexOf('setSessionMode(sessionMode)')
const loggedInIndex = login.indexOf('setIsLoggedIn(true)')
assert.ok(modeIndex > -1 && loggedInIndex > -1 && modeIndex < loggedInIndex)

// Automatic network login is a client plugin and waits until the initial DOM
// has loaded/hydrated. It must never run as universal/layout middleware.
assert.match(nuxtConfig, /ip-auth\.client\.js/)
assert.match(ipAuth, /window\.addEventListener\('load', afterHydration/)
assert.match(ipAuth, /window\.requestAnimationFrame/)
assert.match(ipAuth, /setSessionMode\('institutional_reader'\)/)
assert.match(ipAuth, /!\$user\.getIsInstitutionalSession\(\)/)
assert.match(ipAuth, /app\.router\.replace\('\/dashboard'\)/)
assert.doesNotMatch(defaultLayout, /ip-auth\.middleware/)
assert.doesNotMatch(dictionaryLayout, /ip-auth\.middleware/)
assert.equal(fs.existsSync(path.join(root, 'middleware/ip-auth.middleware.js')), false)

console.log('IP-session SSR/hydration regression checks passed.')
