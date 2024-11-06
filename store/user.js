import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const preferences = ref({})

  return { preferences }
})
