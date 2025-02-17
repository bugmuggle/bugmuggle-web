<template>
  <div class="flex items-start gap-0">
    <div class="w-8" />
    <div class="text-gray-600 text-sm w-full max-w-[100%] md:max-w-[600px] lg:max-w-[764px] pr-2">
      Task
    </div>
    <div class="w-12" />
    <p class="text-sm text-gray-600">
      Assignee
    </p>
    <div v-if="!taskViewOpen" class="grow" />
    <p v-if="!taskViewOpen" class="w-32 text-sm text-gray-600">
      Status
    </p>
  </div>
  <Sortable
    :list="elements"
    item-key="id"
    tag="div"
    :options="{
      handle: '.handle',
      filter: '.sortable-disabled'
    }"
    @sort="onSort"
  >
    <template #item="{element, index}">
      <div
        class="select-none flex items-center gap-3 border-b border-gray-700 h-10 px-3 hover:bg-neutral-800"
        :data-id="element.id" :key="element.id"
      >
        <div class="handle w-fit h-fit cursor-grab text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="5.5" cy="2.5" r=".75"/><circle cx="5.5" cy="8" r=".75"/><circle cx="5.5" cy="13.5" r=".75"/><circle cx="10.496" cy="2.5" r=".75"/><circle cx="10.496" cy="8" r=".75"/><circle cx="10.496" cy="13.5" r=".75"/></g></svg>
        </div>
        <input
          class="overflow-hidden bg-transparent text-sm w-full max-w-[100%] md:max-w-[600px] lg:max-w-[764px] pr-2 truncate"
          :value="element.title"
          @blur="(e) => emits('update:title', element.id, e.target.value)"
        />
        <UButton
          icon="i-heroicons-chevron-right"
          size="xs"
          color="white"
          square
          variant="soft"
          @click="() => emits('click:task', element.id)"
        />
        <div class="w-fit">
          <UAvatarGroup
            v-if="assignees.filter(a => a.taskId === element.id).length > 0"
            size="xs"
            @click="() => emits('click:task', element.id)"
          >
            <UAvatar
              v-for="assignee in assignees.filter(a => a.taskId === element.id)"
              :key="assignee.id"
              :src="assignee.githubAvatarUrl"
              :alt="assignee.githubUsername"
            />
          </UAvatarGroup>
          <div v-else @click="() => emits('click:task', element.id)">
            <UAvatar
              size="xs"
              icon="i-heroicons-exclamation-circle"
            />
          </div>
        </div>
        <div v-if="!taskViewOpen" class="grow" />
        <div v-if="!taskViewOpen" class="w-32">
          <UButton
            :color="
              element.status === 'Completed'
                ? 'green' : element.status === 'In Progress'
                ? 'blue' : element.status === 'Pull Request'
                ? 'orange' : element.status === 'Testing'
                ? 'purple' : element.status === 'Cancelled'
                ? 'red' : element.status === 'Blocked'
                ? 'red' : element.status === 'To Do'
                ? 'gray' : 'gray'"
            :label="element.status || 'None'"
            :icon="
              element.status === 'Completed'
                ? 'i-heroicons-check-circle' : element.status === 'In Progress'
                ? 'i-heroicons-clock' : null

            "
            :variant="
              ['Cancelled', null].includes(element.status)
                ? 'outline' : 'solid'
            "
            size="xs"
            block
            @click="() => emits('click:task', element.id)"
          />
        </div>
      </div>
    </template>
  </Sortable>
</template>

<script setup>
import { Sortable } from "sortablejs-vue3";
import { useTaskStore } from '@/store/task'
import { useStorage } from '@vueuse/core'

const taskViewOpen = useStorage('bugmuggle-taskViewOpen', false)
const taskStore = useTaskStore()
const elements = defineModel()
const emits = defineEmits(['sort', 'update:title', 'click:task'])

const assignees = computed(() => {
  return taskStore.assignees
})

const onSort = (evt) => {
  const orderIds = Array.prototype.map.call(evt.to.children, function (item) {
    return item.getAttribute('data-id');
  })

   orderIds.forEach((id, idx) => {
    const ti = elements.value.findIndex(x => `${x.id }`=== id)
    if (ti > -1) {
      elements.value[ti]['order'] = idx
    }
  })

  emits('sort')
}
</script>
