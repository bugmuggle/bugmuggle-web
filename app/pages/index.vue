<template>
  <NuxtLayout name="app">
    <tasks-list v-model="items" />
  </NuxtLayout>
</template>

<script setup>
const items = ref([
  { id: '1', name: '1', order: 3 },
  { id: '2', name: '2', order: 2 },
  { id: '3', name: '3', order: 1 },
])
</script>