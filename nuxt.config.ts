// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/nuxt"
  ],
  compatibilityDate: "2024-10-22",
  hub: {
    database: true
  },
  runtimeConfig: {
    rootkitToken: '',
    adminEmail: '',
    adminPassword: '',
    session: {
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }
  }
})
