export default async function (projectId, variableId) {
  await $fetch('/api/app/project/variables/' + projectId + '/delete', {
    method: 'DELETE',
    body: {
      variableId
    }
  })

  const ti = this.list.findIndex(item => item.id === variableId)
  if (ti > -1) {
    this.list.splice(ti, 1)
  }

  return true
}
