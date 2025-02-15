import { defineStore } from 'pinia'

export const useChannelStore = defineStore('channelStore', () => {
  const channels = ref([])

  const fetchChannels = async () => {
    const res = await $fetch('/api/channel/all')
    channels.value = res.data.channels
  }

  return { channels, fetchChannels }
})
