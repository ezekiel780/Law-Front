const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const source = fs.readFileSync(
  path.join(root, 'services/errors/Errors.js'),
  'utf8'
)

assert.match(source, /errors\.error/)
assert.match(source, /apiError && apiError\.message/)
assert.match(source, /apiError\.details\.errors/)

console.log('API error envelope regression checks passed')
