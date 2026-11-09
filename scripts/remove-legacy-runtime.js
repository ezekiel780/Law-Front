const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const staleFiles = [
  path.join(root, 'static', 'sw.js'),
  path.join(root, 'dist', 'sw.js'),
  path.join(root, 'plugins', 'jwtencode.js'),
  path.join(root, 'plugins', 'encode-api.js'),
  path.join(root, 'plugins', 'encodeApi.js'),
]

for (const file of staleFiles) {
  if (!fs.existsSync(file)) continue
  fs.rmSync(file, { force: true })
  console.log(`Removed legacy runtime file: ${path.relative(root, file)}`)
}
