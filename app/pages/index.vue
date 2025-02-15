<template>
  <!-- <tasks-list v-model="items" /> -->
  <div class="h-dvh flex items-center justify-center">
    <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()

const items = ref([
  { id: '1', name: '1', order: 3 },
  { id: '2', name: '2', order: 2 },
  { id: '3', name: '3', order: 1 },
])

onMounted(() => {
  $fetch('/api/init')
    .then((res) => {
      router.replace('/channel/' + res.data.lastVisitedChannelId)
    })
    .catch(error => {
      // TODO: Handle error using global error handler util
      console.error(error)
    })
})
</script>