<template>
  <div class="relative h-full w-full">
    <div class="z-5 absolute top-0 right-0 left-0 h-12 px-3 transition-all duration-300">
      <slot name="header" />
    </div>
    <div :class="[
      'z-5 absolute top-12 bottom-0 left-0 z-10 px-3 overflow-y-auto transition-all duration-300',
      taskViewOpen ? 'right-[700px]' : 'right-0'
    ]">
      <slot name="content" />
    </div>
    <div :class="[
      'z-10 absolute top-0 bottom-0 w-[700px] bg-neutral-900 transition-all duration-300 overflow-y-auto',
      taskViewOpen ? 'right-0' : '-right-[700px]'
    ]">
      <div class="h-full">
        <task-view
          ref="refTaskView"
          :task-id="taskViewId"
          :cid="cid"
          :task="task"
          :assignees="assignees"
          :attachments="attachments"
          :downloading-attachments="downloadingAttachments"
          :deleting-attachments="deletingAttachments"
          @close="closeTaskView"
          @update-task="handleUpdateTask"
          @update-task-assignees="handleUpdateTaskAssignees"
          @upload-attachment="handleUploadAttachment"
          @download-attachment="handleDownloadAttachment"
          @delete-attachment="handleDeleteAttachment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { useTaskStore } from '@/store/task'
import { useToast } from '#imports'

const taskStore = useTaskStore()
const toast = useToast()

const taskViewOpen = useStorage('bugmuggle-taskViewOpen', false)
const taskViewId = ref(null)
const refTaskView = ref(null)

const task = ref(null)
const assignees = computed(() => {
  return taskStore.assignees.filter(a => a.taskId === taskViewId.value)
})
const attachments = ref([])
const downloadingAttachments = ref(new Set())
const deletingAttachments = ref(new Set())

const cid = useRoute().params.cid

const fetchTask = async (id) => {
  try {
    task.value = await taskStore.getTask(+id)
  } catch (error) {
    console.error('Error fetching task:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to fetch task details',
      color: 'red',
    })
  }
}

const fetchAttachments = async (id) => {
  try {
    attachments.value = await taskStore.fetchTaskAttachments(cid, id)
  } catch (error) {
    console.error('Error fetching attachments:', error)
  }
}

const handleUpdateTask = async (updates) => {
  try {
    await taskStore.updateTask(cid, taskViewId.value, updates)
  } catch (error) {
    console.error('Error updating task:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update task',
      color: 'red',
    })
  }
}

const handleUpdateTaskAssignees = async (assigneeIds) => {
  try {
    await taskStore.updateTaskAssignees(cid, taskViewId.value, assigneeIds)
  } catch (error) {
    console.error('Error updating assignees:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update assignees',
      color: 'red',
    })
  }
}

const handleUploadAttachment = async (files) => {
  try {
    const results = await Promise.allSettled(
      files.map((file) => taskStore.uploadTaskAttachment(cid, taskViewId.value, file))
    )

    const succeeded = results.filter((r) => r.status === 'fulfilled')
    const failed = results.filter((r) => r.status === 'rejected')

    succeeded.forEach((result) => {
      attachments.value.push(result.value)
    })

    if (succeeded.length) {
      toast.add({
        title: 'Upload successful',
        description: `${succeeded.length} file(s) uploaded successfully`,
        color: 'green',
      })
    }

    if (failed.length) {
      toast.add({
        title: 'Upload failed',
        description: `${failed.length} file(s) failed to upload`,
        color: 'red',
      })
    }
  } catch (error) {
    console.error('Error uploading attachments:', error)
    toast.add({
      title: 'Upload error',
      description: 'An error occurred while uploading files',
      color: 'red',
    })
  }
}

const handleDownloadAttachment = async (attachmentId) => {
  downloadingAttachments.value.add(attachmentId)
  try {
    await taskStore.downloadTaskAttachment(cid, taskViewId.value, attachmentId)
  } catch (error) {
    console.error('Error downloading attachment:', error)
    toast.add({
      title: 'Download failed',
      description: 'Failed to download attachment',
      color: 'red',
    })
  } finally {
    downloadingAttachments.value.delete(attachmentId)
  }
}

const handleDeleteAttachment = async (attachmentId) => {
  deletingAttachments.value.add(attachmentId)
  try {
    await taskStore.deleteTaskAttachment(cid, taskViewId.value, attachmentId)
    attachments.value = attachments.value.filter(a => a.id !== attachmentId)
    toast.add({
      title: 'Attachment deleted',
      description: 'File was successfully deleted',
      color: 'green',
    })
  } catch (error) {
    console.error('Error deleting attachment:', error)
    toast.add({
      title: 'Delete failed',
      description: 'Failed to delete attachment',
      color: 'red',
    })
  } finally {
    deletingAttachments.value.delete(attachmentId)
  }
}

const openTaskView = async (id) => {
  taskViewOpen.value = true
  taskViewId.value = id
  await Promise.all([
    fetchTask(id),
    fetchAttachments(id),
  ])
  nextTick(() => {
    refTaskView.value?.init()
  })
}

const closeTaskView = () => {
  taskViewOpen.value = false
  taskViewId.value = null
  task.value = null
  attachments.value = []
  downloadingAttachments.value.clear()
  deletingAttachments.value.clear()
  refTaskView.value?.cleanup()
}

defineExpose({
  openTaskView,
  closeTaskView,
})
</script>
