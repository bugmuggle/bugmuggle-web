<template>
  <UModal
    v-model="isOpen"
    :ui="{ rounded: 'rounded-lg' }"
    :prevent-close="isLoading"
  >
    <UCard>
      <template #header>
        Delete Tasks
      </template>
      <div>
        <p class="text-gray-300">You are about to delete {{ deleteTaskIds.length }} tasks. This action cannot be undone. Click confirm to continue.</p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            :disabled="isLoading"
            label="Cancel"
            color="gray"
            variant="ghost"
            @click="() => isOpen = false"
          />
          <UButton
            :disabled="isLoading"
            :loading="isLoading"
            label="Confirm"
            icon="i-heroicons-trash"
            color="red"
            @click="() => onDeleteTasks()"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useTaskStore } from '@/store/task'

const taskStore = useTaskStore()
const isOpen = ref(false)
const isLoading = ref(false)
const cid = useRoute().params.cid

const deleteTaskIds = ref([])
const deleteCallback = ref(null)

const onBeforeDeleteTasks = (IDs = [], callback = null) => {
  deleteTaskIds.value = IDs
  deleteCallback.value = callback
  isOpen.value = true

}

watch(isOpen, (value) => {
  if (!value) {
    deleteTaskIds.value = []
    if (deleteCallback.value) {
      deleteCallback.value()
    }
  }
})

const onDeleteTasks = () => {
  isLoading.value = true

  const resolvers = []
  deleteTaskIds.value.forEach(id => {
    resolvers.push(taskStore.deleteTask(cid, id))
  })
  
  Promise.allSettled(resolvers)
    .then(() => {
      isLoading.value = false
      isOpen.value = false
    })
    .catch((error) => {
      // Show error toast
      console.error(error)
    })
    .finally(() => {
      isLoading.value = false
    })
}

defineExpose({
  onBeforeDeleteTasks
})
</script>
