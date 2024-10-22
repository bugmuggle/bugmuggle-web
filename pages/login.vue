<template>
  <div class="flex items-start md:items-center pt-4 md:pt-0 justify-center h-screen">
    <UCard class="w-full max-w-sm">
      <div class="space-y-4 px-3">
        <NuxtImg src="/1F41E.svg" alt="logo" class="w-12 mx-auto bg-white rounded-lg" />
        <UDivider>Login to access your account</UDivider>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" :disabled="isLoading" size="lg" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" :disabled="isLoading" size="lg" />
          </UFormGroup>

          <UButton :disabled="isLoading" :loading="isLoading" type="submit" size="lg" block>
            Submit
          </UButton>
        </UForm>
      </div>

      <template #footer>
        <p class="text-sm text-center text-gray-500">
          &copy; {{ new Date().getFullYear() }} {{ info.appName }}. All rights reserved.
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { z } from 'zod'

const { info } = useAppConfig()
const { fetch: refreshSession } = useUserSession()
const toast = useToast()

const isLoading = ref(false)

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

const state = reactive({
  email: 'saikksub@gmail.com',
  password: 'ui12345',
})

const onSubmit = async (event) => {
  try {
    isLoading.value = true
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data,
    })

    await refreshSession()
    isLoading.value = false

    navigateTo('/')
  } catch (error) {
    console.error(error)
    isLoading.value = false
    toast.add({
      title: 'Error',
      description: error.response.statusText || error.message,
      color: 'red',
    })
  }
}
</script>
