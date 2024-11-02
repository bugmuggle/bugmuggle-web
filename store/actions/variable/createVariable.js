export default async function (projectId, data) {
  const variable = await $fetch('/api/app/app//project/variables/' + projectId + '/create', {
    method: 'POST',
    body: data
  })
  this.list.push({
    projectId: +projectId,
    ...variable
  })

  return variable
}
