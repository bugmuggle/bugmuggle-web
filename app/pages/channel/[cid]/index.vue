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
          <UButton
            v-if="hasAnySelectedTasks"
            icon="i-heroicons-trash"
            size="xs"
            color="red"
            variant="outline"
            label="Delete Task(s)"
            @click="() => refTasksList.onDeleteTask()"
          />
          <UInput v-model="searchQuery" placeholder="Search tasks..." class="w-[300px]" />
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

          <UButton
            size="sm"
            color="gray"
            square
            variant="ghost"
            @click="connectGitHubRepo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from All by undefined - undefined --><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
            Connect
          </UButton>

          <UPopover>
            <UChip :show="hasFiltersApplied">
              <UButton color="gray" variant="ghost" square size="sm" icon="i-heroicons-funnel" />
            </UChip>

            <template #panel>
              <div class="p-4 w-64 space-y-3">
                <!-- <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-300">Show archived tasks</p>
                  <UToggle v-model="showArchivedTasks" color="primary" />
                </div> -->
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-300">Show completed tasks</p>
                  <UToggle v-model="showCompletedTasks" color="primary" />
                </div>

                <div class="space-y-2 w-full">
                  <p class="text-xs font-medium text-gray-400">Show tasks by</p>
                  <div class="space-y-2">
                    <UCheckbox
                      v-for="member in members"
                      :model-value="!hideTasksByGithubId[member.githubId]"
                      @update:model-value="() => hideTasksByGithubId[member.githubId] = !hideTasksByGithubId[member.githubId]"
                    >
                      <template #label>
                        <div class="flex items-center gap-2">
                          <UAvatar :src="member.githubAvatarUrl" :alt="member.githubUsername" size="2xs" />
                          <p class="text-sm font-medium text-gray-300">{{ member.githubUsername }}</p>
                        </div>
                      </template>
                    </UCheckbox>
                  </div>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </template>

      <template #content>
        <div class="space-y-3">
          <tasks-list
            ref="refTasksList"
            v-model="tasks"
            :showExtraColumns="showExtraColumns"
            @sort="onSort"
            @update:title="onUpdateTitle"
            @click:task="onClickTask"
            @has-any-selected-tasks="(v) => hasAnySelectedTasks = v"
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

          <div class="h-4" />
        </div>
      </template>
    </TaskPageWrapper>
  </NuxtLayout>

  <DialogsCreateTask ref="refCreateTask" @success="refreshTasks" />
  <DialogsManageChannelMembers ref="refManageChannelMembers" />
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { useTaskStore } from '~/store/task'
import { useChannelStore } from '~/store/channel'
import { useStorage as useStorageLocal } from '@vueuse/core'

const { user } = useUserSession()

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const channelStore = useChannelStore()
const cid = route.params.cid
const showExtraColumns = ref(true)

const refTasksList = ref(null)
const channel = ref(null)
const refCreateTask = ref(null)
const refTaskPageWrapper = ref(null)
const refManageChannelMembers = ref(null)
const isFetching = ref(false)
const showCompletedTasks = useStorageLocal('showCompletedTasks', true)
const showArchivedTasks = ref(false)
const hideTasksByGithubId = useStorageLocal('hideTasksByGithubId', {})
const searchQuery = ref('')
const hasAnySelectedTasks = ref(false)

const taskId = computed(() => route.query.task)

watch(taskId, (value) => {
  if (!value) {
    setTimeout(() => {
      showExtraColumns.value = true
    }, 100)
  } else {
    showExtraColumns.value = false
  }
})

const members = computed(() => channelStore.members)
const assignees = computed(() => {
  return taskStore.assignees
})

const processHideTasksByGithubId = computed(() => {
  return Object.keys(hideTasksByGithubId.value).filter(id => hideTasksByGithubId.value[id]).map(id => +id)
})

const hasFiltersApplied = computed(() => {
  return (
    !showCompletedTasks.value ||
    processHideTasksByGithubId.value.length !== members.value.length
  )
})

const tasks = computed({
  get() {
    return (taskStore.getTasksByChannelId(cid))
      .filter((t) => {
        if (!showCompletedTasks.value && t.status === 'Completed') {
          return false
        }
        if (searchQuery.value && !t.title.toLowerCase().includes(searchQuery.value.toLowerCase())) {
          return false
        }
        return true
      })
      .filter((t) => {
        const assignee = assignees.value.find(a => a.taskId === t.id)

        if (assignee) {
          return !processHideTasksByGithubId.value.includes(+assignee.githubId)
        }

        return true
      })
      .sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999))
  },
  set(_) {},
})

const onSort = () => {
  taskStore.updateTaskOrders(cid, tasks.value.map(t => `${t.id}-${t.order}`).join(','))
}

const onUpdateTitle = (id, title) => {
  taskStore.updateTask(cid, id, { title })
}

const onClickTask = (id) => {
  if (id) {
    refTaskPageWrapper.value.openTaskView(id)
    // Update query params
    useRouter().push({
      query: {
        task: id,
      },
    })
  }
}

const refreshTasks = async () => {
  isFetching.value = true
  try {
    await taskStore.fetchTasks(cid, { archived: showArchivedTasks.value })
    tasks.value = taskStore.getTasksByChannelId(cid)

    if (taskId.value) {
      refTaskPageWrapper.value.openTaskView(+taskId.value)
    }
  }
  finally {
    isFetching.value = false
  }
}

watchEffect(() => {
  showArchivedTasks.value;
  refreshTasks();
})

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
  authStore.updateLastVisitedChannelId(cid)
})

const connectGitHubRepo = () => {
  const { openInPopup } = useUserSession()
  openInPopup('/auth/github/repo?channelId=' + cid)
}
</script>
