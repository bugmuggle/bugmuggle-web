import { useUserStore } from '@/store/user'

export const initAppData = async () => {
  const userStore = useUserStore()
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  const responsePreferences = await $fetch('/api/app/user/init')
  userStore.preferences = responsePreferences

  return userStore.preferences
}
