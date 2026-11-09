import {
  hasCapabilities,
  hasEntitlementProducts,
  hasRequiredAccess,
  nodeTokenSecondsRemaining,
  normalizeAccess,
} from '~/services/auth/access'
import {
  clearLatestSessionEvent,
  publishLogout,
} from '~/services/auth/session-sync'

const ACCESS_CACHE_MS = 60 * 1000
const NODE_TOKEN_REFRESH_THRESHOLD_SECONDS = 30 * 60

export default (store, redirect, api) => ({
  setToken: (token) => store.dispatch('user/LoginToken', token),
  setLaravelToken: (token) => store.dispatch('user/LoginLaravelToken', token),
  setIsLoggedIn: async (isLoggedIn) => {
    await store.dispatch('user/LoginStatus', isLoggedIn)
    if (isLoggedIn) clearLatestSessionEvent()
  },
  setFirstName: (firstname) =>
    store.dispatch('user/UpdateFirstName', firstname),
  setLastName: (lastname) => store.dispatch('user/UpdateLastName', lastname),
  setAvatar: (avatar) => store.dispatch('user/UpdateAvatar', avatar),
  setIsSubscribed: (isSubscribed) =>
    store.dispatch('user/UpdateIsSubscribed', isSubscribed),
  setSubscriptionId: (subscriptionId) =>
    store.dispatch('user/UpdateSubscriptionId', subscriptionId),
  setIsParent: (isParent) => store.dispatch('user/UpdateIsParent', isParent),
  setIsIpUser: (isIpUser) => store.dispatch('user/UpdateIsIpUser', isIpUser),
  setSessionMode: (sessionMode) =>
    store.dispatch('user/UpdateSessionMode', sessionMode),
  setRequiresPasswordChange: (requiresPasswordChange) =>
    store.dispatch(
      'user/UpdateRequiresPasswordChange',
      Boolean(requiresPasswordChange)
    ),
  setAutoDebit: (autoDebit) =>
    store.dispatch('user/UpdateAutoDebit', autoDebit),
  setAccess: (access) =>
    store.dispatch('user/UpdateAccess', normalizeAccess(access)),
  getToken: () => store.getters['user/getToken'],
  getLaravelToken: () => store.getters['user/getLaravelToken'],
  getIsLoggedIn: () => store.getters['user/getIsLoggedIn'],
  getFirstName: () => store.getters['user/getFirstName'],
  getLastName: () => store.getters['user/getLastName'],
  getAvatar: () => store.getters['user/getAvatar'],
  getIsSubscribed: () => store.getters['user/getIsSubscribed'],
  getSubscriptionId: () => store.getters['user/getSubscriptionId'],
  getPremium: () => store.getters['user/getPremium'],
  getIsParent: () => store.getters['user/getIsParent'],
  getIsIpUser: () => store.getters['user/getIsIpUser'],
  getSessionMode: () => store.getters['user/getSessionMode'],
  getIsInstitutionalSession: () =>
    store.getters['user/getSessionMode'] === 'institutional_reader',
  getRequiresPasswordChange: () =>
    Boolean(store.getters['user/getRequiresPasswordChange']),
  getAutoDebit: () => store.getters['user/getAutoDebit'],
  getAccess: () => normalizeAccess(store.getters['user/getAccess']),
  getAccessLoadedAt: () =>
    Number(store.getters['user/getAccessLoadedAt'] || 0),
  hasAccess: (products = [], features = []) =>
    hasRequiredAccess(
      store.getters['user/getAccess'],
      products,
      features
    ),
  can: (...capabilities) =>
    hasCapabilities(
      store.getters['user/getAccess'],
      capabilities.flat().filter(Boolean)
    ),
  hasEntitlementProduct: (...products) =>
    hasEntitlementProducts(
      store.getters['user/getAccess'],
      products.flat().filter(Boolean)
    ),
  setAccessFromProfile: (profile = {}) => {
    const access = profile.access || {
      products: profile.active_products || [],
      features: profile.active_features || [],
      capabilities:
        profile.active_capabilities || profile.active_features || [],
      entitlements: profile.active_entitlements || [],
      active_subscription: profile.subscription?.subscription_status
        ? {
            id: profile.subscription.subscription_id,
            title: profile.subscription.plan,
            starts_at: profile.subscription.start_date,
            ends_at: profile.subscription.expiry_date,
            category: profile.subscription.category,
            primary: profile.subscription.primary,
          }
        : null,
    }

    return store.dispatch('user/UpdateAccess', normalizeAccess(access))
  },
  refreshAccess: async ({ force = false, maxAgeMs = ACCESS_CACHE_MS } = {}) => {
    const loadedAt = Number(store.getters['user/getAccessLoadedAt'] || 0)
    if (!force && loadedAt && Date.now() - loadedAt < maxAgeMs) {
      return normalizeAccess(store.getters['user/getAccess'])
    }

    const token = store.getters['user/getToken']
    if (!token) {
      const empty = normalizeAccess()
      await store.dispatch('user/UpdateAccess', empty)
      return empty
    }

    const response = await api.auth.access(token)
    const access = normalizeAccess(
      response?.data?.data || response?.data?.success?.data || {}
    )
    await store.dispatch('user/UpdateAccess', access)
    return access
  },
  recoverNodeSession: async () => {
    let response
    if (store.getters['user/getSessionMode'] === 'institutional_reader') {
      response = await api.auth.ipLogin()
    } else {
      if (!store.getters['user/getLaravelToken']) {
        throw new Error('The authenticated Laravel session is unavailable.')
      }
      response = await api.auth.refreshNodeToken()
    }

    const refreshedToken =
      response?.data?.data?.node_token ||
      response?.data?.node_token ||
      response?.data?.success?.access_token ||
      response?.data?.success?.user_token

    if (!refreshedToken) {
      throw new Error('A refreshed access token was not returned.')
    }

    await store.dispatch('user/LoginToken', refreshedToken)

    const accessResponse = await api.auth.access(refreshedToken)
    await store.dispatch(
      'user/UpdateAccess',
      normalizeAccess(
        accessResponse?.data?.data ||
          accessResponse?.data?.success?.data ||
          {}
      )
    )

    return refreshedToken
  },
  ensureNodeToken: async ({
    minimumValiditySeconds = NODE_TOKEN_REFRESH_THRESHOLD_SECONDS,
  } = {}) => {
    const currentToken = store.getters['user/getToken']
    if (
      currentToken &&
      nodeTokenSecondsRemaining(currentToken) > minimumValiditySeconds
    ) {
      return currentToken
    }

    let response
    if (store.getters['user/getSessionMode'] === 'institutional_reader') {
      response = await api.auth.ipLogin()
    } else {
      if (!store.getters['user/getLaravelToken']) {
        throw new Error('The authenticated Laravel session is unavailable.')
      }
      response = await api.auth.refreshNodeToken()
    }

    const refreshedToken =
      response?.data?.data?.node_token ||
      response?.data?.node_token ||
      response?.data?.success?.access_token ||
      response?.data?.success?.user_token

    if (!refreshedToken) {
      throw new Error('A refreshed access token was not returned.')
    }

    await store.dispatch('user/LoginToken', refreshedToken)

    try {
      const accessResponse = await api.auth.access(refreshedToken)
      await store.dispatch(
        'user/UpdateAccess',
        normalizeAccess(
          accessResponse?.data?.data ||
            accessResponse?.data?.success?.data ||
            {}
        )
      )
    } catch (error) {
      // Token renewal succeeded. The next protected request will retry access
      // synchronization; do not discard a valid session because of a transient
      // entitlement-service failure.
    }

    return refreshedToken
  },
  logout: async ({ force = false, broadcast = true, revoke = true, redirectTo = '/auth/login' } = {}) => {
    const institutionalSession =
      store.getters['user/getSessionMode'] === 'institutional_reader'

    const nodeToken = store.getters['user/getToken']
    const laravelToken = store.getters['user/getLaravelToken']

    // Anonymous institutional sessions are recreated automatically by network
    // detection and therefore have no explicit logout. Credential-based IP
    // accounts keep a Laravel token and can log out normally.
    if (institutionalSession && !force) {
      return false
    }

    if (broadcast) {
      publishLogout()
    }

    try {
      if (revoke && api?.auth?.logout) {
        await api.auth.logout({ nodeToken, laravelToken })
      }
    } finally {
      await store.dispatch('user/ResetState')
      await store.dispatch('app/UpdateLastLoginTime', null)
      redirect(redirectTo)
    }

    return true
  },
})
