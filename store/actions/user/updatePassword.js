export default async function updatePassword(currentPassword, newPassword) {
  await $fetch('/api/app/user/update-password', {
    method: 'POST',
    body: {
      currentPassword,
      newPassword
    }
  })
  
  return true
}
