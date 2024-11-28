export default async function addMember (projectId, data) {
  const response = await $fetch(`/api/app/project/members/${projectId}/add-member`, {
    method: 'POST',
    body: data
  })

  this.members[projectId].push(response)
  return response
}
