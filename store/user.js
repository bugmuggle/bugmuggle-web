import { defineStore } from 'pinia'
import setLastVisitedProjectId from './actions/user/setLastVisitedProjectId'
import updateProfile from './actions/user/updateProfile'

export const useUserStore = defineStore('user', () => {
  const preferences = ref({})
  const profile = ref({})
  const isReady = ref(false)

  const fullName = computed(() => {
    if (!profile.value) {
      return ''
    }

    if (profile.value.displayName) {
      return profile.value.displayName
    }

    if (!profile.value.firstName && !profile.value.lastName) {
      return profile.value.email
    }

    return `${profile.value.firstName} ${profile.value.lastName}`
  })

  const getProfile = computed(() => {
    return profile.value
  })

  return {
    preferences,
    profile,
    setLastVisitedProjectId,
    fullName,
    isReady,
    getProfile,
    updateProfile
  }
})
