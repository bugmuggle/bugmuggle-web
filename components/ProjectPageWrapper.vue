<template>
  <div class="space-y-3 px-9">
    <h1 class="text-2xl font-bold">
      {{ project?.name }}
    </h1>

    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-1">
        <NuxtLink class="block" :to="`/app/project/${projectId}/variables`">
          <UCard :ui="{ ring: path === `/app/project/${projectId}/variables` ? 'dark:ring-primary-500' : '' }">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-rectangle-stack" class="w-6 h-6" />
                Variables
              </div>
            </template>
          </UCard>
        </NuxtLink>
      </div>

      <div class="col-span-1">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-6 h-6" />
              Chat
            </div>
          </template>
        </UCard>
      </div>

      <div class="col-span-1">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-folder" class="w-6 h-6" />
              Files and Documents
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  },
  projectId: {
    type: String,
    default: () => ''
  }
})

const route = useRoute()

const path = computed(() => route.path)
</script>
