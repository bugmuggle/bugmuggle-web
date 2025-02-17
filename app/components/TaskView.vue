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
    <div v-if="task" class="px-3">
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
          <p class="text-sm text-gray-500 font-medium">Assignees</p>
        </div>
        <div class="col-span-8">
          <USelectMenu
            v-model="selectedAssignee"
            :loading="loadingSelectAssignee"
            :searchable="searchAssignee"
            placeholder="Search for a user..."
            option-attribute="login"
            multiple
            trailing
            by="id"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <img :src="option.avatar_url" class="w-4 h-4 rounded-full" />
                <p>{{ option.login }}</p>
              </div>
            </template>
          </USelectMenu>
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
const loadingSelectAssignee = ref(false)

const searchAssignee = async (query) => {
  loadingSelectAssignee.value = true

  try {
    const users = await channelStore.getUsers(props.cid)
    return users
  } catch (error) {
    console.error(error)
  } finally {
    loadingSelectAssignee.value = false
  }
}

watch(() => props.taskId, (value) => {
  task.value = taskStore.getTask(value)
})

const closeTaskView = () => {
  emits('close')
}
</script>

