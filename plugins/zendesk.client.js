const getZendesk = () =>
  process.client && typeof window.zE === 'function' ? window.zE : null

const userIdentity = (store) => {
  if (!store || !store.getters['user/getIsLoggedIn']) return null
  if (store.getters['user/getIsIpUser']) return null

  const user = store.getters['user/getUser'] || {}
  const firstname = store.getters['user/getFirstName'] || user.firstname || ''
  const lastname = store.getters['user/getLastName'] || user.lastname || ''
  const name = `${firstname} ${lastname}`.trim() || user.name || ''
  const email = user.email || ''

  if (!email) return null
  return { name: name || email, email }
}

const applyIdentity = (store) => {
  const zE = getZendesk()
  const identity = userIdentity(store)
  if (!zE || !identity) return false

  // These are Zendesk Web Widget (Classic) APIs. The snippet owns ticket
  // submission directly; identity/prefill only makes the customer hand-off
  // to Customer Service unambiguous and reduces mistyped email addresses.
  zE('webWidget', 'identify', identity)
  zE('webWidget', 'prefill', {
    name: { value: identity.name, readOnly: false },
    email: { value: identity.email, readOnly: false },
  })
  return true
}

export default ({ store }, inject) => {
  const api = {
    isReady: () => Boolean(getZendesk()),
    open: () => {
      const zE = getZendesk()
      if (!zE) return false
      applyIdentity(store)
      zE('webWidget', 'open')
      return true
    },
    close: () => {
      const zE = getZendesk()
      if (!zE) return false
      zE('webWidget', 'close')
      return true
    },
    refreshIdentity: () => applyIdentity(store),
  }

  inject('zendesk', api)

  let attempts = 0
  const timer = window.setInterval(() => {
    attempts += 1
    if (getZendesk()) {
      applyIdentity(store)
      window.clearInterval(timer)
    } else if (attempts >= 80) {
      window.clearInterval(timer)
    }
  }, 250)

  store.watch(
    () => ({
      loggedIn: store.getters['user/getIsLoggedIn'],
      user: store.getters['user/getUser'],
      firstname: store.getters['user/getFirstName'],
      lastname: store.getters['user/getLastName'],
    }),
    () => applyIdentity(store),
    { deep: true }
  )
}
