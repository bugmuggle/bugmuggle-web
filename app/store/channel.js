import { defineStore } from 'pinia'

export const useChannelStore = defineStore('channelStore', () => {
  const channels = ref([])
  const members = ref([])

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
    members.value = res.data
    return res.data
  }

  const addMember = async (cid, username) => {
    const res = await $fetch(`/api/channel/${cid}/add-member`, {
      method: 'POST',
      body: { username },
    })

    if (res.success) {
      members.value.push(res.data)
    }

    return res.data
  }

  return { channels, members, fetchChannels, createChannel, getUsers, addMember }
})
