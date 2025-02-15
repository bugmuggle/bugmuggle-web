import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
  const isLoggedIn = ref(false)

  return { isLoggedIn }
})
