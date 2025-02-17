import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
  const isLoggedIn = ref(false)
  const profile = ref(null)

  const initProfile = async () => {
    const res = await $fetch('/api/user/self-profile')
    profile.value = res.data
  }

  const updateLastVisitedChannelId = async (cid) => {
    await $fetch('/api/user/updateLastVisitedChannelId', {
      method: 'POST',
      body: { cid },
    })
  }

  return { isLoggedIn, profile, initProfile, updateLastVisitedChannelId }
})
