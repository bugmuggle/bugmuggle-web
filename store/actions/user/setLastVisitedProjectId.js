export default async function setLastVisitedProjectId(projectId) {
  await $fetch('/api/app/user/update-preference', {
    method: 'POST',
    body: {
      preference: 'lastVisitedProjectId',
      value: projectId,
    },
  })

  this.preferences.lastVisitedProjectId = projectId
  return true
}
