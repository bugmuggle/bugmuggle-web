<template>
  <div class="flex items-center gap-2 px-3 h-16">
    <NuxtLink to="/" class="flex items-center gap-2">
      <NuxtImg src="/1F41E.svg" alt="logo" class="w-6 bg-white rounded" />
      <span class="text-sm font-bold">{{ info.appName }}</span>
    </NuxtLink>

    <div class="inline-flex items-center gap-1">
      <UButton
        :color="currentPath === '/home' ? 'primary' : 'gray'"
        :variant="currentPath === '/home' ? 'soft' : 'ghost'"
        to="/home"
        label="Home"
      />
      <UButton
        :color="currentPath === '/my-tasks' ? 'primary' : 'gray'"
        :variant="currentPath === '/my-tasks' ? 'solid' : 'ghost'"
        label="My Tasks"
      />
    </div>

    <div class="grow" />

    <UButton to="/project/create" icon="i-heroicons-plus" color="gray" variant="ghost" label="Create Project" />
    <UButton color="gray" variant="ghost" label="Invite Members" />

    <UButton
      icon="i-heroicons-user-circle"
      color="gray"
      square
      variant="ghost"
    />
  </div>
</template>

<script setup>
const { info } = useAppConfig()

const route = useRoute()

const currentPath = computed(() => route.path)
</script>
