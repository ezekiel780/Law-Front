const normalizeCode = (value) =>
  String(value || '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .toUpperCase()

export default ({ $axios, app, store }) => {
  $axios.onError((error) => {
    if (Number(error?.response?.status || 0) !== 403) {
      return Promise.reject(error)
    }

    const required = error?.response?.data?.required || {}
    const requiredCapabilities = Array.isArray(required.capabilities)
      ? required.capabilities.map(normalizeCode).filter(Boolean)
      : []
    const requiredEntitlementProducts = Array.isArray(
      required.entitlement_products
    )
      ? required.entitlement_products.map(normalizeCode).filter(Boolean)
      : []
    const missingAccess =
      requiredCapabilities[0] || requiredEntitlementProducts[0]

    if (!missingAccess) return Promise.reject(error)

    const access = store.getters['user/getAccess'] || {}
    const blockedCapabilities = new Set(requiredCapabilities)
    const blockedProducts = new Set(requiredEntitlementProducts)

    store.dispatch('user/UpdateAccess', {
      ...access,
      products: (access.products || []).filter(
        (code) => !blockedProducts.has(normalizeCode(code))
      ),
      capabilities: (access.capabilities || []).filter(
        (code) => !blockedCapabilities.has(normalizeCode(code))
      ),
      features: (access.features || []).filter(
        (code) => !blockedCapabilities.has(normalizeCode(code))
      ),
      entitlements: (access.entitlements || []).filter(
        (entitlement) =>
          !blockedProducts.has(normalizeCode(entitlement?.product?.code))
      ),
    })

    const isInstitutionalSession =
      store.getters['user/getSessionMode'] === 'institutional_reader'

    if (isInstitutionalSession) {
      if (app.router.currentRoute.path !== '/dashboard') {
        app.router.replace('/dashboard')
      }
      return Promise.reject(error)
    }

    const subscriptionPath = '/dashboard/my-subscription'
    if (app.router.currentRoute.path !== subscriptionPath) {
      app.router.replace({
        path: subscriptionPath,
        query: { required: missingAccess },
      })
    }

    return Promise.reject(error)
  })
}
