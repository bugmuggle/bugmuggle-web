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

          <div class="grow" />

          <UButton
            icon="i-heroicons-plus"
            size="xs"
            color="white"
            square
            variant="soft"
            label="Task"
            @click="() => refCreateTask.open()"
          />
        </div>
      </template>

      <template #content>
        <div class="space-y-3">
          <tasks-list v-model="tasks" @sort="onSort" />

          <UButton
            icon="i-heroicons-plus"
            size="xs"
            color="white"
            square
            variant="soft"
            label="Create Task"
            @click="() => refCreateTask.open()"
          />
        </div>
      </template>
    </AppPageWrapper>
  </NuxtLayout>

  <DialogsCreateTask ref="refCreateTask" />
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { useTaskStore } from '~/store/task'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const cid = route.params.cid

const channel = ref(null)
const tasks = ref([])
const refCreateTask = ref(null)

const onSort = () => {
  taskStore.updateTaskOrders(cid, tasks.value.map(t => `${t.id}-${t.order}`).join(','))
}

onMounted(() => {
  $fetch('/api/channel/' + cid + '/get')
    .then((res) => {
      channel.value = res.data.channel
    })

  taskStore.fetchTasks(cid)
    .then((res) => {
      tasks.value = res.data.tasks
    })

  authStore.updateLastVisitedChannelId(cid)
})
</script>
