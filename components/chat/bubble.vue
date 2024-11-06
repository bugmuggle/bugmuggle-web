<template>
  <div class="flex items-start gap-3 pb-4">
    <div>
      <div class="w-12 h-12 bg-gray-700 rounded-md">
        <div class="flex items-center justify-center h-full">
          <p class="text-white text-2xl">{{ fullName.charAt(0) }}</p>
        </div>
      </div>
    </div>
    <div class="grow">
      <div class="flex items-center gap-2">
        <p class="tracking-wider font-bold">{{ fullName }}</p>
        <p class="text-xs text-gray-500">
          {{ createdAt }}
        </p>
      </div>
      <p class="text-sm" v-html="sanitizeHtml(message)" />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'

const { fullName } = useUserStore()

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
