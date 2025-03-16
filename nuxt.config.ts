// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@nuxthub/core',
    '@vueuse/nuxt',
    'nuxt-tiptap-editor'
  ],

  colorMode: {
    preference: 'dark'
  },

  tiptap: {
    prefix: 'Tiptap'
  },

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    oauth: {
      github: {
        clientId: '',
        clientSecret: ''
      }
    },
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋',
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  hub: {
    database: true,
    blob: true
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})