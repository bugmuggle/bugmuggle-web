export default async function setProfilePic(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await $fetch('/api/app/user/set-profile-pic', {
    method: 'POST',
    body: formData
  })

  profilePicBase64.value[this.profile.value.id] = response
  return response
}
