export default (axios) => ({
  request: (
    config = {
      method: 'POST',
      url: '',
      headers: {},
      params: {},
      data: {},
      withCredentials: false,
    }
  ) => axios(config),
})
