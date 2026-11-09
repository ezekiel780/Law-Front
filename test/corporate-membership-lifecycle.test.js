const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const api = fs.readFileSync(path.join(root, 'api/Subscription.js'), 'utf8')
const management = fs.readFileSync(
  path.join(root, 'components/dashboard/subscription/manage-user.vue'),
  'utf8'
)
const removal = fs.readFileSync(
  path.join(root, 'components/dashboard/subscription/delete-user-modal.vue'),
  'utf8'
)
const page = fs.readFileSync(
  path.join(root, 'pages/dashboard/my-subscription.vue'),
  'utf8'
)

assert.match(
  api,
  /leaveCorporateSubscription:\s*\(subscriptionId\)\s*=>[\s\S]*account\/corporate-memberships/
)
assert.match(page, /canLeaveCorporatePlan/)
assert.match(page, /<dashboard-subscription-list[\s\S]*v-if="!isInstitutionalSession && !isIpUser && !isPaymentConfirmed"/)
assert.match(api, /getCorporateMemberships:/)
assert.match(page, /joinedCorporateMemberships/)
assert.match(page, /membershipsResponse/)
assert.match(page, /Leave corporate plan/)
assert.match(page, /leaveCorporateSubscription/)
assert.match(page, /leaveCorporatePlan\(membership\)/)
assert.match(page, /recoverNodeSession\(\)/)
assert.match(page, /overlapping personal subscription[\s\S]*resumes with[\s\S]*unused time preserved/i)
assert.match(page, /new invite/i)
// The corporate-member management screen intentionally omits the explanatory
// lifecycle paragraph. Keep this regression guard aligned with the product copy
// requirement so the removed paragraph is not accidentally reintroduced.
assert.doesNotMatch(management, /existing customer account is reused/i)
assert.doesNotMatch(management, /corporate access starts only after the invitation is accepted/i)
assert.doesNotMatch(management, /overlapping personal subscription is then paused/i)
assert.doesNotMatch(management, /user may be added again later through a new invitation/i)
assert.doesNotMatch(removal, /irreversible/i)
assert.doesNotMatch(removal, /personal subscription[\s\S]*resume/i)
assert.match(removal, /Removing this user ends their corporate access immediately[\s\S]*may rejoin later through a new invitation[\s\S]*Do you want to continue\?/i)
assert.match(removal, /rejoin later through a new[\s\S]*invitation/i)

console.log('Corporate membership leave and rejoin UI checks passed.')
