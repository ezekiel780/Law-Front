const laravelApiBaseUrl = () =>
  (
    process.env.LARAVEL_API_BASE_URL ||
    process.env.NUXT_ENV_LARAVEL_API_BASE_URL ||
    ''
  ).replace(/\/+$/, '')

export default (axios, store = null) => ({
  createPreOrder: (
    payload = {
      quantity: 0,
      amount: 0,
      payment_method: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      address: '',
      callback_url: '',
    }
  ) =>
    axios
      .post(`${laravelApiBaseUrl()}/pre-orders`, {
        quantity: payload.quantity,
        payment_method: payload.payment_method,
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        callback_url: payload.callback_url,
      })
      .then((response) => ({
        data: {
          data: {
            message: 'Your order has been created successfully',
            payment_url: response?.data?.data?.payment_url,
            reference: response?.data?.data?.reference,
          },
        },
      })),
})
