const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const dashboard = read('pages/dashboard/index.vue')
const recents = read('components/dashboard/home/recent-judgements.vue')
const middleware = read('middleware/auth.middleware.js')

assert.ok(
  dashboard.includes('<dashboard-home-recent-judgements') &&
    dashboard.includes(':can-open-cases="hasNwlrAccess"'),
  'dashboard must render recent judgment previews and pass case-opening access explicitly'
)

assert.ok(
  !/v-if="hasNwlrAccess"[\s\S]{0,180}<dashboard-home-recent-judgements/.test(
    dashboard
  ),
  'recent judgments must not disappear when NWLR access is absent'
)

assert.ok(
  recents.includes('v-if="canOpenCases"') &&
    recents.includes('v-else') &&
    recents.includes('aria-disabled="true"'),
  'unsubscribed recent-judgment cards must render without an opening link'
)

assert.ok(
  recents.includes(':href="caseHref(recentJudgement)"'),
  'case links must only be emitted by the access-enabled branch'
)

assert.ok(
  middleware.includes("if (/\\/dashboard\\/legal-research\\/[^/]+/.test(path))") &&
    middleware.includes("capabilities: ['CASE_ACCESS']"),
  'direct case routes must remain protected by CASE_ACCESS'
)

assert.ok(
  middleware.includes("if (path.includes('/dashboard/legal-research'))") &&
    middleware.includes("capabilities: ['LEGAL_RESEARCH']"),
  'legal-research/search pages must remain protected by LEGAL_RESEARCH'
)

assert.match(
  dashboard,
  /isIpNetworkRestriction\(error\)[\s\S]*setAccessFromProfile\(\{\}\)[\s\S]*loadRecentJudgementPreview\(\)/,
  'an IP-restricted corporate account must clear stale entitlements and keep metadata-only dashboard previews'
)

assert.match(
  dashboard,
  /this\.\$api\.auth\.landingPage\(\)/,
  'the outside-network IP fallback must use the public recent-judgment preview feed'
)

assert.match(
  dashboard,
  /this\.profileError = this\.apiErrorMessage\(error\)/,
  'the dashboard must show the backend error message instead of a generic profile failure'
)

assert.match(
  dashboard,
  /v-else-if="!isIpUser"[\s\S]*Your current subscription does not include NWLR access/,
  'an IP account outside its network must not be told to buy another subscription'
)

console.log('Unsubscribed dashboard preview access checks passed.')
