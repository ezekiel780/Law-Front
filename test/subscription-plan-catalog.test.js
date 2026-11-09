const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const normalizeVmValue = (value) => JSON.parse(JSON.stringify(value))

const authApi = read('api/Auth.js')
const subscriptionApi = read('api/Subscription.js')
const catalog = read('components/subscription/catalog.vue')
const card = read('components/subscription/plan-card.vue')
const planChange = read('components/dashboard/subscription/plan-change.vue')
const utility = read('utils/subscription-plan.js')
const dashboard = read('components/dashboard/subscription/plan.vue')
const landing = read('components/landing/home/subscriptions.vue')
const homepage = read('pages/index.vue')

const paymentModal = read('components/dashboard/subscription/payment-modal.vue')
assert.match(card, /min_seats/)
assert.match(card, /per seat/)
assert.match(paymentModal, /Number of seats/)
assert.match(paymentModal, /minimumSeats/)
assert.doesNotMatch(paymentModal, /maximumSeats/)
assert.match(paymentModal, /no_of_users: selectedSeats/)
assert.match(paymentModal, /Estimated subscription total/)
assert.match(subscriptionApi, /no_of_users: Number\(payload\.no_of_users \|\| 1\)/)

assert.match(catalog, /productGroups/)
assert.match(catalog, /planProducts\(plan\)/)
assert.match(card, /Included access/)
assert.match(catalog, /premiumPlanIds/)
assert.match(utility, /comparePlansForCatalog/)
assert.match(utility, /normalizedPlanCategory/)
assert.match(utility, /planProductFamilyRank/)
assert.match(utility, /markPremiumPlansByProduct/)
assert.match(utility, /normalizedPlanCategory\(left\) === 'individual'/)
assert.match(utility, /Number\(Boolean\(right.is_premium\)\)/)
assert.match(utility, /feature_entitlements/)
assert.match(catalog, /plan-card-premium/)
assert.match(catalog, /Product bundle/)
assert.match(catalog, /categoryLabel/)
assert.match(catalog, /const key = `\$\{category\}:\$\{signature\}`/)
assert.doesNotMatch(catalog, /signature \|\| 'other'/)
assert.doesNotMatch(catalog, /Other plans/)
assert.match(card, /premium-badge/)
assert.match(card, /\{\{ plan\.title \}\}/)
assert.doesNotMatch(card, /plan\.title\s*\|\|/)
assert.doesNotMatch(planChange, /plan\.title\s*\|\|/)
assert.doesNotMatch(planChange, /subscription\.plan_name\s*\|\|/)
assert.match(planChange, /subscriptionProductLabel\(subscription\)/)
assert.match(planChange, /planProductLabel\(plan\)/)
assert.match(planChange, /\{\{ subscription\.title \}\}/)
assert.match(card, />Featured</)
assert.doesNotMatch(card, />New</)
assert.match(card, /this\.features\.slice\(0, 3\)/)
assert.doesNotMatch(catalog, /premium-notice/)
assert.doesNotMatch(catalog, /premium-ribbon/)
assert.doesNotMatch(catalog, /product-mark/)
assert.match(dashboard, /<subscription-catalog/)
assert.match(landing, /<subscription-catalog/)
assert.match(homepage, /success\.data\.plans\.all/)
assert.doesNotMatch(dashboard, /catalog-count/)
assert.doesNotMatch(dashboard, /Individual Plans/)
assert.doesNotMatch(dashboard, /Corporate Plans/)

// Plan identity is title only; product identity is id/name only.
assert.doesNotMatch(utility, /plan\.title\s*\|\|\s*plan\.slug/)
assert.doesNotMatch(utility, /product\.title/)
assert.doesNotMatch(utility, /product\.(code|slug|sku|item_code)/)
assert.doesNotMatch(authApi, /plan\.slug/)
assert.doesNotMatch(authApi, /plan\.grand_total/)
assert.doesNotMatch(subscriptionApi, /plan\.slug/)
assert.doesNotMatch(subscriptionApi, /plan\.grand_total/)
assert.doesNotMatch(authApi, /plan\.category\s*\|\|\s*'individual'/)
assert.doesNotMatch(
  subscriptionApi,
  /plan\.category\s*\|\|\s*'individual'/
)

const executableUtility = `${utility.replace(/export const /g, 'const ')}
module.exports = {
  comparePlansForCatalog,
  durationLabel,
  markPremiumPlansByProduct,
  normalizedPlanCategory,
  planFeatures,
  planProducts,
  planTitle,
};`
const context = {
  module: { exports: {} },
  exports: {},
  Set,
  Map,
  String,
  Number,
  Array,
  Math,
  Boolean,
}
vm.runInNewContext(executableUtility, context)
const {
  comparePlansForCatalog,
  durationLabel,
  markPremiumPlansByProduct,
  normalizedPlanCategory,
  planFeatures,
  planProducts,
  planTitle,
} = context.module.exports

