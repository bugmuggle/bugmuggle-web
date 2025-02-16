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
            xl: 'text-2xl'
          }
        }"
        autoresize
        placeholder="Enter task title"
        variant="none"
      />
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '@/store/task'

const taskStore = useTaskStore()

const props = defineProps({
  taskId: {
    type: String,
    default: () => { return '' }
  }
})

const emits = defineEmits(['close'])

const task = ref(null)

watch(() => props.taskId, (value) => {
  task.value = taskStore.getTask(value)
})

const closeTaskView = () => {
  emits('close')
}
</script>

