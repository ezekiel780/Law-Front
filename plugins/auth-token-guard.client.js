import { nodeTokenSecondsRemaining } from '~/services/auth/access'
import {
  NODE_TOKEN_PROACTIVE_REFRESH_SECONDS,
  hasIdleSessionExpired,
} from '~/services/auth/session-policy'

let refreshPromise = null
let expirationPromise = null

const laravelApiBaseUrl = () =>
  (
    process.env.LARAVEL_API_BASE_URL ||
    process.env.NUXT_ENV_LARAVEL_API_BASE_URL ||
    ''
  ).replace(/\/+$/, '')

const authorizationValue = (headers = {}) => {
  if (!headers) return ''
  if (typeof headers.get === 'function') {
    return String(headers.get('Authorization') || headers.get('authorization') || '')
  }
  return String(headers.Authorization || headers.authorization || '')
}

const bearerToken = (headers = {}) => {
  const match = authorizationValue(headers).trim().match(/^Bearer\s+(.+)$/i)
  return match ? match[1].trim() : ''
}

const setBearerToken = (config, token) => {
  config.headers = config.headers || {}
  if (typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`)
  } else {
    config.headers.Authorization = `Bearer ${token}`
  }
}

const isLaravelRequest = (config, store) => {
  const requestToken = bearerToken(config?.headers)
  const laravelToken = String(store.getters['user/getLaravelToken'] || '')
  if (requestToken && laravelToken && requestToken === laravelToken) return true

  const url = String(config?.url || '')
  const base = laravelApiBaseUrl()
  return Boolean(base && /^https?:\/\//i.test(url) && url.startsWith(base))
}

const isNodeAuthenticatedRequest = (config, store) => {
  if (isLaravelRequest(config, store)) return false

  // Protected Node routes are relative /auth/* URLs. Prefer the route shape
  // over token equality because several in-flight requests can still carry the
  // previous JWT immediately after another request refreshes the shared token.
  if (String(config?.url || '').startsWith('/auth/')) return true

  const requestToken = bearerToken(config?.headers)
  const nodeToken = String(store.getters['user/getToken'] || '')
  return Boolean(requestToken && nodeToken && requestToken === nodeToken)
}


const responseStatus = (error) =>
  Number(error?.response?.status || error?.statusCode || 0)

const refreshedTokenFrom = (response) =>
  response?.data?.data?.node_token ||
  response?.data?.node_token ||
  response?.data?.success?.access_token ||
  response?.data?.success?.user_token ||
  null

export default ({ $axios, $api, $user, store }) => {
  const expireSession = async () => {
    if (expirationPromise) return expirationPromise

    expirationPromise = (async () => {
      if (!$user.getIsLoggedIn()) return
      await $user.logout({
        force: true,
        broadcast: true,
        revoke: false,
        redirectTo: $user.getIsInstitutionalSession() ? '/' : '/auth/login',
      })
    })().finally(() => {
      expirationPromise = null
    })

    return expirationPromise
  }

  const idleSessionExpired = () => {
    if (!$user.getIsLoggedIn() || $user.getIsInstitutionalSession()) return false
    return hasIdleSessionExpired(store.getters['app/getLastLoginTime'])
  }

  const refreshNodeTokenOnce = async () => {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      let response

      if ($user.getIsInstitutionalSession()) {
        response = await $api.auth.ipLogin()
      } else {
        if (!$user.getLaravelToken()) {
          throw new Error('The authenticated account session has expired.')
        }
        response = await $api.auth.refreshNodeToken()
      }

      const token = refreshedTokenFrom(response)
      if (!token) throw new Error('A refreshed access token was not returned.')

      await $user.setToken(token)
      return token
    })().finally(() => {
      refreshPromise = null
    })

    return refreshPromise
  }

  $axios.onRequest(async (config) => {
    if (!$user.getIsLoggedIn()) return config

    if (idleSessionExpired()) {
      await expireSession()
      const error = new Error('Your session has expired. Please sign in again.')
      error.code = 'NWLR_SESSION_EXPIRED'
      throw error
    }

    if (!isNodeAuthenticatedRequest(config, store)) return config

    const currentToken = $user.getToken()
    if (
      currentToken &&
      nodeTokenSecondsRemaining(currentToken) >
        NODE_TOKEN_PROACTIVE_REFRESH_SECONDS
    ) {
      return config
    }

    try {
      const refreshedToken = await refreshNodeTokenOnce()
      setBearerToken(config, refreshedToken)
    } catch (error) {
      // A content-token refresh can legitimately be forbidden while the
      // primary Laravel account session remains valid (for example, an IP
      // subscription administrator working outside the institutional range).
      // Only an invalid/missing primary session should log the account out.
      if (!$user.getLaravelToken() || responseStatus(error) === 401) {
        await expireSession()
      }
      throw error
    }

    return config
  })

  $axios.onError(async (error) => {
    if (Number(error?.response?.status || 0) !== 401 || !$user.getIsLoggedIn()) {
      return Promise.reject(error)
    }

    const config = error?.config || {}

    // The Laravel Sanctum token is the primary customer session. There is no
    // refresh-token endpoint for it; a 401 from Laravel means the session is
    // no longer valid and must be cleared instead of repeatedly retrying it.
    if (isLaravelRequest(config, store)) {
      await expireSession()
      return Promise.reject(error)
    }

    // Node JWTs are deliberately short-lived and can be renewed from the
    // still-valid Laravel session. Retry the failed request exactly once.
    if (isNodeAuthenticatedRequest(config, store) && !config._nwlrAuthRetry) {
      try {
        const refreshedToken = await refreshNodeTokenOnce()
        config._nwlrAuthRetry = true
        setBearerToken(config, refreshedToken)
        return $axios.request(config)
      } catch (refreshError) {
        if (!$user.getLaravelToken() || responseStatus(refreshError) === 401) {
          await expireSession()
        }
        return Promise.reject(refreshError)
      }
    }

    await expireSession()
    return Promise.reject(error)
  })
}
