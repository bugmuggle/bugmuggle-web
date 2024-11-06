<template>
  <div class="relative h-screen overflow-hidden">
    <div class="absolute top-0 bottom-0 left-0 w-48">
      <sidebar />
    </div>
    <div class="absolute top-0 right-0 bottom-0 left-48">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

onMounted(() => {
  if (!userStore.isReady) {
    initAppData()
  }
})
</script>
