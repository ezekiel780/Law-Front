const assert = require('assert')
const fs = require('fs')
const vm = require('vm')
const path = require('path')
const source = fs.readFileSync(path.join(__dirname, '../utils/form-submission.js'), 'utf8').replace(/export /g, '')
const scope = { setTimeout, Promise }
vm.runInNewContext(source + '\nthis.api = { submitForm, trackFormWrite }', scope)
async function test() {
  const { submitForm, trackFormWrite } = scope.api
  let finish
  let calls = 0
  const write = new Promise(resolve => { finish = resolve })
  const first = submitForm(() => { calls++; return trackFormWrite(write) })
  assert.strictEqual(await submitForm(() => { calls++ }), false)
  assert.strictEqual(calls, 1)
  finish()
  assert.strictEqual(await first, true)
  assert.strictEqual(await submitForm(async () => { try { await trackFormWrite(Promise.reject(new Error('Invalid input'))) } catch {} }), false)
  assert.strictEqual(await submitForm(() => trackFormWrite(Promise.resolve('saved'))), true)
  assert.strictEqual(await submitForm(() => Promise.resolve('search result')), false)
  console.log('Submission locking, failure recovery, explicit resubmission, and read-only filtering checks passed.')
}
test().catch(error => { console.error(error); process.exitCode = 1 })
