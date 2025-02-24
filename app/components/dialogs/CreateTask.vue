<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        Create a new task
      </template>

      <div class="space-y-3">
        <UInput v-model="name" label="Task Name" placeholder="Enter task name" />
        <UInput v-model="description" label="Description" placeholder="Enter task description" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" size="xs" label="Cancel" variant="ghost" @click="close" />
          <UButton color="primary" size="xs" label="Create" variant="solid" @click="createTask" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useTaskStore } from '~/store/task'

const emit = defineEmits(['success'])

const route = useRoute()
const cid = route.params.cid
const taskStore = useTaskStore()
const isOpen = ref(false)
const name = ref('')
const description = ref('')

const close = () => {
  isOpen.value = false
  name.value = ''
  description.value = ''
}

const open = () => {
  isOpen.value = true
}

const createTask = () => {
  taskStore.createTask(cid, name.value, description.value, 0)
    .then(() => {
      close()
      emit('success')
    })
    .catch((err) => {
      console.error(err)
    })
}

defineExpose({
  open,
  close
})
</script>
