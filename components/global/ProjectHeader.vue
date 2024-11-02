<template>
  <div class="flex items-center gap-2 px-3 h-12 border-b border-gray-800">
    <p class="text-sm font-medium text-gray-500 pr-3">{{ project.name }}</p>
    <UButton
      v-for="(item, index) in menu"
      :key="'app-page-header-' + index"
      :label="item.label"
      :variant="currentPath === item.to ? 'soft' : 'ghost'"
      :color="currentPath === item.to ? 'primary' : 'gray'"
      :to="item.to"
    />

    <div class="grow" />
  </div>
</template>

<script setup>
import { useProjectStore } from '@/store/project'

const route = useRoute()
const projectId = route.params.projectId

const menu = [
  {
    label: 'Chat',
    to: `/app/project/${projectId}/chat`,
  },
  {
    label: 'Variables',
    to: `/app/project/${projectId}/variables`,
  },
  {
    label: 'Files',
    to: `/app/project/${projectId}/files`,
  }
]

const projectStore = useProjectStore()
const project = computed(() => projectStore.getProjects.find(project => project.id === +projectId) || {})

const currentPath = computed(() => route.path)
</script>
