<template>
  <div class="relative h-full w-full">
    <div class="absolute top-0 right-0 left-0 h-12 px-3 transition-all duration-300">
      <slot name="header" />
    </div>
    <div :class="[
      'absolute top-12 bottom-0 left-0 z-10 px-3 overflow-y-auto transition-all duration-300',
      taskViewOpen ? 'right-[700px]' : 'right-0'
    ]">
      <slot name="content" />
    </div>
    <div :class="[
      'absolute top-0 bottom-0 w-[700px] bg-neutral-900 transition-all duration-300',
      taskViewOpen ? 'right-0' : '-right-[700px]'
    ]">
      <div class="h-full">
        <task-view :task-id="taskViewId" @close="closeTaskView" />
      </div>
    </div>
  </div>
</template>

<script setup>
const taskViewOpen = ref(false)
const taskViewId = ref(null)

const openTaskView = (id) => {
  taskViewOpen.value = true
  taskViewId.value = id
}

const closeTaskView = () => {
  taskViewOpen.value = false
  taskViewId.value = null
}

defineExpose({
  openTaskView,
  closeTaskView
})
</script>
