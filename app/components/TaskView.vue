<template>
  <div class="space-y-3">
    <div class="flex items-center gap-3 h-12 px-3">
      <UButton
        icon="i-heroicons-x-mark"
        size="sm"
        color="gray"
        square
        variant="solid"
        @click="closeTaskView"
      />
    </div>
    <div v-if="task" class="px-3 space-y-3">
      <UTextarea
        v-model="task.title"
        size="xl"
        :ui="{
          variant: {
            none: 'focus:ring-1'
          },
          size: {
            xl: 'text-2xl h-fit'
          }
        }"
        autoresize
        placeholder="Enter task title"
        variant="none"
      />

      <div class="grid grid-cols-12 gap-3 px-4">
        <div class="col-span-4">
          <p class="text-sm text-gray-500 font-medium">Assignee</p>
        </div>
        <div class="col-span-8">
          <USelectMenu
            v-model="selectedAssignee"
            :loading="loadingSelectAssignee"
            :searchable="searchAssignee"
            placeholder="Search for a user..."
            option-attribute="githubUsername"
            :multiple="false"
            trailing
            by="id"
          >
            <template #label>
              <div v-if="selectedAssignee" class="flex items-center gap-2">
                <!--<UAvatarGroup v-if="[selectedAssignee]?.length > 0" size="xs" :max="6">
                  <UAvatar
                    v-for="assignee in [selectedAssignee]"
                    :key="assignee.id"
                    :src="assignee.githubAvatarUrl"
                    :alt="assignee.githubUsername"
                  />
                </UAvatarGroup> 
                <div v-else>
                  <p class="text-sm text-gray-500">No assignees</p>
                </div> -->
                <UAvatar
                  :src="selectedAssignee?.githubAvatarUrl"
                  :alt="selectedAssignee?.githubUsername"
                  size="xs"
                />
                <p class="text-sm text-gray-500">{{ selectedAssignee?.githubUsername }}</p>
              </div>
              <div v-else>
                <p class="text-sm text-gray-500">No assignee</p>
              </div>
            </template>
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <img :src="option.githubAvatarUrl" class="w-4 h-4 rounded-full" />
                <p>{{ option.githubUsername }}</p>
              </div>
            </template>
          </USelectMenu>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-3 px-4">
        <div class="col-span-4">
          <p class="text-sm text-gray-500 font-medium">Status</p>
        </div>
        <div class="col-span-8">
          <USelectMenu v-model="selectedStatus" :options="[
            'To Do',
            'In Progress',
            'Pull Request',
            'Testing',
            'Completed',
            'Blocked',
            'Cancelled'
          ]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '@/store/task'
import { useChannelStore } from '@/store/channel'
const taskStore = useTaskStore()
const channelStore = useChannelStore()

const props = defineProps({
  taskId: {
    type: String,
    default: () => { return '' }
  },
  cid: {
    type: String,
    default: () => { return '' }
  }
})

const emits = defineEmits(['close'])

const task = ref(null)
const selectedAssignee = ref(null)
const selectedStatus = ref(null)
const loadingSelectAssignee = ref(false)
const isReady = ref(true)

const assignees = computed(() => {
  return taskStore.assignees.filter(a => a.taskId === props.taskId)
})

const searchAssignee = async (query) => {
  loadingSelectAssignee.value = true

  try {
    const users = await channelStore.getUsers(props.cid)
    return users.filter(user => user.githubUsername.toLowerCase().includes(query.toLowerCase()))
  } catch (error) {
    console.error(error)
  } finally {
    loadingSelectAssignee.value = false
  }
}

watch(() => props.taskId, (value) => {
  task.value = taskStore.getTask(value)
})

const initAssignees = () => {
  setTimeout(() => {
    isReady.value = false
    selectedAssignee.value = assignees.value[0]
    selectedStatus.value = task.value.status
    nextTick(() => {
      isReady.value = true
    })
  }, 100)
}

const cleanup = () => {
  isReady.value = false
  selectedAssignee.value = null
  nextTick(() => {
    isReady.value = true
  })
}

const closeTaskView = () => {
  emits('close')
}

watch(selectedAssignee, (value) => {
  if (isReady.value) {
    // taskStore.updateTaskAssignees(props.cid, props.taskId, value.map(a => a.id))
    taskStore.updateTaskAssignees(props.cid, props.taskId, [value.id])
  }
})

watch(selectedStatus, (value) => {
  if (isReady.value) {
    taskStore.updateTask(props.cid, props.taskId, { status: value })
  }
})

defineExpose({
  cleanup,
  initAssignees
})
</script>

