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
              <div class="relative h-56 aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <input ref="profilePhotoInput" type="file" accept="image/*" class="hidden" @change="onSelectProfilePhoto" />
                
                <img 
                  v-if="storeUser.getProfile?.profilePicPath" 
                  :src="imagePreview" 
                  class="absolute inset-0 w-full h-full object-cover"
                  alt="Profile photo"
                />
                
                <div v-else class="absolute inset-0 flex items-center justify-center">
                  <UIcon name="heroicons:user" class="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <UButton block label="Upload Photo" variant="outline" size="xl" @click="onClickUploadPhoto" />
              <UButton block label="Clear Photo" variant="ghost" color="gray" size="xl" @click="onClickClearPhoto" />
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

              <UButton size="sm" label="Change Password" variant="link" @click="showChangePasswordDialog" />
            </div>
          </div>
        </UCard>
        <change-password ref="changePasswordDialog" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { z } from 'zod'
import { useUserStore } from '@/store/user'
import ChangePassword from '@/components/dialogs/ChangePassword'

const storeUser = useUserStore()
const toast = useToast()
const changePasswordDialog = ref(null)
const modal = useModal()
const imagePreview = ref(null)

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
const profilePhotoInput = ref(null)

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

const onSelectProfilePhoto = (event) => {
  const file = event.target.files[0]
  const maxSize = 1 * 1024 * 1024 // 2MB in bytes
  
  if (file && file.size > maxSize) {
    toast.add({
      title: 'File size must be less than 2MB',
      color: 'red'
    })
    event.target.value = '' // Reset the input
    return
  }
  imagePreview.value = URL.createObjectURL(file)
  storeUser.setProfilePic(file)
}

const onClickUploadPhoto = () => {
  profilePhotoInput.value.click()
}

const onClickClearPhoto = async () => {
  await storeUser.clearProfilePic()
  imagePreview.value = null
}

onMounted(() => {
  const unwatch = watch(() => storeUser.isReady, (value) => {
    if (value) {
      syncFormData()
      storeUser.fetchProfilePic(storeUser.getProfile.id)
        .then(base64Image => {
          imagePreview.value = base64Image
          unwatch()
        })
    }
  }, { immediate: true })
})


const showChangePasswordDialog = () => {
  modal.open(ChangePassword)
}
</script>
