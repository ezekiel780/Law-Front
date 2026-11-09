const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const paymentModal = read('components/dashboard/subscription/payment-modal.vue')
const paymentVisual = read('components/utils/payment-method-visual.vue')
const svgLoader = read('components/utils/svg-loader.vue')

assert.doesNotMatch(
  paymentModal,
  /:icon="method\.title\.toLowerCase\(\)"/,
  'Payment method titles must never be converted directly into asset filenames'
)
assert.match(
  paymentModal,
  /<utils-payment-method-visual\s+:method="method"/,
  'The payment modal must use the safe payment-method visual'
)
assert.match(paymentVisual, /@error="handleError"/)
assert.match(paymentVisual, /payment-method-visual__title/)
assert.match(paymentVisual, /this\.method\.image/)
assert.match(paymentVisual, /this\.method\.logo_url/)
assert.match(paymentVisual, /this\.method\.gateway_code/)
assert.match(paymentVisual, /BUILTIN_PAYMENT_LOGOS/)
assert.match(paymentVisual, /paystack\.svg/)
assert.match(paymentVisual, /flutterwave\.svg/)
assert.match(paymentVisual, /interswitch\.svg/)
assert.doesNotMatch(
  svgLoader,
  /catch \(error\) \{[\s\S]*require\(`/,
  'The SVG loader must not require the same missing module again inside its catch block'
)
assert.match(svgLoader, /this\.\$emit\('missing'/)

console.log('Payment-method icon fallback checks passed.')
