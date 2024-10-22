export const appInit = async () => {
  const { loggedIn } = useUserSession()
  
  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  return true
}
