export default async function clearProfilePic() {
  await $fetch('/api/app/user/clear-profile-pic', {
    method: 'POST'
  })

  if (this.profile?.id) {
    delete this.profilePicBase64[this.profile.id]
  }
  
  return true
}
