export default async function deleteMember (userId, projectId) {
  await $fetch(`/api/app/project/members/${projectId}/delete-member`, {
    method: 'DELETE',
    body: {
      userId
    }
  })

  if (this.members?.[projectId]) {
    const ti = this.members[projectId].findIndex(x => x.userId === userId)
    if (ti > -1) {
      this.members[projectId].splice(ti, 1)
    }
  }

  return true
}
