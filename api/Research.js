const inFlightRequests = new Map()

const requestKey = (path, params = {}) => {
  const query = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  return `${path}?${query}`
}

const coalesceRequest = (key, request) => {
  if (inFlightRequests.has(key)) return inFlightRequests.get(key)

  const promise = Promise.resolve()
    .then(request)
    .finally(() => inFlightRequests.delete(key))

  inFlightRequests.set(key, promise)
  return promise
}

export default (axios, store = null) => ({
  search: (
    searchQuery,
    m,
    t,
    s,
    pg,
    s_dt,
    e_dt,
    court = null,
    division = null,
    justice = null,
    counsel = null,
    parties = null
  ) => {
    const token = store.getters['user/getToken']
    const paramsObj = {}
    if (searchQuery) paramsObj.q = searchQuery
    if (m) paramsObj.m = m
    if (t) paramsObj.t = t
    if (s) paramsObj.s = s
    if (pg) paramsObj.pg = pg
    if (s_dt) paramsObj.s_dt = s_dt
    if (e_dt) paramsObj.e_dt = e_dt
    if (court) paramsObj.court = court
    if (division) paramsObj.division = division
    if (justice) paramsObj.justice = justice
    if (counsel) paramsObj.counsel = counsel
    if (parties) paramsObj.parties = parties

    const key = requestKey('/auth/search', paramsObj)
    return coalesceRequest(key, () =>
      axios.get('/auth/search', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: paramsObj,
      })
    )
  },

  loadCase: (caseId) => {
    const token = store.getters['user/getToken']
    return axios.get(`/auth/load-case/${caseId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getCaseMetadata: (caseId) => {
    const token = store.getters['user/getToken']
    return axios.get(`/auth/case-details/${caseId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getSimilarSearch: (term) => {
    const token = store.getters['user/getToken']
    const normalizedTerm = String(term ?? '').trim()
    const encodedTerm = encodeURIComponent(normalizedTerm)
    const key = requestKey('/auth/similar-search', { term: normalizedTerm })

    return coalesceRequest(key, () =>
      axios.get(`/auth/similar-search?term=${encodedTerm}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    )
  },
})
