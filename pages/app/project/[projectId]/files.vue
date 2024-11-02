<template>
  <NuxtLayout name="app">
    <resolve-wrapper>
      <project-header />
      <view-wrapper>
        Files
      </view-wrapper>
    </resolve-wrapper>
  </NuxtLayout>
</template>

<script setup>
useHead({
  title: 'Files: BugMuggle'
})

definePageMeta({
  middleware: 'auth'
})
</script>
