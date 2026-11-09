const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const fallback = read('components/utils/image-fallback.vue')
const header = read('components/dashboard/base/header.vue')
const profile = read('components/dashboard/my-account/profile.vue')
const paymentMethods = read('components/landing/home/payment-methods-modal.vue')
const bookHero = read('components/landing/book/hero-section.vue')

assert.match(
  fallback,
  /@error="handleError"/,
  'Image fallback must handle broken image URLs, not only empty sources'
)
assert.match(
  fallback,
  /fallbackTitle/,
  'Image fallback must render meaningful text when an image is unavailable'
)
assert.match(
  header,
  /<utils-image-fallback[\s\S]*variant="avatar"/,
  'Dashboard avatar must show branded initials when no image is available'
)
assert.match(
  profile,
  /<utils-image-fallback[\s\S]*profileInitials/,
  'My Account must show the user initials when no profile image is available'
)
assert.match(
  paymentMethods,
  /<utils-image-fallback[\s\S]*method\.title/,
  'Payment methods must show their title when a logo is unavailable'
)
assert.match(
  bookHero,
  /fallback-title="Nigerian Case Law Dictionary"/,
  'The book display must show product text when its image is unavailable'
)
assert.doesNotMatch(
  bookHero,
  />No Image Available</,
  'Plain unstyled image fallback text must not return'
)

console.log('Image fallback regression checks passed.')
