<template>
  <div class="flex items-start gap-0">
    <p class="w-full max-w-[800px] px-11 text-sm text-gray-500 pr-2">
      Task
    </p>
    <p class="w-full max-w-[800px] px-11 text-sm text-gray-500 pr-2">
      Assigned To
    </p>
  </div>
  <Sortable
    :list="elements"
    item-key="id"
    tag="div"
    :options="{
      handle: '.handle'
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
        <div
          class="text-sm text-gray-300 p-2 w-full max-w-[764px] pr-2 truncate"
          contenteditable
          v-text="element.title"
          @blur="(e) => emits('update:title', element.id, e.target.innerText)"
        />
        <UButton
          icon="i-heroicons-chevron-right"
          size="xs"
          color="white"
          square
          variant="soft"
          @click="() => emits('click:task', element.id)"
        />
      </div>
    </template>
  </Sortable>
</template>

<script setup>
import { Sortable } from "sortablejs-vue3";

const elements = defineModel()

const emits = defineEmits(['sort', 'update:title', 'click:task'])

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
