import {
  comparePlansByProductAndCost,
  markPremiumPlansByProduct,
  normalizedPlanCategory,
} from '~/utils/subscription-plan.js'

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

const nodeAuthHeaders = (store) => {
  const token = store.getters['user/getToken']
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

const dataRows = (response) =>
  response?.data?.data?.data || response?.data?.data || []

const groupPlans = (plans = []) => {
  const grouped = { premium: [], individual: [], corporate: [], all: [] }
  const orderedPlans = markPremiumPlansByProduct(plans).sort(
    comparePlansByProductAndCost
  )

  orderedPlans.forEach((plan) => {
    const category = normalizedPlanCategory(plan)
    grouped.all.push(plan)

    if (category === 'corporate') {
      grouped.corporate.push(plan)
      return
    }

    if (category === 'individual') {
      grouped.individual.push(plan)
      if (plan.is_premium) grouped.premium.push(plan)
    }
  })

  return grouped
}

const normalizePaymentMethods = (methods = []) =>
  methods.map((method) => ({
    ...method,
    title: method.title || method.name || method.gateway_code || method.slug,
    status: method.status === true || method.status === 1 ? 1 : method.status,
  }))

const successEnvelope = (data, message = 'Request processed successfully') => ({
  data: {
    success: {
      status: 'SUCCESS',
      message,
      data,
    },
  },
})

export default (axios, store = null) => ({
  getPlans: async () => {
    const [plansResponse, methodsResponse] = await Promise.all([
      axios.get(`${laravelApiBaseUrl()}/plans?per_page=100`),
      axios.get(`${laravelApiBaseUrl()}/payment-methods`),
    ])

    const plans = groupPlans(dataRows(plansResponse))
    const paymentMethod = normalizePaymentMethods(dataRows(methodsResponse))

    return successEnvelope({
      plans,
      paymentMethod,
    })
  },

  saveCase: (
    payload = {
      case_id: '',
      case_name: '',
    }
  ) => {
    return axios.post('/auth/save-case', payload, {
      headers: nodeAuthHeaders(store),
    })
  },

  saveResult: (payload = { query: '' }) => {
    return axios.post('/auth/save-result', payload, {
      headers: nodeAuthHeaders(store),
    })
  },

  getPaymentMethods: async () => {
    const response = await axios.get(`${laravelApiBaseUrl()}/payment-methods`)
    return normalizePaymentMethods(dataRows(response))
  },

  initializeExistingSubscriptionPayment: async (
    subscriptionId,
    { payment_method_id, callback_url } = {}
  ) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/subscriptions/${encodeURIComponent(
        String(subscriptionId)
      )}/payments/initialize`,
      { payment_method_id, callback_url },
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  getSupportTicket: async (ticketId) => {
    const response = await axios.get(
      `${laravelApiBaseUrl()}/account/tickets/${encodeURIComponent(String(ticketId))}`,
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  addSupportTicketComment: async (ticketId, body) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/account/tickets/${encodeURIComponent(String(ticketId))}/comments`,
      { body: String(body || '').trim(), is_public: true },
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  getSubscriptions: async ({ page = 1, perPage = 15, search = '' } = {}) => {
    const response = await axios.get(
      `${laravelApiBaseUrl()}/account/subscriptions`,
      {
        headers: laravelAuthHeaders(store),
        params: {
          page,
          per_page: perPage,
          ...(String(search).trim() ? { search: String(search).trim() } : {}),
        },
      }
    )

    const subscriptions = dataRows(response).map((subscription) => ({
      ...subscription,
      current_period_start:
        subscription.current_period_start || subscription.starts_at,
      current_period_end:
        subscription.current_period_end || subscription.ends_at,
      history_status: subscription.status,
    }))

    return {
      data: {
        status: 'SUCCESS',
        data: subscriptions,
        links: response?.data?.links || {},
        meta: response?.data?.meta || {
          current_page: page,
          last_page: 1,
          per_page: perPage,
          from: subscriptions.length ? 1 : null,
          to: subscriptions.length,
          total: subscriptions.length,
        },
      },
    }
  },

  createSubscription: async (
    payload = {
      plan_id: '',
      amount: '',
      type: '',
      callbackUrl: '',
      callback_url: '',
      recurring: '',
      no_of_users: '',
    }
  ) => {
    const plansResponse = await axios.get(
      `${laravelApiBaseUrl()}/payment-methods`
    )
    const methods = normalizePaymentMethods(dataRows(plansResponse))
    const selectedType = String(payload.type || '').toLowerCase()
    const paymentMethod = methods.find((method) =>
      [method.title, method.slug, method.gateway_code]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())
        .includes(selectedType)
    )

    if (!paymentMethod) {
      throw new Error('Unsupported payment method')
    }

    const subscriptionResponse = await axios.post(
      `${laravelApiBaseUrl()}/subscriptions`,
      {
        plan_id: payload.plan_id,
        no_of_users: Number(payload.no_of_users || 1),
        auto_renew: Boolean(payload.recurring),
      },
      {
        headers: laravelAuthHeaders(store),
      }
    )

    const subscription = subscriptionResponse?.data?.data
    const paymentResponse = await axios.post(
      `${laravelApiBaseUrl()}/subscriptions/${
        subscription.id
      }/payments/initialize`,
      {
        payment_method_id: paymentMethod.id,
        callback_url: payload.callback_url || payload.callbackUrl,
      },
      {
        headers: laravelAuthHeaders(store),
      }
    )

    const payment = paymentResponse?.data?.data

    return {
      data: {
        success: {
          status: 'SUCCESS',
          message:
            payment.message || 'Transaction initialized successfully',
          payment_url: payment.authorization_url,
          reference: payment.reference,
          external_reference: payment.external_reference,
          gateway:
            payment.gateway ||
            paymentMethod.gateway_code ||
            paymentMethod.slug,
          subscription_id: subscription.id,
          transaction_id: payment.transaction_id || payment.id,
          data: {
            subscription,
            payment,
          },
        },
      },
    }
  },

  getPlanChanges: async (subscriptionId, { page = 1, perPage = 25 } = {}) => {
    const response = await axios.get(
      `${laravelApiBaseUrl()}/account/subscriptions/${encodeURIComponent(
        String(subscriptionId)
      )}/plan-changes`,
      {
        headers: laravelAuthHeaders(store),
        params: { page, per_page: perPage },
      }
    )

    return {
      data: {
        status: 'SUCCESS',
        data: dataRows(response),
        links: response?.data?.links || {},
        meta: response?.data?.meta || {},
      },
    }
  },

  quotePlanChange: async (
    subscriptionId,
    { target_plan_id, target_seats = 1, user_ids = [] } = {}
  ) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/account/subscriptions/${encodeURIComponent(
        String(subscriptionId)
      )}/plan-changes/quote`,
      {
        target_plan_id,
        target_seats,
        ...(Array.isArray(user_ids) && user_ids.length ? { user_ids } : {}),
      },
      {
        headers: {
          ...laravelAuthHeaders(store),
          'Idempotency-Key': `plan-change-${subscriptionId}-${target_plan_id}-${Date.now()}`,
        },
      }
    )

    return response?.data?.data || response?.data
  },

  acceptPlanChange: async (planChangeId) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/account/subscription-plan-changes/${encodeURIComponent(
        String(planChangeId)
      )}/accept`,
      { no_refund_acknowledged: true },
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  previewPlanChangePayment: async (
    planChangeId,
    { payment_method_id } = {}
  ) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/account/subscription-plan-changes/${encodeURIComponent(
        String(planChangeId)
      )}/payments/preview`,
      { payment_method_id },
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  initializePlanChangePayment: async (
    planChangeId,
    { payment_method_id, callback_url } = {}
  ) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/account/subscription-plan-changes/${encodeURIComponent(
        String(planChangeId)
      )}/payments/initialize`,
      { payment_method_id, callback_url },
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  getPlanChange: async (planChangeId) => {
    const response = await axios.get(
      `${laravelApiBaseUrl()}/account/subscription-plan-changes/${encodeURIComponent(
        String(planChangeId)
      )}`,
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  cancelPlanChange: async (planChangeId) => {
    const response = await axios.delete(
      `${laravelApiBaseUrl()}/account/subscription-plan-changes/${encodeURIComponent(
        String(planChangeId)
      )}`,
      { headers: laravelAuthHeaders(store) }
    )

    return response?.data?.data || response?.data
  },

  confirmSubscription: async (
    payload = {
      type: '',
      reference: '',
    }
  ) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/account/subscriptions/payments/verify`,
      {
        reference: payload.reference,
        external_reference: payload.external_reference,
      },
      {
        headers: laravelAuthHeaders(store),
      }
    )

    const payment = response?.data?.data || response?.data
    const paymentStatus = String(payment?.status || '').toLowerCase()
    const subscriptionAccessGranted = Boolean(payment?.subscription_access_granted)

    if (paymentStatus === 'paid' && subscriptionAccessGranted) {
      const tokenResponse = await axios.post(
        `${laravelApiBaseUrl()}/auth/node-token`,
        {},
        {
          headers: laravelAuthHeaders(store),
        }
      )
      const nodeToken = tokenResponse?.data?.data?.node_token

      if (nodeToken) {
        await store.dispatch('user/LoginToken', nodeToken)
        await refreshStoredAccess(axios, store, nodeToken)
      }
    }

    return successEnvelope(
      payment,
      paymentStatus === 'paid' && subscriptionAccessGranted
        ? 'Payment verified and subscription access is available'
        : paymentStatus === 'paid'
        ? 'Payment is confirmed, but subscription access is not available yet'
        : 'Payment confirmation is still pending'
    )
  },

  openPaymentDispute: (paymentId, payload) =>
    axios.post(
      `${laravelApiBaseUrl()}/account/payments/${paymentId}/disputes`,
      payload,
      { headers: laravelAuthHeaders(store) }
    ),

  addPaymentDisputeInformation: (disputeId, payload) =>
    axios.post(
      `${laravelApiBaseUrl()}/account/payment-disputes/${disputeId}/information`,
      payload,
      { headers: laravelAuthHeaders(store) }
    ),

  getIpAccessOverview: () =>
    axios.get(`${laravelApiBaseUrl()}/account/ip-access`, {
      headers: laravelAuthHeaders(store),
    }),

  getCorporateUsers: () =>
    axios.get(`${laravelApiBaseUrl()}/account/subscription-users`, {
      headers: laravelAuthHeaders(store),
    }),

  getCorporateMemberships: () =>
    axios.get(`${laravelApiBaseUrl()}/account/corporate-memberships`, {
      headers: laravelAuthHeaders(store),
    }),

  addCorporateUser: (
    payload = {
      email: '',
      subscription_id: '',
    }
  ) =>
    axios.post(`${laravelApiBaseUrl()}/account/subscription-users`, payload, {
      headers: laravelAuthHeaders(store),
    }),

  removeCorporateUser: (userId) =>
    axios.delete(
      `${laravelApiBaseUrl()}/account/subscription-users/${userId}`,
      {
        headers: laravelAuthHeaders(store),
      }
    ),

  leaveCorporateSubscription: (subscriptionId) =>
    axios.delete(
      `${laravelApiBaseUrl()}/account/corporate-memberships/${encodeURIComponent(
        String(subscriptionId)
      )}`,
      {
        headers: laravelAuthHeaders(store),
      }
    ),
})
