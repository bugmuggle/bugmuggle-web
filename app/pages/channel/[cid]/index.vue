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
            v-model="tasks"
            :showExtraColumns="showExtraColumns"
            @sort="onSort"
            @update:title="onUpdateTitle"
            @click:task="onClickTask"
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

const channel = ref(null)
const refCreateTask = ref(null)
const refTaskPageWrapper = ref(null)
const refManageChannelMembers = ref(null)
const isFetching = ref(false)
const showCompletedTasks = useStorageLocal('showCompletedTasks', true)
const showArchivedTasks = ref(false)
const hideTasksByGithubId = useStorageLocal('hideTasksByGithubId', {})
const searchQuery = ref('')

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
</script>
