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
        <task-view ref="refTaskView" :task-id="taskViewId" :cid="cid" @close="closeTaskView" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'

const taskViewOpen = useStorage('bugmuggle-taskViewOpen', false)
const taskViewId = ref(null)
const refTaskView = ref(null)

const cid = useRoute().params.cid

const openTaskView = (id) => {
  taskViewOpen.value = true
  taskViewId.value = id
  refTaskView.value.init()
}

const closeTaskView = () => {
  taskViewOpen.value = false
  taskViewId.value = null
  refTaskView.value.cleanup()
}

defineExpose({
  openTaskView,
  closeTaskView
})
</script>
