<template>
  <NuxtLink to="/" class="flex items-center gap-2">
    <NuxtImg src="/1F41E.svg" alt="logo" class="w-6 bg-white rounded" />
    <span class="text-sm font-bold">{{ info.appName }}</span>
  </NuxtLink>
</template>

<script setup>
const { info } = useAppConfig()
</script>
