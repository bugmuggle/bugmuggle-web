<template>
  <div class="h-full border-r border-gray-800 flex flex-col gap-5">
    <div class="h-12 border-b border-gray-800 flex items-center px-3">
      <app-hero-title />
    </div>

    <div class="px-1 space-y-1 !-mt-3">
      <UVerticalNavigation
        :ui="{
          size: 'text-xs',
          font: 'font-regular',
          active: 'before:dark:bg-primary-500',
          inactive: 'before:dark:text-gray-200'
        }"
        :links="taskMenu"
      />
    </div>

    <div class="px-1 space-y-1">
      <p class="text-xs text-gray-500 px-2">
        Projects
      </p>
      <UVerticalNavigation
        :ui="{
          size: 'text-xs',
          font: 'font-regular',
          active: 'dark:text-primary-500 before:dark:bg-primary-900',
          inactive: 'before:dark:text-gray-200'
        }"
        :links="projectLinks"
      />
    </div>

    <div class="px-1 space-y-1">
      <p class="text-xs text-gray-500 px-2">
        Direct Messages
      </p>
    </div>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()
const route = useRoute()

const projectLinks = computed(() => {
  return [
    ...projectStore.projects.map((project) => ({
    label: project.name,
      to: `/app/project/${project.id}/chat`,
      active: route.path.includes(`/app/project/${project.id}`)
    })),
    {
      label: 'Create Project',
      icon: 'i-heroicons-plus',
      to: '/app/project/create'
    },
  ]
})

const taskMenu = [
  {
    label: 'My Tasks',
    to: '/app/project/create'
  },
]

onMounted(() => {
  if (!projectStore.isReady) {
    projectStore.fetchProjects()
  }
})
</script>
