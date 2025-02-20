<template>
  <NuxtLayout name="app">
    <TaskPageWrapper ref="refTaskPageWrapper">
      <template #header>
        <div class="flex items-center h-full gap-3">
          <p class="text-sm font-medium">
            My Tasks
          </p>
          <UButton
            icon="i-heroicons-arrow-path"
            size="xs"
            color="gray"
            square
            variant="ghost"
            @click="taskStore.fetchMyTasks()"
          />
        </div>
      </template>

      <template #content>
        <div class="space-y-3">
          <tasks-list
            v-model="tasks"
            :my-tasks="true"
            @click:task="(id) => refTaskPageWrapper.openTaskView(id)"
          />
        </div>
      </template>
    </TaskPageWrapper>
  </NuxtLayout>
</template>

<script setup>
import { useTaskStore } from '~/store/task'

definePageMeta({
  middleware: 'auth',
})

const taskStore = useTaskStore()
const tasks = ref([])
const refTaskPageWrapper = ref(null)

onMounted(() => {
  refTaskPageWrapper.value.closeTaskView()
  taskStore.fetchMyTasks()
    .then((res) => {
      tasks.value = res.data.tasks
    })
})
</script>
