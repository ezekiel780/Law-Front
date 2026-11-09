const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const page = read('pages/dashboard/my-subscription.vue')
const list = read('components/dashboard/subscription/list.vue')
const panel = read('components/dashboard/subscription/auto-renewal.vue')
const api = read('api/Account.js')
const subscriptionApi = read('api/Subscription.js')
const paymentModal = read('components/dashboard/subscription/payment-modal.vue')

assert.match(page, /:can-manage-auto-renewal="canManageAutoRenewal"/)
assert.match(page, /this\.canManageAutoRenewal = true/)
assert.match(page, /this\.canManagePlanChanges = true/)
assert.match(page, /if \(owned\[0\]\?\.id\)/)
assert.match(list, /v-if="canManageAutoRenewal"/)
assert.match(
  list,
  /v-if="canManageAutoRenewal && buttonStates\.autoRenewal"/
)
assert.match(
  list,
  /if \(key === 'autoRenewal' && !this\.canManageAutoRenewal\) return/
)
assert.match(panel, /NWLR does not store your card number or CVV/)
assert.match(panel, /provider-issued authorization token/)
assert.match(
  api,
  /\/account\/subscriptions\/\$\{subscriptionId\}\/auto-renew/
)
assert.doesNotMatch(api, /card_number|cvv|authorization_code/i)
assert.match(
  subscriptionApi,
  /auto_renew: Boolean\(payload\.recurring\)/,
  'Checkout recurring intent must be sent to Laravel'
)
assert.match(
  paymentModal,
  /provider returns a[\s\S]*reusable card authorization/,
  'Checkout must explain that recurring access depends on a reusable provider authorization'
)
assert.match(
  page,
  /Auto-renewal not enabled/,
  'The return page must warn when recurring was requested but no reusable mandate was captured'
)

console.log('Auto-renewal frontend regression checks passed.')
