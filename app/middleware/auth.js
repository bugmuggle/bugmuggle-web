import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const toTask = to?.query?.task

  if (!useAuthStore().isLoggedIn) {
    return navigateTo({ path: '/login', query: { task: toTask, to: to.path } })
  }
})
