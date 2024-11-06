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
            :from-user-id="message.fromUserId"
            :from-user="message.user"
            :created-at="formatDateMinimal(message.createdAt)"
            @open-profile="onViewProfile"
          />

        </div>
      </div>
      <div class="absolute right-0 bottom-0 left-0 h-auto max-h-[500px] overflow-y-auto border-t border-gray-700 bg-gray-900">
        <chat-compose @sent="scrollToBottom" />
      </div>
    </resolve-wrapper>
  </NuxtLayout>
</template>

<script setup>
import { useChatStore } from '@/store/chat'
import ViewProfile from '@/components/ViewProfile.vue'

useHead({
  title: 'Chat: BugMuggle'
})

const slideover = useSlideover()
const route = useRoute()
const chatStore = useChatStore()

const projectId = route.params.projectId

definePageMeta({
  middleware: 'auth'
})

const chatContainer = ref(null)

const messages = computed(() => (chatStore.getMessages || []).filter((x) => x.projectId === +projectId))

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const onViewProfile = (userId) => {
  slideover.open(ViewProfile, { userId })
}

onMounted(() => {
  chatStore.fetchMessages({ projectId })
    .finally(() => {
      scrollToBottom()
    })
  
  scrollToBottom()
})
</script>
