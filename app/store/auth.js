import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
  const isLoggedIn = ref(false)
  const profile = ref(null)

  const initProfile = async (userId) => {
    const res = await fetch('https://api.github.com/user/' + userId)
    if (res.status === 200) {
      profile.value = await res.json()
    }
  }

  return { isLoggedIn, profile, initProfile }
})
