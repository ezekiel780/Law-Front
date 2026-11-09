import ErrorHandler from '~/services/errors/Errors'

export default (context, inject) => {
  inject('errorHandler', new ErrorHandler())
}
