<template>
  <Sortable
    :list="elements"
    item-key="id"
    tag="div"
    :options="options"
    @sort="onEnd"
  >
    <template #item="{element, index}">
      <div class="draggable" :data-id="element.id" :key="element.id">
        {{ element.name }} - {{ element.order }}
      </div>
    </template>
  </Sortable>
</template>

<script setup>
import { Sortable } from "sortablejs-vue3";

const elements = defineModel([])

const onEnd = (evt) => {
  const orderIds = Array.prototype.map.call(evt.to.children, function (item) {
    return item.getAttribute('data-id');
  })

   orderIds.forEach((id, idx) => {
    const ti = elements.value.findIndex(x => x.id === id)
    if (ti > -1) {
      elements.value[ti].order = idx
    }
  })
}
</script>
