<template>
  <slot />
</template>

<script setup>
import { useProjectStore } from '@/store/project'
const projectStore = useProjectStore()

onMounted(() => {
  if (!projectStore.isReady) {
    projectStore.fetchProjects()
  }
})
</script>
