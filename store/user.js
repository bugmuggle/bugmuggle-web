import { defineStore } from 'pinia'
import setLastVisitedProjectId from './actions/user/setLastVisitedProjectId'

export const useUserStore = defineStore('user', () => {
  const preferences = ref({})

  return { preferences, setLastVisitedProjectId }
})
