export default async function fetchProjectById (projectId) {
  const project = await $fetch(`/api/app/project/fetch-project-by-id?id=${projectId}`)

  this.isInit[projectId] = true

  const ti = this.getProjects.findIndex(project => project.id === projectId)

  if (ti > -1) {
    this.projects[ti] = project
  } else {
    this.projects.push(project)
  }

  return project
}
