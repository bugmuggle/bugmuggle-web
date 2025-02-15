<template>
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
      <div class="select-none flex items-center gap-3 border-b border-gray-700 h-10 px-3 hover:bg-neutral-800" :data-id="element.id" :key="element.id">
        <div class="handle w-fit h-fit cursor-grab text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="5.5" cy="2.5" r=".75"/><circle cx="5.5" cy="8" r=".75"/><circle cx="5.5" cy="13.5" r=".75"/><circle cx="10.496" cy="2.5" r=".75"/><circle cx="10.496" cy="8" r=".75"/><circle cx="10.496" cy="13.5" r=".75"/></g></svg>
        </div>
        <div class="text-sm text-gray-300 p-2 w-full" contenteditable>{{ element.title }}</div>
      </div>
    </template>
  </Sortable>
</template>

<script setup>
import { Sortable } from "sortablejs-vue3";

const elements = defineModel()

const emits = defineEmits(['sort'])

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
