<template>
  <div class="sticky top-0 z-10 bg-neutral-900 flex items-start gap-0">
    <div class="w-8" />
    <div class="text-gray-600 text-sm w-full max-w-[100%] md:max-w-[600px] lg:max-w-[764px] pr-2">
      <div class="flex items-center gap-2 pl-3">
        <UCheckbox v-model="selectAllTasks" />
        Task
      </div>
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
        class="select-none flex items-center gap-3 border-b border-gray-700 h-12 py-0 px-3"
        :data-id="element.id" :key="element.id"
        :class="[
          +taskId === element.id ? 'bg-primary/20 hover:bg-primary/40' : 'bg-transparent hover:bg-neutral-800'
        ]"
      >
        <div
          class="handle w-fit h-fit cursor-grab text-gray-500"
          :class="{ 'pointer-events-none opacity-50': readonly }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="5.5" cy="2.5" r=".75"/><circle cx="5.5" cy="8" r=".75"/><circle cx="5.5" cy="13.5" r=".75"/><circle cx="10.496" cy="2.5" r=".75"/><circle cx="10.496" cy="8" r=".75"/><circle cx="10.496" cy="13.5" r=".75"/></g></svg>
        </div>
        <div
          class="space-y-0.5 text-sm w-full h-full max-w-[100%] md:max-w-[600px] lg:max-w-[764px] pr-2"
        >
          <div class="flex items-center gap-2 h-full">
            <UCheckbox v-model="selectTaskById[element.id]" />
            <div class="flex items-center h-full w-full truncate"  @click="() => emits('click:task', element.id)">
              <p
                class="overflow-hidden bg-transparent w-full h-fit truncate block pl-1"
                :class="{ 'opacity-50': readonly, 'mb-5': element.dueDate }"
              >
                {{ element.title }}
              </p>
            </div>
          </div>
          <div class="relative flex items-center gap-1">
            <div class="absolute bottom-1 left-6">
              <UBadge
                v-if="element.dueDate"
                class="block w-fit"
                size="xs"
                color="orange"
                variant="soft"
              >
                {{ element.dueDateHero || '' }}
              </UBadge>
            </div>

            <UBadge
              v-if="element.archived"
              color="yellow" :ui="{ rounded: 'rounded-full' }"
              size="xs"
              variant="outline"
            >
              Archived
            </UBadge>
          </div>
        </div>
        <div v-if="!taskViewOpen" class="w-fit ml-6">
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
        <div v-if="!taskViewOpen" class="w-32" :class="[showExtraColumns ? 'visible': 'invisible']">
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

  <DialogsDeleteTasks ref="refDeleteTasks" />
</template>

<script setup>
import { Sortable } from "sortablejs-vue3";
import { useTaskStore } from '@/store/task'
import { useStorage } from '@vueuse/core'

defineProps({
  readonly: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  showExtraColumns: {
    type: Boolean,
    default: () => {
      return true
    }
  }
})

const route = useRoute()
const taskId = computed(() => route.query.task)

const refDeleteTasks = ref(null)
const selectAllTasks = ref(false)
const selectTaskById = ref({})
const taskViewOpen = useStorage('bugmuggle-taskViewOpen', false)
const taskStore = useTaskStore()
const elements = defineModel()
const emits = defineEmits(['sort', 'update:title', 'click:task', 'has-any-selected-tasks'])

watch(selectAllTasks, (value) => {
  selectTaskById.value = elements.value.reduce((acc, element) => {
    acc[element.id] = value
    return acc
  }, {})
})

const hasAnySelectedTasks = computed(() => {
  return Object.values(selectTaskById.value).some(value => value)
})

watch(hasAnySelectedTasks, (value) => {
  emits('has-any-selected-tasks', value)
})

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

const onDeleteTask = () => {
  refDeleteTasks.value.onBeforeDeleteTasks(
    Object.keys(selectTaskById.value).filter(key => selectTaskById.value[key]),
    () => {
      selectTaskById.value = {}
      selectAllTasks.value = false
    }
  )
}

defineExpose({
  onDeleteTask
})
</script>
