const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const authMiddleware = read('middleware/auth.middleware.js')
const userService = read('services/auth/user.js')
const userStore = read('store/user.js')
const accessService = read('services/auth/access.js')
const ncldAccess = read('services/auth/ncld-access.js')
const authApi = read('api/Auth.js')
const sidebar = read('components/dashboard/base/sidebar.vue')
const dictionaryIndex = read('pages/dashboard/legal-dictionary/index.vue')
const dictionaryResults = read('pages/dashboard/legal-dictionary/results.vue')
const dictionaryDetail = read('pages/dashboard/legal-dictionary/_type/_id.vue')
const citationLink = read(
  'components/dashboard/legal-dictionary/citation-link.vue'
)
const dashboard = read('pages/dashboard/index.vue')
const subscription = read('pages/dashboard/my-subscription.vue')
const autoLogout = read('components/utils/auto-logout.vue')
const sessionPolicy = read('services/auth/session-policy.js')
const entitlementRedirect = read('plugins/entitlement-redirect.client.js')
const nuxtConfig = read('nuxt.config.js')

assert.match(authMiddleware, /LEGAL_RESEARCH/)
assert.match(authMiddleware, /CASE_ACCESS/)
assert.match(authMiddleware, /DICTIONARY_SEARCH/)
assert.match(authMiddleware, /capabilityForDictionaryType/)
assert.match(authMiddleware, /anyCapabilities/)
assert.match(authMiddleware, /missingCapability/)
assert.match(authMiddleware, /missingAnyCapability/)
assert.doesNotMatch(authMiddleware, /entitlementProducts: \['NCLD'\]/)
assert.doesNotMatch(authMiddleware, /hasEntitlementProduct/)
assert.doesNotMatch(authMiddleware, /products:\s*\['NWLR'\]/)
assert.doesNotMatch(
  authMiddleware,
  /path\.includes\('\/legal-research'\)\s*&&\s*!isSubscribed/
)

for (const capability of [
  'CROSS_CITATION',
  'DICTIONARY_SEARCH',
  'GLOSSARY_SEARCH',
  'LEGAL_MAXIM',
]) {
  assert.match(ncldAccess, new RegExp(`${capability}: '${capability}'`))
}
assert.match(ncldAccess, /dictionary: NCLD_CAPABILITIES\.DICTIONARY_SEARCH/)
assert.match(ncldAccess, /glossary: NCLD_CAPABILITIES\.GLOSSARY_SEARCH/)
assert.match(ncldAccess, /'legal-maxims': NCLD_CAPABILITIES\.LEGAL_MAXIM/)

assert.match(userStore, /access:\s*normalizeAccess\(\)/)
assert.match(userStore, /getActiveProducts/)
assert.match(userStore, /getActiveFeatures/)
assert.match(userStore, /getActiveCapabilities/)
assert.match(userService, /hasCapabilities/)
assert.match(userService, /hasEntitlementProducts/)
assert.match(userService, /hasEntitlementProduct:/)
assert.match(userService, /setAccessFromProfile/)
assert.match(userService, /refreshAccess:\s*async/)
assert.match(userService, /ensureNodeToken:\s*async/)
assert.match(accessService, /capabilities/)
assert.match(accessService, /entitlements/)
assert.match(accessService, /entitlementProductCodes/)
assert.match(accessService, /hasEntitlementProducts/)
assert.match(authApi, /\/auth\/me\/access/)
assert.match(authApi, /\/auth\/node-token/)

assert.match(sidebar, /this\.\$user\.can\('LEGAL_RESEARCH', 'CASE_ACCESS'\)/)
assert.match(sidebar, /NCLD_SEARCH_CAPABILITIES/)
assert.match(sidebar, /ncldSearchCapabilities\.some/)
assert.match(sidebar, /anyFeatureDestination/)
assert.doesNotMatch(sidebar, /hasEntitlementProduct\('NCLD'\)/)
assert.doesNotMatch(sidebar, /entitlementProductDestination/)

assert.match(dictionaryIndex, /NCLD_CAPABILITIES\.DICTIONARY_SEARCH/)
assert.match(dictionaryIndex, /NCLD_CAPABILITIES\.GLOSSARY_SEARCH/)
assert.match(dictionaryIndex, /NCLD_CAPABILITIES\.LEGAL_MAXIM/)
assert.match(dictionaryIndex, /ensureActiveTypeAccess/)
assert.match(dictionaryIndex, /option\.available/)

for (const source of [dictionaryResults, dictionaryDetail]) {
  assert.match(source, /NCLD_CAPABILITIES\.CROSS_CITATION/)
  assert.match(source, /this\.\$user\.can\('CASE_ACCESS'\)/)
  assert.match(source, /DashboardLegalDictionaryCitationLink/)
}
assert.match(citationLink, /canUseCrossCitation/)
assert.match(citationLink, /hasCaseAccess/)
assert.match(citationLink, /my-subscription\?required=CASE_ACCESS/)

assert.match(dashboard, /v-if="hasNwlrAccess"/)
assert.match(dashboard, /setAccessFromProfile/)
assert.match(subscription, /requiredCapabilityLabel/)
assert.match(subscription, /Select a plan that includes this capability/)
assert.doesNotMatch(subscription, /current entitlements do not include NWLR/)

assert.match(sessionPolicy, /SESSION_IDLE_TIMEOUT_MS = 8 \* 60 \* 60 \* 1000/)
assert.match(autoLogout, /SESSION_WARNING_WINDOW_MS = 15 \* 60 \* 1000/)
assert.match(autoLogout, /ensureNodeToken/)
assert.match(autoLogout, /UpdateLastLoginTime/)
assert.match(entitlementRedirect, /response\?\.status/)
assert.match(entitlementRedirect, /!== 403/)
assert.match(entitlementRedirect, /required\.capabilities/)
assert.match(entitlementRedirect, /requiredCapabilities\[0\]/)
assert.match(entitlementRedirect, /required\.entitlement_products/)
assert.match(entitlementRedirect, /requiredEntitlementProducts\[0\]/)
assert.doesNotMatch(entitlementRedirect, /productForRequest/)
assert.match(nuxtConfig, /entitlement-redirect\.client\.js/)

console.log('Eight-hour session and exact NCLD capability routing checks passed.')
