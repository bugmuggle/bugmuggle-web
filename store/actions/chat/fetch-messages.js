import { useUserStore } from '@/store/user'
import { useStorage } from '@vueuse/core'

export default async function fetchMessages({ projectId, limit }) {
  const storeUser = useUserStore()

  const lastMessage = this.messages.filter((x) => x.projectId === projectId).at(-1)
  const offsetId = lastMessage?.id

  const response = await $fetch(`/api/app/project/chat/${projectId}/fetch-messages`, {
    method: 'POST',
    body: { limit, offsetId }
  })

  response.forEach((message) => {
    if (this.messages.findIndex((x) => x.id === message.id) < 0) {
      this.messages.push(message)
      storeUser.fetchProfilePic(message.fromUserId)
    }
  })
}
