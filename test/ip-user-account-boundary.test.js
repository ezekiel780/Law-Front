const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const sidebar = read('components/dashboard/base/sidebar.vue')
const header = read('components/dashboard/base/header.vue')
const dashboard = read('pages/dashboard/index.vue')
const middleware = read('middleware/auth.middleware.js')

// IP administrators retain their subscription link and upper access-management surface.
assert.match(sidebar, /showSubscription\(\)\s*\{\s*return !this\.isInstitutionalSession\s*\}/)
assert.match(dashboard, /<dashboard-home-header-cards v-if="!isIpUser"/)
assert.match(dashboard, /v-if="isInstitutionalSession"[\s\S]*You are currently logged in to an institutional network access account/)

// My Account must not be discoverable from either dashboard navigation entry
// for an IP-user administrator.
assert.match(sidebar, /v-if="!isInstitutionalSession && !isIpUser"[\s\S]*to="\/dashboard\/my-account"/)
assert.match(header, /v-if="!isInstitutionalSession && !isIpUser"[\s\S]*to="\/dashboard\/my-account"/)
assert.match(sidebar, /isIpUser\(\)\s*{\s*return this\.\$user\.getIsIpUser\(\)/)
assert.match(header, /isIpUser\(\)\s*{\s*return this\.\$user\.getIsIpUser\(\)/)

// IP administrators may open My Subscription; only personal account access is blocked here.
assert.match(middleware, /const isIpUser = \$user\.getIsIpUser\(\)/)
assert.match(middleware, /isIpUser &&[\s\S]*path\.includes\('\/my-account'\)\s*\)/)
assert.match(middleware, /redirectPath = '\/dashboard'/)

console.log('IP-user account boundary regression checks passed')

const subscription = read('pages/dashboard/my-subscription.vue')
assert.match(subscription, /v-if="isIpUser && !isInstitutionalSession"/)
assert.match(subscription, /<dashboard-subscription-list\s+v-if="!isInstitutionalSession && !isIpUser && !isPaymentConfirmed"/)
assert.match(subscription, /if \(this.isInstitutionalSession \|\| this.isIpUser\) return/)
