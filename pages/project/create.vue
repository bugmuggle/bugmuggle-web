<template>
  <NuxtLayout name="app">
    <div class="w-full max-w-screen-sm mx-auto block py-6 space-y-6">
      <h1 class="text-2xl font-bold">Create Project</h1>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormGroup label="Project Name">
          <UInput v-model="state.name" name="name" size="lg" />
        </UFormGroup>

        <UButton type="submit" size="lg" color="primary">
          Continue
        </UButton>
      </UForm>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useProjectStore } from '~/store/project'
import { z } from 'zod'

const toast = useToast()

const schema = z.object({
  name: z.string().min(1)
})

const projectStore = useProjectStore()

const state = reactive({
  name: ''
})

const isLoading = ref(false)

const handleSubmit = (event) => {
  isLoading.value = true
  projectStore.createProject(event.data)
    .then(() => {
      navigateTo('/home')
    })
    .catch((error) => {
      toast.add({
        title: 'Error',
        description: error.response.statusText || error.message,
        color: 'red'
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>
