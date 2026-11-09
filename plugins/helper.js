import globalMethods from '~/services/utilities/globalMethods'

export default (context, inject) => {
  // Inject $helper
  inject('helper', globalMethods(context))
}
