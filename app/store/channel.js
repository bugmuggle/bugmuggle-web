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

  const getChannel = async (cid) => {
    const res = await $fetch(`/api/channel/${cid}/get`)

    if (res.success) {
      channels.value = channels.value.map(channel => channel.id === cid ? res.data : channel)
      return res.data
    } else {
      return null
    }
  }

  const updateChannel = async (cid, updates) => {
    const res = await $fetch(`/api/channel/${cid}/update`, {
      method: 'POST',
      body: { updates },
    })

    if (res.success) {
      const ti = channels.value.findIndex(channel => channel.id === +cid)
      if (ti > -1) {
        channels.value[ti] = res.data
      }

      console.log('channels', channels.value)
    }
  }

  return { channels, members, fetchChannels, createChannel, getUsers, addMember, updateChannel, getChannel }
})
