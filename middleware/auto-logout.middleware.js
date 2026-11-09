export default ({ $user, route, redirect }) => {
  // check user object is empty or not
  const status = $user.getIsLoggedIn()
  // if route matches app folder and user is not logged in
  if (route.path.includes('/app') && !status) {
    // redirect to home page
    return redirect('/')
  }
}
