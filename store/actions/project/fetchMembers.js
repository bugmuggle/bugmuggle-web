export default async function fetchMembers(projectId) {
  const response = await $fetch(`/api/app/project/members/${projectId}/fetch-members`)

  const members = response.map(x => ({ ...x.project_members, ...x.users }))
  this.members[projectId] = members
  this.isInit['members-' + projectId] = true
  return members
}
