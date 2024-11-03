<template>
  <NuxtLayout name="app">
    <resolve-wrapper>
      <div class="absolute top-0 right-0 left-0 h-12">
        <project-header />
      </div>
      <div class="absolute top-12 right-0 bottom-32 left-0 overflow-auto" ref="chatContainer">
        <div class="h-full flex flex-col px-3">
          <div class="grow" />

          <chat-bubble
            v-for="message in messages"
            :key="`chat-bubble-${message.id}-${message.projectId}`"
            :message="message.message"
            :from-user="message.fromUser"
            :created-at="formatDateMinimal(message.createdAt)"
          />

        </div>
      </div>
      <div class="absolute right-0 bottom-0 left-0 h-32 border-t border-gray-700">
        <chat-compose />
      </div>
    </resolve-wrapper>
  </NuxtLayout>
</template>

<script setup>
import { useChatStore } from '@/store/chat'

useHead({
  title: 'Chat: BugMuggle'
})

const route = useRoute()
const chatStore = useChatStore()

const projectId = route.params.projectId

definePageMeta({
  middleware: 'auth'
})

const chatContainer = ref(null)

const messages = computed(() => (chatStore.getMessages || []).filter((x) => x.projectId === +projectId))

onMounted(() => {
  chatStore.fetchMessages({ projectId })
  
  // Scroll to bottom
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
})
</script>
