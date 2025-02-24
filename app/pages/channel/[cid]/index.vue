<template>
  <NuxtLayout name="app">
    <TaskPageWrapper ref="refTaskPageWrapper">
      <template #header>
        <div class="flex items-center h-full gap-3">
          <p class="text-sm font-medium">{{ channel?.name }}</p>
          <UButton
            icon="i-heroicons-arrow-path"
            size="xs"
            color="gray"
            square
            variant="ghost"
            :class="{ 'hover:!bg-transparent animate-spin': isFetching }"
            @click="refreshTasks()"
          />

          <div class="grow" />

          <UAvatarGroup size="xs" :max="2" @click="() => refManageChannelMembers.open()">
            <UAvatar
              v-for="member in members"
              :key="'appbar-member-display-' + member.id"
              :src="member.githubAvatarUrl"
              :alt="member.githubUsername"
            />
          </UAvatarGroup>

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
          <tasks-list
            v-model="tasks"
            @sort="onSort"
            @update:title="onUpdateTitle"
            @click:task="(id) => refTaskPageWrapper.openTaskView(id)"
          />

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
    </TaskPageWrapper>
  </NuxtLayout>

  <DialogsCreateTask ref="refCreateTask" />
  <DialogsManageChannelMembers ref="refManageChannelMembers" />
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { useTaskStore } from '~/store/task'
import { useChannelStore } from '~/store/channel'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const channelStore = useChannelStore()
const cid = route.params.cid

const channel = ref(null)
const tasks = ref([])
const refCreateTask = ref(null)
const refTaskPageWrapper = ref(null)
const refManageChannelMembers = ref(null)
const isFetching = ref(false)

const members = computed(() => channelStore.members)

const onSort = () => {
  taskStore.updateTaskOrders(cid, tasks.value.map(t => `${t.id}-${t.order}`).join(','))
}

const onUpdateTitle = (id, title) => {
  taskStore.updateTask(cid, id, { title })
}

const refreshTasks = async () => {
  isFetching.value = true
  try {
    const res = await taskStore.fetchTasks(cid)
    tasks.value = res.data.tasks
  }
  finally {
    isFetching.value = false
  }
}

onMounted(() => {
  refTaskPageWrapper.value.closeTaskView()
  $fetch('/api/channel/' + cid + '/get')
    .then((res) => {
      channel.value = res.data.channel
      useHead({
        title: `${res.data.channel.name} | Bugmuggle`,
      })
    })

  refreshTasks()
  taskStore.fetchTasks(cid)
    .then(() => {
      tasks.value = taskStore.getTasksByChannelId(cid)
    })

  authStore.updateLastVisitedChannelId(cid)
})
</script>
