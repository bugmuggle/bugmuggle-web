<template>
  hello
</template>

<script setup lang="ts">
onMounted(() => {
  $fetch('/api/auth/signin', { method: 'POST' })
})
</script>
