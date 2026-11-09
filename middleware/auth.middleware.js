import {
  NCLD_SEARCH_CAPABILITIES,
  capabilityForDictionaryType,
} from '~/services/auth/ncld-access'

const emptyRequirement = () => ({
  capabilities: [],
  anyCapabilities: [],
})

const protectedAccessForRoute = (route = {}) => {
  const path = route.path || ''

  if (path.includes('/dashboard/my-research')) {
    return {
      capabilities: ['LEGAL_RESEARCH', 'CASE_ACCESS'],
      anyCapabilities: [],
    }
  }

  if (/\/dashboard\/legal-research\/[^/]+/.test(path)) {
    return { capabilities: ['CASE_ACCESS'], anyCapabilities: [] }
  }

  if (path.includes('/dashboard/legal-research')) {
    return { capabilities: ['LEGAL_RESEARCH'], anyCapabilities: [] }
  }

  if (path.includes('/dashboard/legal-dictionary')) {
    const requestedType = route.params?.type || route.query?.type
    const requiredCapability = capabilityForDictionaryType(requestedType)

    if (requiredCapability) {
      return { capabilities: [requiredCapability], anyCapabilities: [] }
    }

    if (path.includes('/results')) {
      return {
        capabilities: ['DICTIONARY_SEARCH'],
        anyCapabilities: [],
      }
    }

    return {
      capabilities: [],
      anyCapabilities: [...NCLD_SEARCH_CAPABILITIES],
    }
  }

  return emptyRequirement()
}

const statusCode = (error) =>
  Number(error?.response?.status || error?.statusCode || 0)

export default async ({ $user, route, redirect, res }) => {
  const status = $user.getIsLoggedIn()
  const isInstitutionalSession = $user.getIsInstitutionalSession()
  const isIpUser = $user.getIsIpUser()
  const requiresPasswordChange = $user.getRequiresPasswordChange()
  const isSubscribed = $user.getIsSubscribed()
  const path = route.path || ''
  const passwordChangePath = '/dashboard/password-change-required'
  let redirectPath = null

  if (
    status &&
    !isInstitutionalSession &&
    requiresPasswordChange &&
    path !== passwordChangePath
  ) {
    redirectPath = passwordChangePath
  } else if (path.includes('/my-subscription') && !status) {
    redirectPath = '/auth/register-step-1'
  } else if (path.includes('/dashboard') && !status) {
    redirectPath = '/auth/login'
  } else if (
    status &&
    isInstitutionalSession &&
    (path.includes('/my-account') ||
      path.includes('/dashboard/my-research') ||
      path.includes('/dashboard/my-subscription') ||
      path.includes('/dashboard/password-change-required'))
  ) {
    redirectPath = '/dashboard'
  } else if (
    status &&
    isIpUser &&
    path.includes('/my-account')
  ) {
    redirectPath = '/dashboard'
  }

  if (redirectPath) {
    if (path === redirectPath || (res && res.headersSent)) return
    return redirect(redirectPath)
  }

  const required = protectedAccessForRoute(route)
  const hasProtectedRequirement =
    required.capabilities.length > 0 || required.anyCapabilities.length > 0

  if (status && hasProtectedRequirement) {
    try {
      await $user.ensureNodeToken()
      await $user.refreshAccess({ force: true, maxAgeMs: 30 * 1000 })
    } catch (error) {
      if (statusCode(error) === 401) {
        try {
          // A stale Node JWT can be renewed from the still-valid primary
          // Laravel session. Recover it once before treating the login as
          // expired.
          await $user.recoverNodeSession()
        } catch (recoveryError) {
          await $user.logout({ force: true, revoke: false })
          if (res && res.headersSent) return
          return redirect('/auth/login')
        }
      }
      // A recent persisted access decision may still be used for client-side
      // routing for transient non-authentication failures. The Node API remains
      // authoritative and fails closed.
    }

    // A new browser tab is rendered first on the Nuxt server. The compact
    // session cookie intentionally excludes tokens and the full entitlement
    // graph. If access has not yet been hydrated, allow the page shell to
    // render; the client restores the shared localStorage state and the Node
    // API remains the authoritative access boundary.
    if (process.server && !$user.getAccessLoadedAt()) return

    const missingCapability = required.capabilities.find(
      (capability) => !$user.can(capability)
    )
    const missingAnyCapability =
      required.anyCapabilities.length > 0 &&
      !required.anyCapabilities.some((capability) => $user.can(capability))
    const missingAccess =
      missingCapability ||
      (missingAnyCapability ? required.anyCapabilities[0] : null)

    if (missingAccess) {
      if (res && res.headersSent) return

      if (isInstitutionalSession) {
        return redirect('/dashboard')
      }

      if (isIpUser) {
        return redirect('/dashboard')
      }

      return redirect(
        `/dashboard/my-subscription?required=${encodeURIComponent(
          missingAccess
        )}`
      )
    }
  }

  if (status && path.includes('/statutes-and-rules') && !isSubscribed) {
    if (res && res.headersSent) return
    return redirect(
      isInstitutionalSession || isIpUser
        ? '/dashboard'
        : '/dashboard/my-subscription'
    )
  }
}
