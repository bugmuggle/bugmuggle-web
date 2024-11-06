<template>
  <NuxtLayout name="app">
    <div class="realtive absolute top-0 right-0 bottom-0 left-0 overflow-y-auto">
      <div class="w-full max-w-screen-md mx-auto block px-3 py-6 space-y-3">
        <h1 class="text-2xl font-bold">
          Settings
        </h1>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <p class="text-base">
                Your Profile
              </p>
              <UButton size="sm" label="Save" @click="onClickSaveProfile" />
            </div>
          </template>

          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-8">
              <UForm :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
                <div class="grid grid-cols-2 gap-3">
                  <div class="col-span-1">
                    <UFormGroup label="First Name">
                      <UInput v-model="state.firstName" size="xl" />
                    </UFormGroup>
                  </div>
                  <div class="col-span-1">
                    <UFormGroup label="Last Name">
                      <UInput v-model="state.lastName" size="xl" />
                    </UFormGroup>
                  </div>
                </div>

                <UFormGroup label="What are you doing these days?">
                  <UInput v-model="state.doingTheseDays" size="xl" />
                </UFormGroup>

                <UFormGroup label="Display Name">
                  <UInput v-model="state.displayName" size="xl" />
                </UFormGroup>

                <UFormGroup label="Position/Title">
                  <UInput v-model="state.position" size="xl" />
                </UFormGroup>

                <UFormGroup label="Phone Number">
                  <UInput v-model="state.phoneNumber" size="xl" />
                </UFormGroup>
              </UForm>
            </div>

            <div class="col-span-4 space-y-3">
              <div class="h-56 aspect-square bg-gray-800 rounded-lg" />
              <UButton block label="Upload Photo" variant="outline" size="xl" />
              <UButton block label="Clear Photo" variant="ghost" color="gray" size="xl" />
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            Security
          </template>

          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">
                  Email
                </p>
                <p class="text-sm">
                  test@gmail.com
                </p>
              </div>

              <UButton size="sm" label="Change Email Address" variant="link" />
            </div>

            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">
                  Password
                </p>
                <p class="text-sm">
                  Manage your account password
                </p>
              </div>

              <UButton size="sm" label="Change Password" variant="link" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { z } from 'zod'
import { useUserStore } from '@/store/user'

const storeUser = useUserStore()

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  doingTheseDays: z.string().optional(),
  displayName: z.string().optional(),
  position: z.string().optional(),
  phoneNumber: z.string().optional(),
})

const state = reactive({
  firstName: '',
  lastName: '',
  doingTheseDays: '',
  displayName: '',
  position: '',
  phoneNumber: '',
})

const onSubmit = (e) => {
  console.log(e.data)
}

const syncFormData = () => {
  state.firstName = storeUser.getProfile.firstName || ''
  state.lastName = storeUser.getProfile.lastName || ''
  state.doingTheseDays = storeUser.getProfile.doingTheseDays || ''
  state.displayName = storeUser.getProfile.displayName || ''
  state.position = storeUser.getProfile.position || ''
  state.phoneNumber = storeUser.getProfile.phoneNumber || ''
}

const onClickSaveProfile = () => {
  storeUser.updateProfile(state)
}

onMounted(() => {
  let unwatch = null
  unwatch = watch(() => storeUser.isReady, (value) => {
    if (value) {
      syncFormData()
      unwatch && unwatch()
    }
  }, { immediate: true })
})
</script>
