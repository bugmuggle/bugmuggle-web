<template>
  <div class="flex items-start gap-3 pb-4">
    <div>
      <div class="w-12 h-12 bg-gray-700 rounded-md">
        <button
          class="block flex items-center justify-center h-full w-full"
          @click="onClickOpenProfile"
        >
          <img v-if="profilePicBase64" :src="profilePicBase64" class="w-full h-full object-cover" />
          <p v-else class="text-white text-3xl">
            <Icon name="i-heroicons-user" size="20" />
          </p>
        </button>
      </div>
    </div>
    <div class="grow">
      <div class="flex items-center gap-2">
        <button
          class="tracking-wider font-bold first-letter:uppercase"
          @click="onClickOpenProfile"
        >
          <span v-if="fromUser?.displayName">
            {{ fromUser?.displayName }}
          </span>
          <span v-else>
            {{ fromUser?.firstName || 'Unknown' }} {{ fromUser?.lastName || '' }}
          </span>
        </button>
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
const emits = defineEmits(['open-profile'])

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  fromUserId: {
    type: Number,
    default: () => 0
  },
  createdAt: {
    type: String,
    default: () => ''
  },
  fromUser: {
    type: Object,
    default: () => {}
  }
})

const profilePicBase64 = computed(() => {
  return useUserStore().getProfilePicBase64ByUserId(props.fromUserId)
})

const onClickOpenProfile = () => {
  emits('open-profile', props.fromUserId)
}
</script>
