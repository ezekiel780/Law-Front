export const normalizeCode = (value) =>
  String(value || '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .toUpperCase()

export const normalizeCodes = (values = []) =>
  Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map(normalizeCode)
        .filter(Boolean)
    )
  )

export const normalizeAccess = (access = {}) => {
  const features = normalizeCodes(access.features)
  const capabilities = normalizeCodes(
    Array.isArray(access.capabilities) ? access.capabilities : features
  )

  return {
    products: normalizeCodes(access.products),
    features,
    capabilities,
    entitlements: Array.isArray(access.entitlements)
      ? access.entitlements
      : [],
    active_subscription:
      access.active_subscription &&
      typeof access.active_subscription === 'object'
        ? access.active_subscription
        : null,
  }
}

export const hasRequiredAccess = (
  access,
  requiredProducts = [],
  requiredFeatures = [],
  requiredCapabilities = []
) => {
  const normalized = normalizeAccess(access)
  const products = new Set(normalized.products)
  const features = new Set(normalized.features)
  const capabilities = new Set(normalized.capabilities)

  return (
    normalizeCodes(requiredProducts).every((code) => products.has(code)) &&
    normalizeCodes(requiredFeatures).every((code) => features.has(code)) &&
    normalizeCodes(requiredCapabilities).every((code) =>
      capabilities.has(code)
    )
  )
}

export const hasCapabilities = (access, requiredCapabilities = []) =>
  hasRequiredAccess(access, [], [], requiredCapabilities)

export const entitlementProductCodes = (access = {}) =>
  normalizeCodes(
    normalizeAccess(access).entitlements.map(
      (entitlement) => entitlement?.product?.code
    )
  )

export const hasEntitlementProducts = (
  access,
  requiredProducts = []
) => {
  const products = new Set(entitlementProductCodes(access))
  return normalizeCodes(requiredProducts).every((code) => products.has(code))
}

const decodeBase64Url = (value) => {
  const normalized = String(value || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return decodeURIComponent(
      window
        .atob(padded)
        .split('')
        .map((character) =>
          `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`
        )
        .join('')
    )
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8')
  }

  throw new Error('Base64 decoding is unavailable')
}

export const decodeNodeTokenPayload = (token) => {
  try {
    const parts = String(token || '').split('.')
    if (parts.length !== 3) return null
    return JSON.parse(decodeBase64Url(parts[1]))
  } catch (error) {
    return null
  }
}

export const nodeTokenIssuedAtMs = (token) => {
  const payload = decodeNodeTokenPayload(token)
  const issuedAt = Number(payload?.iat || 0)
  return issuedAt > 0 ? issuedAt * 1000 : 0
}

export const nodeTokenSecondsRemaining = (token, now = Date.now()) => {
  const payload = decodeNodeTokenPayload(token)
  const expiresAt = Number(payload?.exp || 0)
  if (!expiresAt) return 0
  return Math.floor(expiresAt - now / 1000)
}
