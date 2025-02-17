<template>
  <UButton color="white" block variant="ghost">
    <div class="flex items-center justify-start w-full gap-3">
      <UAvatar
        v-if="authStore.profile?.githubAvatarUrl"
        :src="authStore.profile?.githubAvatarUrl"
        size="xs"
      />
      <UIcon v-else name="i-heroicons-user-circle" size="24" />
      <span>{{ authStore.profile?.githubUsername }}</span>
    </div>
    <template #leading>
      
      
    </template>
  </UButton>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';

const { user } = useUserSession()
const authStore = useAuthStore()

watch(user, () => {
  if (user.value?.githubId) {
    authStore.initProfile(user.value.githubId)
  }
}, { immediate: true })
</script>
