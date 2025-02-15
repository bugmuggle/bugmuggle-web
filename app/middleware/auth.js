import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware(() => {
  if (!useAuthStore().isLoggedIn) {
    return navigateTo('/login')
  }
})
