let ipAuthPromise = null

const payloadFrom = (response) =>
  response?.data?.data || response?.data?.success || {}

const authenticateByNetwork = async ($api, $user) => {
  if ($user.getIsLoggedIn()) return false

  const response = await $api.auth.ipLogin()
  const payload = payloadFrom(response)
  const token =
    payload.node_token || payload.access_token || payload.user_token || null
  const sessionMode =
    payload.session?.mode || payload.user?.session_mode || null
  const authenticated =
    payload.authenticated === true || Boolean(payload.ipuser && token)

  if (!authenticated || !token || sessionMode !== 'institutional_reader') {
    return false
  }

  await $user.setToken(token)
  await $user.setLaravelToken(null)
  await $user.setIsIpUser(true)
  await $user.setSessionMode('institutional_reader')
  await $user.setIsLoggedIn(true)
  await $user.setFirstName(payload.user?.firstname || 'Institutional')
  await $user.setLastName(payload.user?.lastname || 'Reader')
  await $user.setAvatar(null)
  await $user.refreshAccess({ force: true })

  return true
}

export default ({ app, $api, $user, route }) => {
  const probe = async () => {
    const currentPath = String(app.router.currentRoute?.path || route?.path || '')

    if ($user.getIsLoggedIn()) {
      // A real account session does not belong on an authentication screen. An
      // institutional reader is allowed to remain there so the organisation's
      // administrator can still sign in with credentials from the same network.
      if (currentPath.includes('/auth/') && !$user.getIsInstitutionalSession()) {
        await app.router.replace('/dashboard')
      }
      return
    }

    if (!ipAuthPromise) {
      ipAuthPromise = authenticateByNetwork($api, $user)
        .catch(() => false)
        .finally(() => {
          ipAuthPromise = null
        })
    }

    await ipAuthPromise
  }

  const afterHydration = () => {
    // The second animation frame guarantees the initial Vue hydration/patch has
    // completed before authentication changes any render-dependent store state.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        void probe()
      })
    })
  }

  if (document.readyState === 'complete') {
    window.setTimeout(afterHydration, 0)
  } else {
    window.addEventListener('load', afterHydration, { once: true })
  }
}
