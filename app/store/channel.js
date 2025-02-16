import { defineStore } from 'pinia'

export const useChannelStore = defineStore('channelStore', () => {
  const channels = ref([])

  const fetchChannels = async () => {
    const res = await $fetch('/api/channel/all')
    channels.value = res.data.channels
  }

  const createChannel = async (name) => {
    const res = await $fetch('/api/channel/create', {
      method: 'POST',
      body: { name },
    })

    if (res.success) {
      channels.value.push(res.data.channel)
    }
  }

  const getUsers = async (cid) => {
    const res = await $fetch(`/api/channel/${cid}/get-users`)
    return res.data
  }

  return { channels, fetchChannels, createChannel, getUsers }
})
