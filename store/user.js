import { defineStore } from 'pinia'
import setLastVisitedProjectId from './actions/user/setLastVisitedProjectId'

export const useUserStore = defineStore('user', () => {
  const preferences = ref({})
  const profile = ref({})

  const fullName = computed(() => {
    if (!profile.value) {
      return ''
    }

    if (!profile.value.firstName && !profile.value.lastName) {
      return profile.value.email
    }

    return `${profile.value.firstName} ${profile.value.lastName}`
  })

  return { preferences, profile, setLastVisitedProjectId, fullName }
})
