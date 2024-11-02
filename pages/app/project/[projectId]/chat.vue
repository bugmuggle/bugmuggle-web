<template>
  <NuxtLayout name="app">
    <resolve-wrapper>
      <div class="absolute top-0 right-0 left-0 h-12">
        <project-header />
      </div>
      <div class="absolute top-12 right-0 bottom-32 left-0 overflow-auto">
        <div class="h-full flex flex-col">
          <div class="grow" />

          <div v-for="item in 100" :key="'asdfasfasdf' + item" class="h-12 p-6">
            Message {{ item }}
          </div>
        </div>
      </div>
      <div class="absolute right-0 bottom-0 left-0 h-32 bg-gray-800">
        hello
      </div>
    </resolve-wrapper>
  </NuxtLayout>
</template>

<script setup>
import { useProjectStore } from '@/store/project'

useHead({
  title: 'Chat: BugMuggle'
})

definePageMeta({
  middleware: 'auth'
})
</script>
