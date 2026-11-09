import Vue from 'vue'
import SubmissionForm from '~/components/SubmissionForm.vue'
import { trackFormWrite } from '~/utils/form-submission.js'
Vue.component('SubmissionForm', SubmissionForm)
import Request from '~/api/MultipurposeRequest'
import Auth from '~/api/Auth'
import Account from '~/api/Account'
import Research from '~/api/Research'
import Subscription from '~/api/Subscription'
import Order from '~/api/Order'
import Dictionary from '~/api/Dictionary'

export default ({ $axios, store }, inject) => {
  if (process.client && !$axios.__formWritesTracked) {
    $axios.__formWritesTracked = true
    for (const method of ['post', 'put', 'patch', 'delete', '$post', '$put', '$patch', '$delete']) {
      if (typeof $axios[method] !== 'function') continue
      const original = $axios[method].bind($axios)
      $axios[method] = (...args) => trackFormWrite(original(...args))
    }
  }
  const factories = {
    make: Request($axios),
    auth: Auth($axios, store),
    account: Account($axios, store),
    research: Research($axios, store),
    subscription: Subscription($axios, store),
    order: Order($axios, store),
    dictionary: Dictionary($axios, store),
  }

  inject('api', factories)
}
