import { useUserStore } from '@/store/user'
import { useProjectStore } from '@/store/project'

export const initAppData = async () => {
  const userStore = useUserStore()
  const projectStore = useProjectStore()

  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  const responsePreferences = await $fetch('/api/app/user/init')
  userStore.preferences = responsePreferences

  projectStore[responsePreferences.lastVisitedProjectId] = {}
  projectStore[responsePreferences.lastVisitedProjectId]['members'] = responsePreferences.members
  userStore.profile = responsePreferences.user

  userStore.isReady = true

  return userStore.preferences
}
