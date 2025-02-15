<template>
  <div v-if="isReady" class="h-dvh w-full max-w-screen-xl mx-auto block">
    <div class="flex flex-col gap-12 items-center justify-center h-full">
      <div class="grid grid-cols-12 gap-12">
        <div class="col-span-7 space-y-6">
          <nuxt-link to="/" class="block inline-flex items-center gap-2">
            <img src="/logo.svg" width="32" height="32">
            <span class="font-medium text-xl">Bugmuggle</span>
          </nuxt-link>

          <div />

          <p class="text-5xl font-bold leading-tight">
            Organize and track <span class="text-primary">Team Tasks</span> collaboratively, with open-source agility.
          </p>

          <ul class="space-y-3">
            <li class="inline-flex items-center gap-x-4">
              <UIcon name="i-heroicons-check-circle" class="text-primary" size="28" />
              <span class="text-xl">Create team projects and tasks securely</span>
            </li>
            <li class="inline-flex items-center gap-x-4">
              <UIcon name="i-heroicons-sparkles" class="text-orange-400" size="28" />
              <span class="text-xl">Add boards, workflows, integrations via built-in tools and APIs.</span>
            </li>
            <li class="inline-flex items-center gap-x-4">
              <UIcon name="i-heroicons-sparkles" class="text-orange-400" size="28" />
              <span class="text-xl">Collaborate with granular permissions and real-time sync across teams.</span>
            </li>
          </ul>
        </div>

        <div class="col-span-5">
          <div class="flex items-center justify-center h-full w-full">
            <UCard class="w-full max-w-md">
              <div class="space-y-3">
                <p class="text-xl text-center font-medium">
                  Connect with GitHub Account
                </p>
                <p class="text-center text-gray-500">
                  Get started with a free account and start deploying your Nuxt apps globally. 
                </p>

                <UButton size="lg" block variant="solid" color="white" @click="onClickLogin">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
                  Continue with GitHub
                </UButton>

                <div class="text-center text-gray-500 text-sm w-full max-w-xs mx-auto block">
                  By signing up, you agree to our Privacy Policy and Terms of Service. 
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>

      <p class="text-sm text-gray-500">&copy; {{ (new Date()).getFullYear() }} Xplorebits Technologies. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';

const { loggedIn, fetch: fetchSession, openInPopup } = useUserSession()

const isReady = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const onClickLogin = () => {
  openInPopup('/auth/github')
}

watch(loggedIn, () => {
  if (loggedIn.value) {
    onSuccess()
  }
})

const onSuccess = () => {
  authStore.isLoggedIn = true
  router.replace({ path: '/' })
}

onMounted(() => {
  fetchSession()
    .then(() => {
      if (loggedIn.value) {
        return onSuccess()
      }
    })
    .catch(error => {
      // TODO: Use global error handler
      console.error(error)
    })
    .finally(() => {
      setTimeout(() => isReady.value = true, 500)
    })
})
</script>
