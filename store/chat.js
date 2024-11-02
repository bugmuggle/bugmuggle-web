import { defineStore } from 'pinia'
import sendMessage from './actions/chat/send-message'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isInit = ref({})

  const getMessages = computed(() => messages.value)

  const getInit = computed(() => isInit.value)

  return { messages, isInit, getMessages, getInit, sendMessage }
})
