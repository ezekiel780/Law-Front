const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const api = read('api/Subscription.js')
const history = read('components/dashboard/subscription/history.vue')
const preview = read('components/dashboard/subscription/preview-modal.vue')

assert.doesNotMatch(
  api,
  /account\/subscriptions\/\$\{subscription\.id\}/,
  'Subscription history must not request one detail endpoint per row'
)
assert.doesNotMatch(
  api.slice(api.indexOf('getSubscriptions:'), api.indexOf('createSubscription:')),
  /Promise\.all/,
  'Subscription history must not fan out detail requests'
)
assert.match(api, /page,\s*per_page: perPage/)
assert.match(history, /payment_status/)
assert.match(history, /pagination\.lastPage/)
assert.match(history, /aria-label="Subscription history pagination"/)
assert.match(history, /Showing/)
assert.match(history, /serialNumber\(index\)/)
assert.match(history, /paymentStatusLabel\(history\.payment_status,\s*history\.payment_record_state\)/)
assert.match(history, /Payment record missing/)
assert.match(history, /history\.payment_record_state === 'missing' \? 'Pay now' : 'Resume payment'/)
assert.doesNotMatch(history, /history\.payments\[0\]/)
assert.doesNotMatch(preview, /paymentData\.payments\[0\]/)

console.log('Subscription history request and pagination checks passed.')
