import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
  const isLoggedIn = ref(false)
  const profile = ref(null)

  const initProfile = async (userId) => {
    const res = await $fetch('https://api.github.com/user/' + userId)
    profile.value = res
  }

  const updateLastVisitedChannelId = async (cid) => {
    await $fetch('/api/user/updateLastVisitedChannelId', {
      method: 'POST',
      body: { cid },
    })
  }

  return { isLoggedIn, profile, initProfile, updateLastVisitedChannelId }
})
