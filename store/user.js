import { normalizeAccess } from '~/services/auth/access'

const DefaultState = () => ({
  user: {},
  token: null,
  laravelToken: null,
  canTimeOut: true,
  loginTime: 0,
  isLoggedIn: false,
  firstname: null,
  lastname: null,
  avatar: null,
  isSubscribed: false,
  subscriptionId: null,
  isParent: false,
  isIpUser: false,
  sessionMode: null,
  requiresPasswordChange: false,
  autoDebit: 0,
  access: normalizeAccess(),
  accessLoadedAt: 0,
})
const state = DefaultState
const getters = {
  getUser: (state) => state.user,
  getToken: (state) => state.token,
  getLaravelToken: (state) => state.laravelToken,
  getCanTimeout: (state) => state.canTimeOut,
  getLoginTime: (state) => state.loginTime,
  getIsLoggedIn: (state) => state.isLoggedIn,
  getFirstName: (state) => state.firstname,
  getLastName: (state) => state.lastname,
  getAvatar: (state) => state.avatar,
  getIsSubscribed: (state) => state.isSubscribed,
  getSubscriptionId: (state) => state.subscriptionId,
  getIsParent: (state) => state.isParent,
  getIsIpUser: (state) => state.isIpUser,
  getSessionMode: (state) => state.sessionMode,
  getRequiresPasswordChange: (state) =>
    Boolean(state.requiresPasswordChange),
  getAutoDebit: (state) => state.autoDebit,
  getAccess: (state) => normalizeAccess(state.access),
  getAccessLoadedAt: (state) => Number(state.accessLoadedAt || 0),
  getActiveProducts: (state) => normalizeAccess(state.access).products,
  getActiveFeatures: (state) => normalizeAccess(state.access).features,
  getActiveCapabilities: (state) =>
    normalizeAccess(state.access).capabilities,
  getActiveEntitlements: (state) =>
    normalizeAccess(state.access).entitlements,
}
const actions = {
  ResetState({ commit }) {
    commit('resetToDefault')
  },
  LoginUser({ commit }, user) {
    commit('setUser', user)
  },
  LoginStatus({ commit }, status) {
    commit('setLoginStatus', status)
  },
  UserCanTimeout({ commit }, canTimeOut) {
    commit('setCanTimeout', canTimeOut)
  },
  LoginToken({ commit }, userToken) {
    commit('setToken', userToken)
  },
  LoginLaravelToken({ commit }, userToken) {
    commit('setLaravelToken', userToken)
  },
  UpdateFirstName({ commit }, firstname) {
    commit('setFirstName', firstname)
  },
  UpdateLastName({ commit }, lastname) {
    commit('setLastName', lastname)
  },
  UpdateAvatar({ commit }, avatar) {
    commit('setAvatar', avatar)
  },
  UpdateIsSubscribed({ commit }, isSubscribed) {
    commit('setIsSubscribed', isSubscribed)
  },
  UpdateSubscriptionId({ commit }, subscriptionId) {
    commit('setSubscriptionId', subscriptionId)
  },
  UpdateIsParent({ commit }, isParent) {
    commit('setIsParent', isParent)
  },
  UpdateIsIpUser({ commit }, isIpUser) {
    commit('setIsIpUser', isIpUser)
  },
  UpdateSessionMode({ commit }, sessionMode) {
    commit('setSessionMode', sessionMode)
  },
  UpdateRequiresPasswordChange({ commit }, requiresPasswordChange) {
    commit('setRequiresPasswordChange', requiresPasswordChange)
  },
  UpdateAutoDebit({ commit }, autoDebit) {
    commit('setAutoDebit', autoDebit)
  },
  UpdateAccess({ commit }, access) {
    commit('setAccess', access)
  },
}
const mutations = {
  resetToDefault(state) {
    if (state) Object.assign(state, DefaultState())
  },
  restoreUser(state, userValues) {
    if (state && userValues && typeof userValues === 'object') {
      Object.assign(state, userValues)
    }
  },
  setUser(state, userValues) {
    state.user = userValues
    state.loginTime = new Date().getTime()
  },
  setCanTimeout(state, canTimeOut) {
    state.canTimeOut = canTimeOut
  },
  setToken(state, userToken) {
    state.token = userToken
  },
  setLaravelToken(state, userToken) {
    state.laravelToken = userToken
  },
  setLoginStatus(state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn
    state.loginTime = isLoggedIn ? Date.now() : 0
  },
  setFirstName(state, firstname) {
    state.firstname = firstname
  },
  setLastName(state, lastname) {
    state.lastname = lastname
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setIsSubscribed(state, isSubscribed) {
    state.isSubscribed = isSubscribed
  },
  setSubscriptionId(state, subscriptionId) {
    state.subscriptionId = subscriptionId
  },
  setIsParent(state, isParent) {
    state.isParent = isParent
  },
  setIsIpUser(state, isIpUser) {
    state.isIpUser = isIpUser
  },
  setSessionMode(state, sessionMode) {
    state.sessionMode = sessionMode || null
  },
  setRequiresPasswordChange(state, requiresPasswordChange) {
    state.requiresPasswordChange = Boolean(requiresPasswordChange)
  },
  setAutoDebit(state, autoDebit) {
    state.autoDebit = autoDebit
  },
  setAccess(state, access) {
    state.access = normalizeAccess(access)
    state.accessLoadedAt = Date.now()
  },
}
export default {
  state,
  getters,
  actions,
  mutations,
}
