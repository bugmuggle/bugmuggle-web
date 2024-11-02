export default async function () {
  const projects = await $fetch('/api/app/project/fetch-all')
  this.isReady = true

  if (projects.length === 0) {
    return 0
  }

  // Clear existing projects and replace with new data
  this.projects = projects

  return projects.length
}
