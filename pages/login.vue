<template>
  <NuxtLayout name="auth">
    <div class="w-full md:w-[600px] grid grid-cols-2 gap-4">
      <div class="col-span-2 md:col-span-1 flex items-start h-full gap-4">
        <div class="space-y-4 w-full px-3">
          <h1 class="text-2xl font-bold">Login</h1>
          <UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="onSubmit">
            <UFormGroup label="Email" name="email">
              <UInput v-model="state.email" :disabled="isLoading" size="lg" />
            </UFormGroup>

            <UFormGroup label="Password" name="password">
              <UInput v-model="state.password" type="password" :disabled="isLoading" size="lg" />
            </UFormGroup>

            <UButton :disabled="isLoading" :loading="isLoading" type="submit" size="lg">
              Submit
            </UButton>
          </UForm>
        </div>
      </div>
      <div class="hidden md:block col-span-1 flex items-center justify-center h-full">
        <NuxtImg src="/undraw/undraw_real_time_collaboration_c62i.svg" class="p-12" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { z } from 'zod'

const toast = useToast()

const isLoading = ref(false)

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

const state = reactive({
  email: '',
  password: '',
})

const onSubmit = (event) => {
  isLoading.value = true
  $fetch('/api/auth/login', {
    method: 'POST',
    body: event.data,
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      toast.add({
        title: 'Error',
        description: err.response.statusText,
        color: 'red',
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>
