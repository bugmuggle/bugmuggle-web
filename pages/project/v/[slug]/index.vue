<template>
  <NuxtLayout name="app">
    <div class="w-full max-w-screen-xl mx-auto block space-y-3">
      <project-page-wrapper
        :project="project"
        :slug="slug"
      >
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
      </project-page-wrapper>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useProjectStore } from '@/store/project'

definePageMeta({
  middleware: 'auth'
})

const { slug } = useRoute().params
const projectStore = useProjectStore()

const isReady = computed(() => !!projectStore.isInit?.[slug])
const project = computed(() => projectStore.getProjects.find(project => project.id === +slug) || {})

onMounted(() => {
  if (!isReady.value) {
    projectStore.fetchProjectById(slug)
  }
})
</script>
