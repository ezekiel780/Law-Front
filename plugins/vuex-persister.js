import Cookies from 'js-cookie'
import cookie from 'cookie'

const STATE_STORAGE_KEY = 'nwlr_app'
const SESSION_COOKIE_KEY = 'nwlr_session'
const LEGACY_COOKIE_KEY = 'nwlr_app'
const VALID_SESSION_MODES = new Set([
  'account',
  'ip_user_account',
  'ip_administrator',
  'institutional_reader',
])

const parseStoredValue = (value) => {
  let parsed = value

  // The legacy cookie adapter JSON-encoded an already JSON-encoded value.
  // Parse at most twice so existing sessions can be migrated safely.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (typeof parsed !== 'string' || parsed.trim() === '') break
    try {
      parsed = JSON.parse(parsed)
    } catch (error) {
      return null
    }
  }

  return parsed && typeof parsed === 'object' ? parsed : null
}

const extractUserState = (stored) => {
  const parsed = parseStoredValue(stored)
  if (!parsed) return null

  if (parsed.user && typeof parsed.user === 'object') {
    return parsed.user
  }

  return parsed
}

const compactAccess = (access = {}) => ({
  products: Array.isArray(access.products) ? access.products : [],
  features: Array.isArray(access.features) ? access.features : [],
  capabilities: Array.isArray(access.capabilities)
    ? access.capabilities
    : Array.isArray(access.features)
    ? access.features
    : [],
  // The complete entitlement graph and subscription snapshot remain in
  // localStorage. SSR needs only the compact authorization vocabulary.
  entitlements: [],
  active_subscription: null,
})

const compactSessionUser = (user = {}) => ({
  isLoggedIn: Boolean(user.isLoggedIn),
  isIpUser: Boolean(user.isIpUser),
  sessionMode: user.sessionMode || null,
  requiresPasswordChange: Boolean(user.requiresPasswordChange),
  isSubscribed: Boolean(user.isSubscribed),
  subscriptionId: user.subscriptionId || null,
  isParent: Boolean(user.isParent),
  canTimeOut: user.canTimeOut !== false,
  loginTime: Number(user.loginTime || 0),
  firstname: user.firstname || null,
  lastname: user.lastname || null,
  avatar: user.avatar || null,
  access: compactAccess(user.access),
  accessLoadedAt: Number(user.accessLoadedAt || 0),
})

const cookieOptions = () => ({
  expires: 365,
  path: '/',
  sameSite: 'lax',
  secure: process.client && window.location.protocol === 'https:',
})

const restoreUser = (store, user) => {
  if (!user || typeof user !== 'object') return false

  // Session type is part of the rendering contract. Never infer it from the
  // presence or absence of a secret token because the SSR cookie intentionally
  // excludes tokens. Discard pre-contract sessions so server and browser start
  // from the same state after deployment.
  if (user.isLoggedIn && !VALID_SESSION_MODES.has(user.sessionMode)) {
    return false
  }

  store.commit('user/restoreUser', user)
  return true
}

export default ({ store, req }) => {
  if (process.server) {
    const parsedCookies = cookie.parse(req?.headers?.cookie || '')
    const compactSession = extractUserState(parsedCookies[SESSION_COOKIE_KEY])
    const legacySession = extractUserState(parsedCookies[LEGACY_COOKIE_KEY])

    restoreUser(store, compactSession || legacySession)
    return
  }

  let restoredUser = null

  try {
    restoredUser = extractUserState(
      window.localStorage.getItem(STATE_STORAGE_KEY)
    )
  } catch (error) {
    restoredUser = null
  }

  // Migrate a valid legacy cookie once. Oversized legacy cookies may already
  // have been rejected by the browser, in which case the next login creates
  // the new compact persistence format.
  if (!restoredUser) {
    restoredUser = extractUserState(Cookies.get(LEGACY_COOKIE_KEY))
  }

  restoreUser(store, restoredUser)

  const persist = () => {
    const user = store.state.user || {}

    if (!user.isLoggedIn) {
      try {
        window.localStorage.removeItem(STATE_STORAGE_KEY)
      } catch (error) {}
      Cookies.remove(SESSION_COOKIE_KEY, { path: '/' })
      Cookies.remove(LEGACY_COOKIE_KEY, { path: '/' })
      return
    }

    try {
      window.localStorage.setItem(
        STATE_STORAGE_KEY,
        JSON.stringify({ user })
      )
    } catch (error) {
      // Keep the compact SSR cookie available even when localStorage is
      // temporarily unavailable. Protected APIs remain authoritative.
    }

    Cookies.set(
      SESSION_COOKIE_KEY,
      JSON.stringify({ user: compactSessionUser(user) }),
      cookieOptions()
    )
    Cookies.remove(LEGACY_COOKIE_KEY, { path: '/' })
  }

  persist()

  store.subscribe((mutation) => {
    if (mutation.type.startsWith('user/')) persist()
  })
}
