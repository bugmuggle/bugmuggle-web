<template>
  <NuxtLayout name="app">
    <resolve-wrapper>
      <project-header />
      <view-wrapper>
        Tasks
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
