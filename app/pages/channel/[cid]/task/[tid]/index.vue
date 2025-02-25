<template>
  <NuxtLayout name="task">
    <div class="w-full max-w-screen-sm mx-auto block m-4">
      <UCard>
        <TaskView :task-id="tid" :cid="cid" self-view />
      </UCard>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useTaskStore } from '~/store/task'

definePageMeta({
  middleware: 'auth',
})

const taskStore = useTaskStore()

const tid = useRoute().params.tid
const cid = useRoute().params.cid

const task = ref(null)

onMounted(() => {
  taskStore.fetchTaskById(cid, tid)
    .then((response) => {
      task.value = response
    })
})
</script>
