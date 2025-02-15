<template>
  <NuxtLayout name="app">
    <div>
      <h1>Channel {{ cid }}</h1>
    </div>
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()
const cid = route.params.cid
</script>
