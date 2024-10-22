export default async function (payload) {
  const { name } = payload

  const project = await $fetch('/api/app/project/create', {
    method: 'POST',
    body: { name }
  })

  this.projects.push(project)
  return project
}
