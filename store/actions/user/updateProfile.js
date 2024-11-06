export default async function updateProfile (updates) {
  await $fetch('/api/app/user/update-profile', {
    method: 'POST',
    body: updates
  })

  this.profile = {
    ...this.profile,
    ...updates
  }
}
