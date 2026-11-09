const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const persister = read('plugins/vuex-persister.js')
const middleware = read('middleware/auth.middleware.js')
const results = read('components/dashboard/legal-research/result.vue')

assert.match(results, /target="_blank"/)
assert.match(
  persister,
  /window\.localStorage\.setItem\(\s*STATE_STORAGE_KEY/,
  'the complete authenticated state must be shared between tabs through localStorage'
)
assert.match(persister, /SESSION_COOKIE_KEY = 'nwlr_session'/)
assert.match(persister, /compactSessionUser/)
assert.match(persister, /sessionMode: user\.sessionMode \|\| null/)
assert.match(persister, /VALID_SESSION_MODES/)
assert.match(persister, /entitlements: \[\]/)
assert.match(persister, /active_subscription: null/)
assert.doesNotMatch(persister, /createPersistedState/)
assert.doesNotMatch(persister, /paths:\s*\['user'\]/)
assert.match(persister, /Cookies\.remove\(LEGACY_COOKIE_KEY/)
assert.match(
  middleware,
  /process\.server && !\$user\.getAccessLoadedAt\(\)/,
  'SSR must not treat an intentionally compact, not-yet-hydrated session as a subscription denial'
)

const compactSessionExample = {
  user: {
    isLoggedIn: true,
    isIpUser: false,
    sessionMode: 'account',
    isSubscribed: true,
    subscriptionId: 85661,
    isParent: false,
    canTimeOut: true,
    loginTime: Date.now(),
    firstname: 'Joel',
    lastname: 'Okoromi',
    avatar: null,
    access: {
      products: ['NWLR', 'NCLD'],
      features: [
        'CASE_ACCESS',
        'LEGAL_RESEARCH',
        'CROSS_CITATION',
        'DICTIONARY_SEARCH',
        'GLOSSARY_SEARCH',
        'LEGAL_MAXIM',
      ],
      capabilities: [
        'CASE_ACCESS',
        'LEGAL_RESEARCH',
        'CROSS_CITATION',
        'DICTIONARY_SEARCH',
        'GLOSSARY_SEARCH',
        'LEGAL_MAXIM',
      ],
      entitlements: [],
      active_subscription: null,
    },
    accessLoadedAt: Date.now(),
  },
}

assert.ok(
  Buffer.byteLength(JSON.stringify(compactSessionExample), 'utf8') < 2048,
  'the SSR session cookie must remain safely below browser per-cookie limits'
)

console.log('New-tab authentication persistence regression checks passed.')
