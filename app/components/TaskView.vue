<template>
  <div class="space-y-3">
    <div class="flex items-center gap-1 h-16 px-3">
      <UButton icon="i-heroicons-x-mark" size="sm" color="gray" square variant="ghost" @click="closeTaskView" />

      <div class="grow" />

      <UButton
        :icon="
          isCopiedTaskUrl
            ? 'i-heroicons-check-circle'
            : 'i-heroicons-clipboard-document-list'
        "
        size="sm"
        square
        color="white"
        variant="ghost"
        @click="onClickCopyTaskUrl"
      />

      <UButton
        icon="i-heroicons-arrow-top-right-on-square"
        size="sm"
        color="white"
        variant="ghost"
        square
        @click="openTaskInNewTab"
      />

      <UDropdown :items="taskMenu" :popper="{ placement: 'bottom-start' }">
        <UButton
          icon="i-heroicons-ellipsis-vertical"
          size="sm"
          color="white"
          variant="ghost"
          square
          @click="() => {}"
        />
      </UDropdown>
    </div>
    <div v-if="task" class="px-3 space-y-3">
      <UAlert
        v-if="task.archived"
        :actions="[
          { variant: 'solid', color: 'primary', label: 'Unarchive', click: onUnarchiveTask }
        ]"
        icon="i-heroicons-archive-box-20-solid"
        color="yellow"
        variant="outline"
        title="Archived"
        description="This task is archived. You can unarchive it by clicking the button below."
      />

      <div class="flex items-center gap-3 px-3 -my-2 text-xs text-gray-500 font-regular">
        <div class="flex items-center">
          Created by
          <div class="w-2" />
          <UAvatar class="mr-1" :src="task.createdByGithubAvatarUrl" :alt="task.createdByGithubUsername" size="xs" />
          <span class="text-gray-300">{{ task.createdByGithubUsername }}</span>
        </div>

        on
        <p class="text-gray-500">{{ useDateFormat(task.createdAt, 'YYYY-MM-DD HH:mm:ss') }}</p>
      </div>

      <UTextarea
        ref="refTitleTextarea"
        v-model="task.title"
        size="xl"
        :ui="{
          variant: {
            none: 'focus:ring-1 border border-gray-200 dark:border-gray-700 rounded-md'
          },
          size: {
            xl: 'text-2xl'
          }
        }"
        autoresize
        rows="1"
        placeholder="Enter task title"
        variant="none"
        @keyup="onChangeTaskTitle"
      />

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Assignee</p>
        </div>
        <div class="col-span-10 flex items-center h-full">
          <div class="grow" />
          <USelectMenu
            v-model="selectedAssignee"
            :loading="loadingSelectAssignee"
            :multiple="false"
            :searchable="searchAssignee" :ui="{
              variant: {
                none: 'focus:ring-1 w-fit'
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
                <UAvatar :src="selectedAssignee?.githubAvatarUrl" :alt="selectedAssignee?.githubUsername" size="xs" />
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
        <div class="col-span-10 flex items-center h-full">
          <div class="grow" />
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
            placeholder="Select status"
            :ui="{
              variant: {
                none: 'focus:ring-1 w-fit'
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
        <div class="col-span-10 flex items-center h-full">
          <div class="grow" />
          <UButton
            v-if="selectedDueDate"
            icon="i-heroicons-x-mark"
            size="xs"
            color="white"
            variant="ghost"
            square
            @click="selectedDueDate = null"
          />
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" variant="ghost" color="gray"
              :label="selectedDueDate ? format(selectedDueDate, 'd MMM, yyy') : 'Select due date'" />
            <template #panel="{ close }">
              <DatePicker v-model="selectedDueDate" :attributes="dateAttributes" is-required @close="close" />
            </template>
          </UPopover>
        </div>
      </div>

      <div class="px-4 space-y-1 mt-4">
        <UAccordion :items="[{label: `Attachments (${attachments.length})`, icon: 'i-heroicons-paper-clip' }]">
          <template #default="{ item, index, open }">
            <UButton color="gray" :variant="open ? 'solid' : 'ghost'" :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }">
              <template #leading>
                <div class="w-6 h-6 rounded-full flex items-center justify-center -my-1">
                  <UIcon :name="item.icon" class="w-4 h-4" />
                </div>
              </template>

              <span class="truncate">{{ item.label }}</span>

              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="w-5 h-5 ms-auto transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                />
              </template>
            </UButton>
          </template>
          <template #item="{ item }">
            <div v-if="item.label.startsWith('Attachments')">
              <div class="space-y-2 p-4">
                <div
                  v-for="attachment in attachments"
                  :key="'task-view-attachment-' + attachment.id"
                  class="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-1"
                >
                  <div class="flex items-center gap-2">
                    <UIcon v-if="attachment.fileType.startsWith('image/')" name="i-heroicons-photo"
                      class="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <UIcon v-else name="i-heroicons-document-text" class="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <p class="text-sm text-gray-300 truncate">{{ attachment.fileName }}</p>
                    <div class="grow"></div>
                    <UButton icon="i-heroicons-arrow-down-tray" size="xs" color="primary" square variant="soft"
                      :loading="downloadingAttachments.has(attachment.id)" @click="downloadAttachment(attachment.id)" />
                    <UButton icon="i-heroicons-trash" size="xs" color="red" square variant="soft"
                      :loading="deletingAttachments.has(attachment.id)" @click="ensureDeleteAttachment(attachment.id)" />
                  </div>
                  <div class="flex items-center gap-2 pl-7">
                    <p class="text-xs text-gray-500">{{ attachment.fileSize }}</p>
                    <div class="grow"></div>
                    <p class="text-xs text-gray-500">{{ attachment.fileType }}</p>
                  </div>
                </div>

                <div v-if="!attachments.length" class="text-center text-sm text-gray-500 py-4">
                  No attachments yet.
                </div>

                <UInput ref="refFileInput" type="file" multiple @change="(e) => onFileUpload(e)" />
              </div>
            </div>
          </template>
        </UAccordion>
      </div>

      <div class="px-4 space-y-1">
        <div class="h-2" />
        <p class="text-sm text-gray-500 font-regular">Description</p>
        <editor ref="elEditor" v-model="editDescription" class="description-editor" />
      </div>

      <div class="h-24"></div>
    </div>
  </div>

  <DialogsConfirm ref="refConfirmDialog" />
</template>

<script setup>
import { useDebounceFn, useClipboard } from '@vueuse/core'
import { useDateFormat } from '@vueuse/core'
import { format } from 'date-fns'
import { useTaskStore } from '@/store/task'
import { useChannelStore } from '@/store/channel'
const taskStore = useTaskStore()
const channelStore = useChannelStore()
const toast = useToast()

const props = defineProps({
  taskId: {
    type: Number,
    default: () => { return -1 }
  },
  cid: {
    type: String,
    default: () => { return '' }
  }
})

const emits = defineEmits(['close'])

const { copy: copyTaskUrl, copied: isCopiedTaskUrl } = useClipboard()
const onClickCopyTaskUrl = () => {
  copyTaskUrl(`${window.location.origin}/channel/${props.cid}/task/${props.taskId}`)
}

const refConfirmDialog = ref(null)
const refTitleTextarea = ref(null)
const hoverAttachmentId = ref(null)
const selectedAssignee = ref(null)
const selectedStatus = ref(null)
const selectedDueDate = ref(null)
const editDescription = ref('')
const loadingSelectAssignee = ref(false)
const isReady = ref(true)
const elEditor = ref(null)
const downloadingAttachments = ref(new Set())
const deletingAttachments = ref(new Set())
const assignees = computed(() => {
  return taskStore.assignees.filter(a => a.taskId === props.taskId)
})

const onArchiveTask = () => {
  if (!task.value.archived) {
    taskStore.updateTask(props.cid, props.taskId, { archived: true })
  }
}

const onChangeTaskTitle = useDebounceFn((e) => {
  console.log('onChangeTaskTitle::e', e.target.value)
  taskStore.updateTask(props.cid, props.taskId, { title: e.target.value })
}, 1500)

const onDeleteTask = () => {
  taskStore.deleteTask(props.cid, props.taskId)
    .then(() => {
      closeTaskView()
    })
    .catch((error) => {
      console.error(error)
    })
}

const taskMenu = [
  [
    {
      label: 'Archive',
      icon: 'i-heroicons-archive-box-20-solid',
      click: onArchiveTask
    }
  ],
  [
    {
      label: 'Delete Permanently',
      icon: 'i-heroicons-trash-20-solid',
      iconClass: 'bg-red-400',
      class: '!text-red-400',
      click: onDeleteTask
    }
  ]
]

const dateAttributes = [
  {
    dot: "green",
    dates: new Date()
  }
]

const task = computed({
  get: () => {
    return taskStore.getTask(+props.taskId)
  },
  set: (_) => {}
})

const onUnarchiveTask = () => {
  taskStore.updateTask(props.cid, props.taskId, { archived: false })
}

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

const attachments = ref([])

const fetchAttachments = async () => {
  try {
    const res = await taskStore.fetchTaskAttachments(props.cid, props.taskId)
    attachments.value = res
  } catch (error) {
    console.error('Error fetching attachments:', error)
  }
}

const refFileInput = ref(null)

const initAssignees = () => {
  setTimeout(async () => {
    try {
      isReady.value = false
      selectedAssignee.value = assignees.value[0]
      selectedStatus.value = task.value.status
      selectedDueDate.value = task.value.dueDate ? new Date(task.value.dueDate) : null
      editDescription.value = task.value.description
      if (elEditor.value) {
        elEditor.value.setContent(task.value.description)
      }
      await fetchAttachments()
      if (refFileInput.value) {
        refFileInput.value.input.value = null
      }
      refTitleTextarea.value?.textarea?.focus()
    } catch (error) {
      console.error('Error initializing task:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to initialize task details',
        color: 'red'
      })
    } finally {
      nextTick(() => {
        isReady.value = true
      })
    }
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
  useRouter().push({
    query: {
      task: null,
    },
  })
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
    taskStore.updateTask(props.cid, props.taskId, { dueDate: value ? value.toISOString() : null })
  }
})