assert.equal(durationLabel({ billing_interval: 'month', interval_count: 1 }), '1 month')
assert.equal(durationLabel({ billing_interval: 'month', interval_count: 3 }), '3 months')
assert.equal(durationLabel({ billing_interval: 'week', interval_count: 2 }), '2 weeks')
assert.equal(durationLabel({ billing_interval: 'day', interval_count: 90 }), '90 days')
assert.equal(durationLabel({ billing_interval: 'year', interval_count: 1 }), '1 year')
assert.equal(durationLabel({ period_days: 365 }), 'Duration not configured')

const orderedPlans = markPremiumPlansByProduct([
  {
    id: 1,
    title: 'NCLD Corporate',
    slug: 'wrong-nwlr-corporate',
    category: 'corporate',
    amount: 700000,
    product: {
      id: 2,
      name: 'NCLD Online',
      title: 'NWLR Online',
      code: 'NWLR_WRONG',
      sku: 'NWLR-WRONG',
    },
  },
  {
    id: 2,
    title: 'NWLR Corporate',
    slug: 'wrong-ncld-corporate',
    category: 'corporate',
    amount: 800000,
    product: {
      id: 1,
      name: 'NWLR Online',
      title: 'NCLD Online',
      code: 'NCLD_WRONG',
      sku: 'NCLD-WRONG',
    },
  },
  {
    id: 3,
    title: 'NCLD Basic',
    category: 'individual',
    amount: 10000,
    product: { id: 2, name: 'NCLD Online', code: 'NWLR_WRONG' },
  },
  {
    id: 4,
    title: 'NCLD Premium',
    category: 'individual',
    amount: 30000,
    product: { id: 2, name: 'NCLD Online', code: 'NWLR_WRONG' },
  },
  {
    id: 5,
    title: 'NWLR Basic',
    category: 'individual',
    amount: 20000,
    product: { id: 1, name: 'NWLR Online', code: 'NCLD_WRONG' },
  },
  {
    id: 6,
    title: 'NWLR Premium',
    category: 'individual',
    amount: 50000,
    product: { id: 1, name: 'NWLR Online', code: 'NCLD_WRONG' },
  },
]).sort(comparePlansForCatalog)

assert.strictEqual(
  orderedPlans.map((plan) => plan.title).join('|'),
  'NWLR Premium|NWLR Basic|NCLD Premium|NCLD Basic|NWLR Corporate|NCLD Corporate'
)
assert.strictEqual(
  orderedPlans.find((plan) => plan.title === 'NWLR Premium').is_premium,
  true
)
assert.strictEqual(
  orderedPlans.find((plan) => plan.title === 'NWLR Corporate').is_premium,
  false
)

assert.strictEqual(
  planTitle({ title: 'Explicit title', slug: 'wrong-slug' }),
  'Explicit title'
)
assert.strictEqual(planTitle({ slug: 'wrong-slug' }), '')
assert.strictEqual(normalizedPlanCategory({}), '')
assert.deepStrictEqual(
  normalizeVmValue(
    planProducts({
      product: {
        id: 10,
        name: 'NWLR Online',
        title: 'Wrong title',
        code: 'WRONG',
      },
      products: [
        { id: 10, name: 'NWLR Online duplicate' },
        { id: 20, name: 'NCLD Online', title: 'Wrong title' },
      ],
      feature_entitlements: [
        { product: { id: 30, name: 'Fallback product must not be used' } },
      ],
    })
  ),
  [
    { key: '10', name: 'NWLR Online', description: '' },
    { key: '20', name: 'NCLD Online', description: '' },
  ]
)
assert.deepStrictEqual(
  normalizeVmValue(
    planFeatures({
      feature_entitlements: [
        {
          id: 1,
          feature_name: 'General Search',
          feature_slug: 'wrong-name',
          is_active: true,
        },
        {
          product_feature_id: 2,
          feature_slug: 'fallback-only',
          is_active: true,
        },
      ],
    })
  ),
  [{ key: '1', name: 'General Search' }]
)
assert.strictEqual(
  markPremiumPlansByProduct([
    { id: 99, title: 'Malformed', category: 'individual', amount: 999999 },
  ])[0].is_premium,
  false
)

console.log('Subscription plan catalog regression checks passed.')

assert.doesNotMatch(paymentModal, /max_seats/)
assert.doesNotMatch(planChange, /max_seats/)
