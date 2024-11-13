export default async function fetchMembers(projectId) {
  const response = await $fetch(`/api/app/project/members/${projectId}/fetch-members`)

  this.members[projectId] = response
  this.isInit['members-' + projectId] = true
  return response
}
