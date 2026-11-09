const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const nuxtConfig = fs.readFileSync(path.join(root, 'nuxt.config.js'), 'utf8')

const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
)

assert.match(
  packageJson.scripts.test || '',
  /clean:legacy-runtime[\s\S]*run-regression-tests\.js/,
  'The test command must clean stale runtime files and run the consolidated regression runner'
)
assert.match(
  packageJson.scripts['validate:deploy'] || '',
  /clean:legacy-runtime[\s\S]*run-regression-tests\.js[\s\S]*nuxt build/,
  'Deployment validation must clean once, run all tests, and build the application'
)
assert.match(
  packageJson.scripts.deploy || '',
  /git pull --ff-only[\s\S]*npm install[\s\S]*validate:deploy[\s\S]*pm2 restart nwlr-front/,
  'One deploy command must install, validate, build, and restart the application'
)
assert.match(
  packageJson.scripts.build || '',
  /clean:legacy-runtime/,
  'The build command must explicitly clean stale runtime files'
)
assert.match(
  packageJson.scripts.generate || '',
  /clean:legacy-runtime/,
  'The generate command must explicitly clean stale runtime files'
)
assert.match(
  packageJson.scripts.dev || '',
  /clean:legacy-runtime/,
  'The development command must explicitly clean stale runtime files'
)
assert.equal(
  fs.existsSync(path.join(root, 'scripts', 'run-regression-tests.js')),
  true,
  'The consolidated regression runner must be shipped'
)
assert.equal(
  fs.existsSync(path.join(root, 'scripts', 'remove-legacy-runtime.js')),
  true,
  'The legacy runtime cleanup script must be shipped'
)

assert.match(
  nuxtConfig,
  /router:\s*\{[\s\S]*prefetchLinks:\s*false/,
  'Nuxt route prefetching must remain disabled to avoid speculative chunk bursts'
)

assert.match(
  nuxtConfig,
  /pwa:\s*\{[\s\S]*workbox:\s*false/,
  'Workbox must remain disabled until the deployment has a safe cache lifecycle'
)

assert.match(
  nuxtConfig,
  /service-worker-cleanup\.client\.js/,
  'The one-time legacy service-worker cleanup plugin must remain registered'
)

assert.match(
  nuxtConfig,
  /chunk-load-recovery\.client\.js/,
  'Chunk-load failures must retain one bounded recovery attempt'
)

assert.doesNotMatch(
  nuxtConfig,
  /pdf\.min\.mjs|pdf_viewer\.min\.css/,
  'PDF.js must not be injected globally when the native PDF viewer is used'
)

assert.doesNotMatch(
  nuxtConfig,
  /gtag-init|innerHTML\s*:/,
  'Google Analytics must be loaded only by @nuxtjs/google-gtag'
)

const staleServiceWorker = path.join(root, 'static', 'sw.js')
fs.writeFileSync(staleServiceWorker, '/* stale overlay service worker */\n')
execFileSync(process.execPath, [path.join(root, 'scripts', 'remove-legacy-runtime.js')], {
  cwd: root,
  stdio: 'pipe',
})
assert.equal(
  fs.existsSync(staleServiceWorker),
  false,
  'The cleanup script must remove a stale service worker left by an overlay deployment'
)

console.log('Frontend configuration regression checks passed.')
