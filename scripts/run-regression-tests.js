const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const testDirectory = path.join(root, 'test')
const testFiles = fs
  .readdirSync(testDirectory)
  .filter((file) => file.endsWith('.test.js'))
  .sort()

if (testFiles.length === 0) {
  console.error('No regression test files were found.')
  process.exit(1)
}

console.log(`Running ${testFiles.length} frontend regression suites...`)

for (const [index, file] of testFiles.entries()) {
  console.log(`\n[${index + 1}/${testFiles.length}] ${file}`)
  const result = spawnSync(process.execPath, [path.join(testDirectory, file)], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  })

  if (result.error) {
    console.error(`Unable to run ${file}:`, result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    console.error(`Regression suite failed: ${file}`)
    process.exit(result.status || 1)
  }
}

console.log(`\nAll ${testFiles.length} frontend regression suites passed.`)
