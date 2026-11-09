const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const form = read('components/landing/auth/reset-password-form.vue')
const success = read('components/landing/auth/reset-password-success.vue')
const authApi = read('api/Auth.js')

assert.match(authApi, /\/auth\/forgot-password/)
assert.match(form, /data\.message/)
assert.match(form, /reset-request-accepted/)

assert.match(success, /Password Reset Requested/)
assert.match(success, /If an account matches this email/)
assert.match(success, /we’ll send a password reset link/)
assert.match(success, /inbox and spam or junk folder/)
assert.doesNotMatch(success, /email delivery is available/i)
assert.doesNotMatch(success, /try again later/i)
assert.doesNotMatch(success, /Password reset sent successfully/i)
assert.doesNotMatch(success, /Reset Successful/)

console.log('Password reset resilience regression checks passed.')
