const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const page = read('pages/dashboard/my-subscription.vue')
const list = read('components/dashboard/subscription/list.vue')

assert.match(page, /:can-manage-corporate-users="canManageCorporateUsers"/)
assert.match(page, /toLowerCase\(\) === 'corporate'/)
assert.match(page, /Number\(subscription\.primary\) === 1/)
assert.match(page, /subscription\.subscription_status === true/)
assert.match(page, /hasLaravelSession/)
assert.match(page, /!isInstitutionalSession/)

assert.match(list, /v-if="canManageCorporateUsers"/)
assert.match(
  list,
  /v-if="canManageCorporateUsers && buttonStates\.manageUser"/
)
assert.match(
  list,
  /if \(key === 'manageUser' && !this\.canManageCorporateUsers\) return/
)

console.log('Corporate subscription user-management visibility checks passed.')
