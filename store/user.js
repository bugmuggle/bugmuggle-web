import { defineStore } from 'pinia'
import setLastVisitedProjectId from './actions/user/setLastVisitedProjectId'
import updateProfile from './actions/user/updateProfile'
import setProfilePic from './actions/user/setProfilePic'
import fetchProfilePic from './actions/user/fetchProfilePic'
import clearProfilePic from './actions/user/clearProfilePic'

export const useUserStore = defineStore('user', () => {
  const preferences = ref({})
  const profile = ref({})
  const isReady = ref(false)
  const profilePicBase64 = ref({})

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

  const getProfilePicBase64ByUserId = (userId) => {
    return profilePicBase64.value[userId] || ''
  }

  return {
    preferences,
    profile,
    setLastVisitedProjectId,
    fullName,
    isReady,
    getProfile,
    updateProfile,
    setProfilePic,
    fetchProfilePic,
    profilePicBase64,
    getProfilePicBase64ByUserId,
    clearProfilePic
  }
})
