import user from '~/services/auth/user'

export default (context, inject) => {
  const store = context.app.store
  const redirect = context.redirect

  // Inject $user
  inject('user', user(store, redirect, context.$api))
}
