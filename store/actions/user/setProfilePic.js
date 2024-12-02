export default async function setProfilePic(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await $fetch('/api/app/user/set-profile-pic', {
    method: 'POST',
    body: formData
  })
  
  this.profilePicBase64[this.profile.id] = response
  this.profile = {
    ...this.profile,
    profilePicPath: 'images/dp-' + this.profile.id
  }
  return response
}
