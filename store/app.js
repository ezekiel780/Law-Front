const DefaultState = () => ({
  query: null,
  lastLoginTime: null,
})

const state = DefaultState

const getters = {
  getQuery: (state) => state.query,
  getLastLoginTime: (state) => state.lastLoginTime,
}

const actions = {
  ResetState({ commit }) {
    commit('ResetToDefault')
  },


  UpdateQuery({ commit }, query) {
    commit('SetQuery', query)
  },

  UpdateLastLoginTime({ commit }, lastLoginTime = null) {
    commit('SetLastLoginTime', lastLoginTime)
  },
}

const mutations = {
  ResetToDefault(state) {
    if (state) Object.assign(state, DefaultState())
  },


  SetQuery(state, query) {
    state.query = query
  },

  SetLastLoginTime(state, lastLoginTime) {
    state.lastLoginTime = lastLoginTime
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
