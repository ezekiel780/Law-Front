const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const api = fs.readFileSync(path.join(root, 'api/Subscription.js'), 'utf8')
const list = fs.readFileSync(
  path.join(root, 'components/dashboard/subscription/list.vue'),
  'utf8'
)
const component = fs.readFileSync(
  path.join(root, 'components/dashboard/subscription/plan-change.vue'),
  'utf8'
)

assert.match(api, /quotePlanChange/)
assert.match(api, /acceptPlanChange/)
assert.match(api, /previewPlanChangePayment/)
assert.match(api, /initializePlanChangePayment/)
assert.match(api, /cancelPlanChange/)
assert.match(api, /no_refund_acknowledged: true/)
assert.match(list, /dashboard-subscription-plan-change/)
assert.match(component, /Non-refundable value applied to this upgrade/)
assert.doesNotMatch(component, /Downgrades[\s\S]*scheduled for the current renewal/)
assert.match(component, /<template v-if="!loading">/)
assert.match(component, /@click="resetReview"/)
assert.match(component, /entitlementBucket\('added'\)/)
assert.match(component, /entitlementBucket\('removed'\)/)
assert.match(component, /Payment provider charge/)
assert.match(component, /Total submitted to provider/)
assert.match(component, /subscriptionData\.premium/)
assert.match(component, /Complete payment/)
assert.match(component, /plan_change_id/)
assert.match(component, /targetMinimumSeats/)
assert.doesNotMatch(component, /targetMaximumSeats/)
assert.match(component, /normalizeTargetSeats/)

console.log('Plan-change lifecycle regression checks passed.')

// Exercise the component methods so corporate seat defaults and retry state are checked at runtime.
const vm = require('vm')
const script = component.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/^import .*$/gm, '')
  .replace('export default', 'module.exports =')
const context = { module: { exports: {} } }
vm.runInNewContext(script, context)
const definition = context.module.exports
const review = { targetPlanId: '11', targetMinimumSeats: 11, selectedSource: { no_of_users: 20 }, clearQuote() {} }
definition.watch.targetPlanId.call(review)
assert.strictEqual(review.targetSeats, 20)
review.selectedSource.no_of_users = 1
definition.watch.targetPlanId.call(review)
assert.strictEqual(review.targetSeats, 11)
assert.strictEqual(definition.computed.acceptLabel.call({ quote: { amount_due: 500, change_type: 'billing_cycle_change' } }), 'Accept and continue to payment')
