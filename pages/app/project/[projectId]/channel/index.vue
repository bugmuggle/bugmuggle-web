<template>
  <NuxtLayout name="app">
    <div class="w-full max-w-screen-xl mx-auto block space-y-3">
      <UBreadcrumb
        :links="[
          {
            label: 'Home',
            to: '/home'
          },
          {
            label: project?.name,
            to: `/app/project/${projectId}`
          }
        ]"
      />

      <h1 class="text-xl font-bold">
        Channels
      </h1>

      <div class="flex items-start justify-start gap-6 flex-wrap">
        <UCard class="w-[300px] h-[120px]">
          Marketing
        </UCard>

        <UCard class="w-[300px] h-[120px]">
          Development
        </UCard>

        <UCard class="w-[300px] h-[120px]">
          QA
        </UCard>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useProjectStore } from '@/store/project'

definePageMeta({
  middleware: 'auth'
})

const { projectId } = useRoute().params
const projectStore = useProjectStore()

const isReady = computed(() => !!projectStore.isInit?.[projectId])
const project = computed(() => projectStore.getProjects.find(project => project.id === +projectId) || {})

onMounted(() => {
  if (!isReady.value) {
    projectStore.fetchProjectById(projectId)
  }
})
</script>
