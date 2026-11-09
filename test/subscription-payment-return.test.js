const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const api = read('api/Subscription.js')
const paymentModal = read('components/dashboard/subscription/payment-modal.vue')
const page = read('pages/dashboard/my-subscription.vue')

assert.match(
  paymentModal,
  /nwlr_pending_subscription_payment/,
  'Payment initialization must persist a recoverable pending payment before redirecting'
)
assert.match(
  paymentModal,
  /sessionStorage\.setItem/,
  'Pending payment state must survive the hosted-checkout redirect'
)
assert.match(
  paymentModal,
  /window\.location\.assign\(success\.payment_url\)/,
  'Hosted checkout must start only after the payment reference is persisted'
)
assert.match(
  page,
  /query\.reference[\s\S]*query\.trxref[\s\S]*query\.tx_ref/,
  'The return page must accept standard Paystack and Flutterwave callback references'
)
assert.doesNotMatch(
  page,
  /hasOwnProperty\(['"]type['"]\)/,
  'Payment verification must not depend on a non-standard type query parameter'
)
assert.match(
  page,
  /for \(let attempt = 1; attempt <= 3; attempt \+= 1\)/,
  'Callback verification must tolerate a short provider settlement delay'
)
assert.match(
  page,
  /cleanPaymentReturnQuery/,
  'Provider callback parameters must be removed after processing'
)
assert.match(
  api,
  /account\/subscriptions\/payments\/verify/,
  'Subscription callbacks must verify through Laravel'
)
assert.match(
  api,
  /if \(paymentStatus === 'paid' && subscriptionAccessGranted\)/,
  'The Node access token must refresh only after payment and entitlement access both succeed'
)
assert.match(
  page,
  /paymentIsPaid && subscriptionAccessGranted/,
  'The success state must require both a paid payment and granted subscription entitlements'
)
assert.match(
  page,
  /Customer Service has been notified automatically/,
  'A paid checkout without access must show a clear support-managed pending state'
)
assert.match(
  api,
  /external_reference: payment\.external_reference/,
  'Initialization must preserve the provider reference for recovery'
)

console.log('Subscription payment return checks passed.')
