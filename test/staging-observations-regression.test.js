const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const landingHeader = read('components/landing/base/header.vue')
const sidebar = read('components/dashboard/base/sidebar.vue')
const autoLogout = read('components/utils/auto-logout.vue')
const sessionPolicy = read('services/auth/session-policy.js')
const paymentModal = read('components/dashboard/subscription/payment-modal.vue')
const historyPaymentModal = read('components/dashboard/subscription/history-payment-modal.vue')
const planChange = read('components/dashboard/subscription/plan-change.vue')
const paymentVisual = read('components/utils/payment-method-visual.vue')
const svgLoader = read('components/utils/svg-loader.vue')
const landingFooter = read('components/landing/base/footer.vue')

assert.match(landingHeader, /src="@\/assets\/icons\/logo-v2\.svg"/)
assert.match(
  landingHeader,
  /<nuxt-link[\s\S]*?to="\/"[\s\S]*?src="\/nwlr-logo\.png"/
)
assert.match(landingHeader, /sm:hidden/)
assert.match(svgLoader, /\(\?!none/)
assert.match(svgLoader, /url\\\(/)

assert.strictEqual(
  (sidebar.match(/<nuxt-link[\s\S]*?to="\/"[\s\S]*?aria-label="NWLR home"/g) || [])
    .length,
  2
)
assert.match(
  landingFooter,
  /<nuxt-link[\s\S]*?to="\/"[\s\S]*?src="@\/assets\/images\/logo\.png"/
)
assert.match(sidebar, /showSubscription\(\)\s*\{\s*return !this\.isInstitutionalSession/)
assert.match(sessionPolicy, /SESSION_IDLE_TIMEOUT_MS = 8 \* 60 \* 60 \* 1000/)

assert.match(paymentModal, /gateway !== 'manual'/)
assert.match(paymentModal, /Manual payment created/)
assert.match(historyPaymentModal, /gateway !== 'manual'/)
assert.match(planChange, /gateway !== 'manual'/)
assert.match(planChange, /hasUnresolvedProviderCheckout/)

assert.match(paymentVisual, /'paystack\.svg': paystackLogo/)
assert.match(paymentVisual, /'flutterwave\.svg': flutterwaveLogo/)
assert.match(paymentVisual, /'interswitch\.svg': interswitchLogo/)

console.log('Staging-observation regression checks passed.')

assert.match(landingHeader, /max-w-\[85rem\]/)
assert.match(landingHeader, /hidden h-12[\s\S]*sm:block/)
