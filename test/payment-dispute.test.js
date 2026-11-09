const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const history = read('components/dashboard/subscription/history.vue')
const modal = read('components/dashboard/subscription/payment-dispute-modal.vue')
const api = read('api/Subscription.js')

assert.match(history, /payment_can_dispute && history\.payment_id/, 'The dispute action must only appear for an eligible unpaid payment')
assert.match(history, /Dispute payment/, 'Payment history must expose a clear dispute button')
assert.match(history, /dashboard-subscription-payment-dispute-modal/, 'Payment history must open the dispute form')
assert.match(history, /getSubscriptions\(this\.pagination\.currentPage\)/, 'Payment history must refresh after a dispute is submitted')
assert.match(modal, /provider_success_not_reflected/, 'The dispute form must support successful-provider/unpaid-NWLR disputes')
assert.match(modal, /customer_note/, 'The dispute form must collect a customer explanation')
assert.match(modal, /provider_reference/, 'The dispute form must allow a provider receipt reference')
assert.match(api, /\/account\/payments\/\$\{paymentId\}\/disputes/, 'The customer dispute must be submitted to Laravel account payments')
assert.match(api, /\/account\/payment-disputes\/\$\{disputeId\}\/information/, 'Customers must be able to answer support information requests')
assert.match(history, /payment-dispute-status-modal/, 'Existing disputes must expose a trackable status view')
assert.doesNotMatch(api, /secure\/v1.*dispute/, 'Payment disputes must not be routed through Node')

console.log('payment dispute regressions passed')
