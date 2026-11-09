const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const nuxt = read('nuxt.config.js')
const plugin = read('plugins/zendesk.client.js')
const help = read('pages/dashboard/help.vue')

assert.match(nuxt, /ZENDESK_WIDGET_KEY/, 'Zendesk widget key must be environment-configurable')
assert.match(nuxt, /static\.zdassets\.com\/ekr\/snippet\.js/, 'Customer frontend must load the Zendesk Web Widget snippet')
assert.match(nuxt, /zendesk\.client\.js/, 'Zendesk client integration must load on the customer frontend')
assert.match(plugin, /webWidget', 'identify'/, 'Authenticated customer identity must be handed to Zendesk')
assert.match(plugin, /webWidget', 'prefill'/, 'Zendesk contact details must be prefilled from the signed-in customer')
assert.match(plugin, /webWidget', 'open'/, 'The frontend must be able to open the same Zendesk Help widget explicitly')
assert.match(help, /openCustomerService/, 'The Help page must expose an explicit Customer Service fallback')

console.log('Zendesk Help integration regression checks passed.')
