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

const INSTITUTIONAL_DEVICE_KEY = 'nwlr_institutional_device_id'

const institutionalDeviceName = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'nwlr-v2-front-ip:server'
  }

  let deviceId = window.localStorage.getItem(INSTITUTIONAL_DEVICE_KEY)
  if (!deviceId) {
    deviceId =
      typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`
    window.localStorage.setItem(INSTITUTIONAL_DEVICE_KEY, deviceId)
  }

  return `nwlr-v2-front-ip:${deviceId}`
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
  landingPage: async () => {
    const [nodeResult, plansResult, methodsResult] = await Promise.allSettled([
      axios.get('/landing-page', {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      axios.get(`${laravelApiBaseUrl()}/plans?per_page=100`),
      axios.get(`${laravelApiBaseUrl()}/payment-methods`),
    ])

    const nodeResponse =
      nodeResult.status === 'fulfilled' ? nodeResult.value : null
    const plansResponse =
      plansResult.status === 'fulfilled' ? plansResult.value : null
    const methodsResponse =
      methodsResult.status === 'fulfilled' ? methodsResult.value : null
    const nodeData =
      nodeResponse?.data?.success?.data || nodeResponse?.data?.data || {}

    return successEnvelope({
      recentJudgement: nodeData.recentJudgement || [],
      plans: groupPlans(dataRows(plansResponse)),
      paymentMethod: normalizePaymentMethods(dataRows(methodsResponse)),
    })
  },

  contactUs: (
    payload = {
      name: '',
      email: '',
      phoneNumber: '',
      title: '',
      message: '',
    }
  ) =>
    axios.post(
      `${laravelApiBaseUrl()}/contact-messages`,
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phoneNumber,
        subject: payload.title,
        message: payload.message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ),

  login: async (payload = { email: '', password: '' }) => {
    const response = await axios.post(
      `${laravelApiBaseUrl()}/auth/login`,
      {
        email: payload.email,
        password: payload.password,
        device_name: 'nwlr-v2-front',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const laravelToken = response.data?.data?.token || response.data?.token
    const nodeToken =
      response.data?.data?.node_token || response.data?.node_token
    const user = response.data?.data?.user || response.data?.user || {}
    const ipuser = Boolean(response.data?.data?.ipuser || response.data?.ipuser)
    const requiresPasswordChange = Boolean(
      response.data?.data?.requires_password_change ||
        response.data?.requires_password_change ||
        user.requires_password_change
    )
    const session = response.data?.data?.session || response.data?.session || null
    const ipAccess = response.data?.data?.ip_access || response.data?.ip_access || null

    return {
      ...response,
      data: {
        ...response.data,
        success: {
          status: 'SUCCESS',
          access_token: nodeToken,
          laravel_token: laravelToken,
          ipuser,
          requires_password_change: requiresPasswordChange,
          session,
          ip_access: ipAccess,
          user,
        },
      },
    }
  },

  ipLogin: () =>
    axios.post(
      `${laravelApiBaseUrl()}/auth/ip-login`,
      { device_name: institutionalDeviceName() },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ),

  logout: async ({ nodeToken = null, laravelToken = null } = {}) => {
    const requests = []

    if (nodeToken) {
      requests.push(
        axios.post(
          `${laravelApiBaseUrl()}/auth/node-logout`,
          { node_token: nodeToken },
          { headers: { 'Content-Type': 'application/json' } }
        )
      )
    }

    if (laravelToken) {
      requests.push(
        axios.post(
          `${laravelApiBaseUrl()}/auth/logout`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${laravelToken}`,
            },
          }
        )
      )
    }

    await Promise.allSettled(requests)
  },

  access: (nodeToken = null) => {
    const token = nodeToken || store?.getters['user/getToken']

    return axios.get('/auth/me/access', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },

  refreshNodeToken: () => {
    const laravelToken = store?.getters['user/getLaravelToken']

    return axios.post(
      `${laravelApiBaseUrl()}/auth/node-token`,
      { device_name: 'nwlr-v2-front' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${laravelToken}`,
        },
      }
    )
  },

  profile: () => {
    const token = store.getters['user/getToken']
    return axios.get('/auth/profile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },

  register: (
    payload = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country: '',
      state: '',
      area: '',
      address: '',
    }
  ) =>
    axios.post(
      `${laravelApiBaseUrl()}/auth/register/customer`,
      {
        type: 'online_subscriber',
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.confirmPassword || payload.password,
        phone: payload.phone,
        country: payload.country,
        state: payload.state,
        town: payload.area,
        address: payload.address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ),

  resetPassword: (payload = { email: '' }) =>
    axios.post(
      `${laravelApiBaseUrl()}/auth/forgot-password`,
      { email: payload.email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ),

  updatePassword: (
    payload = { token: '', email: '', password: '', confirmPassword: '', firstname: '', lastname: '', phone: '', address: '' }
  ) =>
    axios.post(
      `${laravelApiBaseUrl()}/auth/reset-password`,
      {
        token: payload.token,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.confirmPassword || payload.password,
        firstname: payload.firstname || undefined,
        lastname: payload.lastname || undefined,
        phone: payload.phone || undefined,
        address: payload.address || undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ),
})
