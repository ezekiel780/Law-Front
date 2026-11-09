const laravelApiBaseUrl = () =>
  (
    process.env.LARAVEL_API_BASE_URL ||
    process.env.NUXT_ENV_LARAVEL_API_BASE_URL ||
    ''
  ).replace(/\/+$/, '')

const laravelAuthHeaders = (store) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${store.getters['user/getLaravelToken']}`,
})

const refreshStoredAccess = async (axios, store, nodeToken) => {
  if (!nodeToken) return

  try {
    const response = await axios.get('/auth/me/access', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${nodeToken}`,
      },
    })
    await store.dispatch('user/UpdateAccess', response?.data?.data || {})
  } catch (error) {
    // Protected routes retry authoritative access synchronization.
  }
}

const refreshNodeToken = async (axios, store) => {
  const tokenResponse = await axios.post(
    `${laravelApiBaseUrl()}/auth/node-token`,
    { device_name: 'nwlr-v2-front' },
    { headers: laravelAuthHeaders(store) }
  )
  const nodeToken = tokenResponse?.data?.data?.node_token

  if (nodeToken) {
    await store.dispatch('user/LoginToken', nodeToken)
    await refreshStoredAccess(axios, store, nodeToken)
  }

  return nodeToken
}
export default (axios, store = null) => ({
  updateProfile: async (
    payload = {
      firstname: '',
      lastname: '',
      phone: '',
      address: '',
      country: '',
      state: '',
      area: '',
      town: '',
    }
  ) => {
    const laravelToken = store.getters['user/getLaravelToken']
    if (!laravelToken) {
      throw new Error(
        'Your authenticated account session is unavailable. Please sign in again.'
      )
    }

    const profile = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      avatar: payload.avatar,
      country: payload.country,
      state: payload.state,
      town: payload.town || payload.area || payload.city,
    }

    const response = await axios.patch(
      `${laravelApiBaseUrl()}/account/profile`,
      profile,
      { headers: laravelAuthHeaders(store) }
    )

    const updatedUser = response?.data?.data || {}
    await Promise.all([
      store.dispatch(
        'user/UpdateFirstName',
        updatedUser.firstname ?? profile.firstname
      ),
      store.dispatch(
        'user/UpdateLastName',
        updatedUser.lastname ?? profile.lastname
      ),
      store.dispatch('user/UpdateAvatar', updatedUser.avatar ?? profile.avatar),
    ])

    if (!payload._emailChanged) {
      await refreshNodeToken(axios, store)
    }

    return {
      ...response,
      emailChanged: Boolean(payload._emailChanged),
    }
  },

  downloadUsageStatistics: (params = {}) =>
    axios.get(
      `${laravelApiBaseUrl()}/account/engagement/usage-statistics/download`,
      {
        params,
        responseType: 'blob',
        headers: laravelAuthHeaders(store),
      }
    ),

  updatePassword: (
    payload = {
      old_password: '',
      new_password: '',
    }
  ) =>
    axios.patch(
      `${laravelApiBaseUrl()}/account/password`,
      {
        current_password: payload.old_password,
        password: payload.new_password,
        password_confirmation: payload.new_password,
      },
      {
        headers: laravelAuthHeaders(store),
      }
    ),

  savedCases: () => {
    const token = store.getters['user/getToken']
    return axios.get('/auth/saved-cases', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },

  savedResults: () => {
    const token = store.getters['user/getToken']
    return axios.get('/auth/saved-results', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },

  updateAutoDebit: async (autoDebit = 0) => {
    const subscriptionId = store.getters['user/getSubscriptionId']

    if (!subscriptionId) {
      throw new Error(
        'An active subscription is required to update auto-renewal'
      )
    }

    const response = await axios.patch(
      `${laravelApiBaseUrl()}/account/subscriptions/${subscriptionId}/auto-renew`,
      { auto_renew: Boolean(Number(autoDebit)) },
      { headers: laravelAuthHeaders(store) }
    )

    await refreshNodeToken(axios, store)

    const enabled = Boolean(response?.data?.data?.auto_renew)
    store.dispatch('user/UpdateAutoDebit', enabled ? 1 : 0)

    return {
      ...response,
      data: {
        ...response.data,
        message:
          response?.data?.message ||
          `Auto-renewal ${enabled ? 'enabled' : 'disabled'} successfully.`,
      },
    }
  },

  deleteResearch: (
    payload = {
      type: 'cases',
      id: '',
    }
  ) => {
    const token = store.getters['user/getToken']
    return axios.post('/auth/delete-research', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },
})
