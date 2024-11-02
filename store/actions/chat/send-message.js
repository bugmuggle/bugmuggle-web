

export default async function sendMessage(message, projectId) {
  const newMessage = await $fetch(`/api/app/project/chat/${projectId}/send-message`, {
    method: 'POST',
    body: {
      message
    }
  })

  console.log('newMessage', newMessage)
  this.messages.push(newMessage)
  return newMessage
}
