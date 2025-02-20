<template>
  <div class="space-y-3 overflow-y-auto">
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

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Assignee</p>
        </div>
        <div class="col-span-10">
          <USelectMenu
            v-model="selectedAssignee"
            :loading="loadingSelectAssignee"
            :multiple="false"
            :searchable="searchAssignee"
            :ui="{
              variant: {
                none: 'focus:ring-1'
              }
            }"
            placeholder="Search for a user..."
            option-attribute="githubUsername"
            trailing
            variant="none"
            by="id"
          >
            <template #label>
              <div v-if="selectedAssignee" class="flex items-center gap-2">
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

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Status</p>
        </div>
        <div class="col-span-10">
          <USelectMenu
            v-model="selectedStatus"
            :options="[
              'To Do',
              'In Progress',
              'Pull Request',
              'Testing',
              'Completed',
              'Blocked',
              'Cancelled'
            ]"
            :ui="{
              variant: {
                none: 'focus:ring-1'
              }
            }"
            variant="none"
          />
        </div>
      </div>

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Due date</p>
        </div>
        <div class="col-span-10">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton 
              icon="i-heroicons-calendar-days-20-solid" 
              variant="ghost" 
              color="gray" 
              :label="selectedDueDate ? format(selectedDueDate, 'd MMM, yyy') : 'Select due date'" 
            />

            <template #panel="{ close }">
              <DatePicker v-model="selectedDueDate" is-required @close="close" />
            </template>
          </UPopover>
        </div>
      </div>

      <div class="px-4 space-y-1">
        <div class="h-2" />
        <p class="text-sm text-gray-500 font-regular">Description</p>
        <editor v-model="editDescription" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
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
const selectedDueDate = ref(null)
const editDescription = ref('')
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
    selectedDueDate.value = task.value.dueDate ? new Date(task.value.dueDate) : null
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

watch(selectedDueDate, (value) => {
  if (isReady.value) {
    taskStore.updateTask(props.cid, props.taskId, { dueDate: value.toISOString() })
  }
})

defineExpose({
  cleanup,
  initAssignees
})
</script>

<style>
.tiptap :first-child {
  margin-top: 0;
}

.tiptap pre {
  background: #292929;
  border-radius: 0.5rem;
  color: var(--white);
  font-family: 'JetBrainsMono', monospace;
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
}

.tiptap code {
  background: #2d2d2d;
  border-radius: 0.25rem;
  color: #e4e4e4;
  padding: 0.2rem 0.4rem;
}

.tiptap pre code {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
}

/* Code styling */
.tiptap pre .hljs-comment,
.tiptap pre .hljs-quote {
  color: #616161;
}

.tiptap pre .hljs-variable,
.tiptap pre .hljs-template-variable,
.tiptap pre .hljs-attribute,
.tiptap pre .hljs-tag,
.tiptap pre .hljs-name,
.tiptap pre .hljs-regexp,
.tiptap pre .hljs-link,
.tiptap pre .hljs-name,
.tiptap pre .hljs-selector-id,
.tiptap pre .hljs-selector-class {
  color: #f98181;
}

.tiptap pre .hljs-number,
.tiptap pre .hljs-meta,
.tiptap pre .hljs-built_in,
.tiptap pre .hljs-builtin-name,
.tiptap pre .hljs-literal,
.tiptap pre .hljs-type,
.tiptap pre .hljs-params {
  color: #fbbc88;
}

.tiptap pre .hljs-string,
.tiptap pre .hljs-symbol,
.tiptap pre .hljs-bullet {
  color: #b9f18d;
}

.tiptap pre .hljs-title,
.tiptap pre .hljs-section {
  color: #faf594;
}

.tiptap pre .hljs-keyword,
.tiptap pre .hljs-selector-tag {
  color: #70cff8;
}

.tiptap pre .hljs-emphasis {
  font-style: italic;
}

.tiptap pre .hljs-strong {
  font-weight: 700;
}

/* Add blockquote styling */
.tiptap blockquote {
  border-left: 3px solid #4a5568;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #e6e6e6;
}
</style>

