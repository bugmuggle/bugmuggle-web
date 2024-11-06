<template>
  <slot />
</template>

<script setup>
import { useProjectStore } from '@/store/project'
import { useUserStore } from '@/store/user'

const projectStore = useProjectStore()
const userStore = useUserStore()

const projectId = useRoute().params.projectId

onMounted(() => {
  if (!projectStore.isReady) {
    projectStore.fetchProjects()
  }

  if (projectId) {
    userStore.setLastVisitedProjectId(projectId)
  }
})
</script>
