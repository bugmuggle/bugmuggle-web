<template>
  <NuxtLayout name="task">
    <div class="w-full max-w-screen-sm mx-auto block m-4">
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              variant="ghost"
              color="gray"
              label="Go to channel"
              :to="`/channel/${cid}?task=${tid}`"
            />
            <div class="grow" />
          </div>
        </template>
        <div class="space-y-3">
          <p class="text-2xl font-regular">{{ task?.title }}</p>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 font-regular">Assigned to</p>
            <div class="inline-flex items-center gap-2">
              <UAvatar
                :src="assignees[0]?.githubAvatarUrl"
                :alt="assignees[0]?.githubUsername"
                size="xs"
              />
              <p class="text-sm font-regular">{{ assignees[0]?.githubUsername }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 font-regular">Status</p>
            <p class="text-sm font-regular">
              <UBadge
                v-if="task?.status"
                :color="
                  task?.status === 'To Do' ? 'gray' :
                  task?.status === 'In Progress' ? 'blue' :
                  task?.status === 'Pull Request' ? 'purple' :
                  task?.status === 'Testing' ? 'yellow' :
                  task?.status === 'Completed' ? 'green' :
                  task?.status === 'Blocked' ? 'red' :
                  'gray'
                "
              >
                {{ task?.status }}
              </UBadge>
              <p v-else class="text-sm text-gray-500 font-regular">No status</p>
            </p>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 font-regular">Due date</p>
            <UBadge v-if="task?.dueDate" color="gray">
              {{ format(task?.dueDate, 'd MMM, yyyy') }}
            </UBadge>
            <p v-else class="text-sm text-gray-500 font-regular">No due date</p>
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
                  </div>
                </div>
              </template>
            </UAccordion>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-gray-500 font-regular">Description</p>
            <editor ref="elEditor" readonly />
          </div>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { format } from 'date-fns'
import { useTaskStore } from '@/store/task'

definePageMeta({
  middleware: 'auth',
})

const elEditor = ref(null)
const tid = useRoute().params.tid
const cid = useRoute().params.cid

const task = ref(null)
const assignees = ref([])

const taskStore = useTaskStore()
const attachments = ref([])
const downloadingAttachments = ref(new Set())

const fetchAttachments = async () => {
  try {
    const res = await taskStore.fetchTaskAttachments(cid, tid)
    attachments.value = res
  } catch (error) {
    console.error('Error fetching attachments:', error)
  }
}
const downloadAttachment = (attachmentId) => {
  downloadingAttachments.value.add(attachmentId)

  taskStore.downloadTaskAttachment(cid, tid, attachmentId)
    .catch((error) => {
      console.error('Error downloading attachment:', error)
      toast.add({
        title: 'Download failed',
        description: 'Failed to download attachment',
        color: 'red',
      })
    })
    .finally(() => {
      downloadingAttachments.value.delete(attachmentId)
    })
}

onMounted(async () => {
  try {
    const response = await $fetch(`/api/channel/${cid}/tasks/${tid}/get`)
    task.value = response.data
    elEditor.value.setContent(task.value.description)

    const assigneesResponse = await $fetch(`/api/channel/${cid}/tasks/${tid}/assignments/get`)
    assignees.value = assigneesResponse.data.flat()
  } catch (error) {
    console.error(error)
  }

  await fetchAttachments()
})
</script>
