<template>
  <div class="flex items-start gap-3 pb-4">
    <div>
      <div class="w-12 h-12 bg-black rounded-md" />
    </div>
    <div class="grow">
      <div class="flex items-center gap-2">
        <p class="tracking-wider font-bold">Sai K K</p>
        <p class="text-xs text-gray-500">
          {{ createdAt }}
        </p>
      </div>
      <p class="text-sm" v-html="sanitizeHtml(message)" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  fromUser: {
    type: Object,
    default: () => ({})
  },
  createdAt: {
    type: String,
    default: () => ''
  }
})
</script>
