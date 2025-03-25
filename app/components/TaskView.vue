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

        <div class="grow" />
        <p class="text-gray-500">{{ useDateFormat(task.createdAt, 'YYYY-MM-DD HH:mm:ss') }}</p>
      </div>

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
        @keyup="onChangeTaskTitle"
      />

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Assignee</p>
        </div>
        <div class="col-span-10">
          <USelectMenu v-model="selectedAssignee" :loading="loadingSelectAssignee" :multiple="false"
            :searchable="searchAssignee" :ui="{
              variant: {
                none: 'focus:ring-1'
              }
            }" placeholder="Search for a user..." option-attribute="githubUsername" trailing variant="none" by="id">
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
        <div class="col-span-10">
          <USelectMenu v-model="selectedStatus" :options="[
            'To Do',
            'In Progress',
            'Pull Request',
            'Testing',
            'Completed',
            'Blocked',
            'Cancelled'
          ]" :ui="{
            variant: {
              none: 'focus:ring-1'
            }
          }" variant="none" />
        </div>
      </div>

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Due date</p>
        </div>
        <div class="col-span-10">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" variant="ghost" color="gray"
              :label="selectedDueDate ? format(selectedDueDate, 'd MMM, yyy') : 'Select due date'" />

            <template #panel="{ close }">
              <DatePicker v-model="selectedDueDate" :attributes="dateAttributes" is-required @close="close" />
            </template>
          </UPopover>
        </div>
      </div>

      <div class="px-4 space-y-1">
        <div class="h-2" />
        <p class="text-sm text-gray-500 font-regular">Description</p>
        <editor ref="elEditor" v-model="editDescription" />
      </div>

      <div class="px-4 space-y-1 mt-4">
        <p class="text-sm text-gray-500 font-regular">Attachments</p>
        
        <div class="space-y-2">
          <div class="relative">
            <div class="flex items-center overflow-x-auto gap-3 scrollbar-hide" ref="attachmentsContainer">
              <div 
                v-for="attachment in attachments"
                :key="'task-view-attachment-' + attachment.id"
              >
                <UPopover :popper="{ placement: 'top-start' }" mode="hover">
                  <div
                    class="relative w-fit h-fit relative bg-zinc-800 rounded-md"
                    @mouseenter="hoverAttachmentId = attachment.id"
                    @mouseleave="hoverAttachmentId = null"
                    :name="attachment.fileName"
                  >
                    <div
                      v-if="attachment.thumbnailBase64Url"
                      class="w-24 h-24 bg-cover bg-center"
                      :style="{
                        backgroundImage: `url(${attachment.thumbnailBase64Url})`
                      }"
                    />
                    <div v-else class="flex items-center justify-center w-24 h-24">
                      <UIcon v-if="attachment.fileType.startsWith('image/')" name="i-heroicons-photo" class="w-10 h-10 text-gray-500" />
                      <UIcon v-else name="i-heroicons-document-text" class="w-10 h-10 text-gray-500" />
                    </div>
                    <div v-show="hoverAttachmentId === attachment.id" class="absolute top-0 right-0 bottom-0 left-0 bg-black bg-opacity-60">
                      <div class="flex items-center justify-center h-full">
                        <div class="inline-flex items-center gap-2">
                          <UButton
                            icon="i-heroicons-arrow-down-tray"
                            size="sm"
                            color="primary"
                            square
                            variant="soft"
                            @click="downloadAttachment(attachment.id)"
                          />
                          <UButton
                            icon="i-heroicons-trash"
                            size="sm"
                            color="red"
                            square
                            variant="soft"
                            @click="ensureDeleteAttachment(attachment.id)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <template #panel>
                    <UCard>
                      <div class="space-y-3">
                        <div class="flex items-center gap-2">
                          <p class="text-sm text-gray-600">File name</p>
                          <div class="grow" />
                          <p class="text-sm text-gray-300">{{ attachment.fileName }}</p>
                        </div>

                        <div class="flex items-center gap-2">
                          <p class="text-sm text-gray-600">File size</p>
                          <div class="grow" />
                          <p class="text-sm text-gray-300">{{ attachment.fileSize }}</p>
                        </div>

                        <div class="flex items-center gap-2">
                          <p class="text-sm text-gray-600">File type</p>
                          <div class="grow" />
                          <p class="text-sm text-gray-300">{{ attachment.fileType }}</p>
                        </div>
                      </div>
                    </UCard>
                  </template>
                </UPopover>
              </div>
            </div>
            
            <!-- Scroll indicators -->
            <div v-if="canScrollLeft" 
                 class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-900 to-transparent flex items-center justify-center">
              <UButton icon="i-heroicons-chevron-left" size="sm" color="white" variant="ghost" square 
                      @click="scrollAttachments('left')" />
            </div>
            <div v-if="canScrollRight" 
                 class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-900 to-transparent flex items-center justify-center">
              <UButton icon="i-heroicons-chevron-right" size="sm" color="white" variant="ghost" square 
                      @click="scrollAttachments('right')" />
            </div>
          </div>
          <UInput
            ref="refFileInput"
            type="file"
            multiple
            @change="(e) => onFileUpload(e)"
          />
        </div>
      </div>

      <div class="h-24" />
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
  taskStore.updateTask(props.cid, props.taskId, { title: e.target.value })
}, 1000)

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
    taskStore.updateTask(props.cid, props.taskId, { dueDate: value.toISOString() })
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
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;             /* Chrome, Safari and Opera */
}
</style>