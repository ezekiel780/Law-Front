const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8')

const publicPage = read('pages/dictionary-hardcopy.vue')
const dictionaryLayout = read('layouts/dictionary-hardcopy.vue')
const landingHeader = read('components/landing/base/header.vue')
const landingFooter = read('components/landing/base/footer.vue')
const dashboardSidebar = read('components/dashboard/base/sidebar.vue')
const paymentModal = read('components/landing/book/payment-modal.vue')
const orderApi = read('api/Order.js')

assert.match(
  publicPage,
  /layout:\s*['"]dictionary-hardcopy['"]/,
  'Dictionary hardcopy ordering must use its hybrid public/dashboard layout'
)
assert.doesNotMatch(
  publicPage,
  /layout:\s*['"]dashboard['"]/,
  'Dictionary hardcopy ordering must not require the authenticated dashboard layout'
)
assert.match(
  dictionaryLayout,
  /<dashboard-base-sidebar\s*\/>/,
  'Signed-in dictionary hardcopy users must retain the dashboard sidebar'
)
assert.match(
  dictionaryLayout,
  /v-else[\s\S]*<landing-base-header\s*\/>[\s\S]*<landing-base-footer\s*\/>/,
  'Signed-out visitors must retain the public landing header/footer and public access'
)
assert.doesNotMatch(
  dictionaryLayout,
  /middleware:\s*['"]auth\.middleware['"]/,
  'The dictionary hardcopy layout must remain publicly accessible'
)
assert.match(
  landingHeader,
  /to="\/dictionary-hardcopy"[\s\S]*Dictionary \(Hardcopy\)/,
  'The public header must expose the dictionary hardcopy ordering page'
)
assert.match(
  landingFooter,
  /to="\/dictionary-hardcopy"[\s\S]*Dictionary \(Hardcopy\)/,
  'The public footer must expose the dictionary hardcopy ordering page'
)
assert.match(
  dashboardSidebar,
  /to="\/dictionary-hardcopy"/,
  'Signed-in customers must still be able to open the public hardcopy ordering page'
)
assert.match(
  paymentModal,
  /\/dictionary-hardcopy`/,
  'Payment callbacks must return customers to the public dictionary hardcopy page'
)
assert.match(
  orderApi,
  /\/pre-orders/,
  'The public dictionary order form must submit to the preorder endpoint'
)

console.log('Dictionary hardcopy public-route regression checks passed.')
