// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@nuxt/image"
  ],
  compatibilityDate: "2024-10-22",
  hub: {
    database: true
  },
  runtimeConfig: {
    rootkitToken: '',
    adminEmail: '',
    adminPassword: '',
  }
})
