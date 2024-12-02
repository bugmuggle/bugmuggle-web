<template>
  <UModal ref="refModal">
    <UCard>
      <template #header>
        Change Password
      </template>

      <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Current Password" name="currentPassword">
          <UInput v-model="state.currentPassword" type="password" />
        </UFormGroup>

        <UFormGroup label="New Password" name="newPassword">
          <UInput v-model="state.newPassword" type="password" />
        </UFormGroup>

        <UFormGroup label="Confirm New Password" name="confirmPassword">
          <UInput v-model="state.confirmPassword" type="password" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <UButton @click="() => refModal.close()" color="gray">
            Cancel
          </UButton>
          <UButton type="button" @click="() => form.submit()">
            Update Password
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { z } from 'zod'

const refModal = ref(null)
const form = ref(null)
const store = useUserStore()
const toast = useToast()

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const state = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const onSubmit = async (event) => {
  try {
    await store.updatePassword(event.data.currentPassword, event.data.newPassword)
    refModal.value.close()
    toast.add({
      title: 'Success',
      description: 'Password updated successfully',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Failed to update password',
      color: 'red'
    })
  }
}

</script>