const debouncedUpdateTask = useDebounceFn((value) => {
  taskStore.updateTask(props.cid, props.taskId, { description: value })
}, 1000)

watch(editDescription, (value) => {
  if (isReady.value) {
    debouncedUpdateTask(value)
  }
})

const openTaskInNewTab = () => {
  window.open(`/channel/${props.cid}/task/${props.taskId}`, '_blank')
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const validateFileSize = (files) => {
  const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
  return oversizedFiles;
};

const uploadFiles = async (files) => {
  const resolvers = files.map((file) => taskStore.uploadTaskAttachment(props.cid, props.taskId, file));
  const results = await Promise.allSettled(resolvers);
  return results;
};

const handleUploadResults = (results) => {
  const succeeded = results.filter((r) => r.status === 'fulfilled');
  const failed = results.filter((r) => r.status === 'rejected');

  succeeded.forEach((result) => {
    console.log('result::', result.value)
    attachments.value.push(result.value);
  });

  if (succeeded.length) {
    toast.add({
      title: 'Upload successful',
      description: `${succeeded.length} file(s) uploaded successfully`,
      color: 'green',
    });

    if (refFileInput.value) {
      refFileInput.value.input.value = null;
    }
  }

  if (failed.length) {
    toast.add({
      title: 'Upload failed',
      description: `${failed.length} file(s) failed to upload`,
      color: 'red',
    });
  }
};

const onFileUpload = async (Uploads) => {
  const files = Array.from(Uploads)
  if (!files.length) return;

  const oversizedFiles = validateFileSize(files);
  if (oversizedFiles.length) {
    toast.add({
      title: 'Files too large',
      description: `${oversizedFiles.map((file) => file.name).join(', ')} exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
      color: 'red',
    });
    return;
  }

  try {
    const results = await uploadFiles(files);
    handleUploadResults(results);
  } catch (error) {
    console.error('Error during file upload:', error);
    toast.add({
      title: 'Upload error',
      description: 'An error occurred while uploading files',
      color: 'red',
    });
  }
};

const downloadAttachment = (attachmentId) => {
  downloadingAttachments.value.add(attachmentId)

  taskStore.downloadTaskAttachment(props.cid, props.taskId, attachmentId)
    .catch((error) => {
      console.error('Error downloading attachment:', error)
      toast.add({
        title: 'Download failed',
        description: 'Failed to download attachment',
        color: 'red'
      })
    })
    .finally(() => {
      downloadingAttachments.value.delete(attachmentId)
    })
}

const ensureDeleteAttachment = (attachmentId) => {
  refConfirmDialog.value.open({
    title: 'Delete attachment',
    message: 'Are you sure you want to delete this attachment?',
    callback: (result) => {
      console.log('ensureDeleteAttachment::result', result)
      result && deleteAttachment(attachmentId)
    }
  })
}

const deleteAttachment = (attachmentId) => {
  deletingAttachments.value.add(attachmentId)

  taskStore.deleteTaskAttachment(props.cid, props.taskId, attachmentId)
    .then(() => {
      attachments.value = attachments.value.filter(a => a.id !== attachmentId)
      toast.add({
        title: 'Attachment deleted',
        description: 'File was successfully deleted',
        color: 'green'
      })
    })
    .catch((error) => {
      console.error('Error deleting attachment:', error)
      toast.add({
        title: 'Delete failed',
        description: 'Failed to delete attachment',
        color: 'red'
      })
    })
    .finally(() => {
      deletingAttachments.value.delete(attachmentId)
    })
}

const attachmentsContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const checkScrollability = () => {
  if (!attachmentsContainer.value) return

  const container = attachmentsContainer.value
  canScrollLeft.value = container.scrollLeft > 0
  canScrollRight.value = container.scrollLeft < container.scrollWidth - container.clientWidth
}

const scrollAttachments = (direction) => {
  if (!attachmentsContainer.value) return

  const container = attachmentsContainer.value
  const scrollAmount = 200 // Adjust scroll amount as needed

  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (attachmentsContainer.value) {
    checkScrollability()
    attachmentsContainer.value.addEventListener('scroll', checkScrollability)
    window.addEventListener('resize', checkScrollability)
  }
})

onUnmounted(() => {
  if (attachmentsContainer.value) {
    attachmentsContainer.value.removeEventListener('scroll', checkScrollability)
    window.removeEventListener('resize', checkScrollability)
  }
})

// Update checkScrollability when attachments change
watch(attachments, () => {
  nextTick(() => {
    checkScrollability()
  })
}, { deep: true })

defineExpose({
  cleanup,
  initAssignees
})
</script>

<style scoped>
.description-editor :deep(.ProseMirror) {
  min-height: auto !important;
  height: auto;
  padding: 0.5rem 0.75rem;
  border: 1px solid #374151;
  border-radius: 0.375rem;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
