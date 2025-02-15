<template>
  <NuxtLayout name="app">
    <AppPageWrapper>
      <template #header>
        <div class="flex items-center h-full gap-3">
          <p class="text-sm font-medium">{{ channel?.name }}</p>
          <UButton
            icon="i-heroicons-arrow-path"
            size="xs"
            color="gray"
            square
            variant="ghost"
          />
        </div>
      </template>

      <template #content>
        hello
      </template>
    </AppPageWrapper>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const cid = route.params.cid

const channel = ref(null)

onMounted(() => {
  $fetch('/api/channel/' + cid + '/get')
    .then((res) => {
      channel.value = res.data.channel
    })
})
</script>
