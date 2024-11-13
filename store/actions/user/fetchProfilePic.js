import { useStorage } from '@vueuse/core'

export default async function fetchProfilePic(userId) {
  if (this.profilePicBase64[userId]) {
    return this.profilePicBase64[userId]
  }

  console.log('here::1')
  const response = await $fetch('/api/app/user/fetch-profile-pic?userId=' + userId)
  
  // Convert blob to base64
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(response)
  })

  this.profilePicBase64[userId] = base64
  return base64
}
