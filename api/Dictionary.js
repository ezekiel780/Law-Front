export default (axios, store = null) => ({
  searchDictionary: ({ query, size = 10, page = 1 }) => {
    const token = store.getters['user/getToken']
    return axios.get('/auth/dictionary/search', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: { q: query, size, page },
    })
  },
  searchGlossary: ({ query, size = 10, page = 1 }) => {
    const token = store.getters['user/getToken']
    return axios.get('/auth/glossary/search', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: { q: query, size, page },
    })
  },
  searchLegalMaxims: ({ query, size = 10, page = 1 }) => {
    const token = store.getters['user/getToken']
    return axios.get('/auth/legal-maxims/search', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: { q: query, size, page },
    })
  },
  fetchEntry: ({ type, id }) => {
    const token = store.getters['user/getToken']
    return axios.get(`/auth/${type}/entry/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },
})
