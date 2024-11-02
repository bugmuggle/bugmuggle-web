export default async function (projectId) {
  const variables = await $fetch('/api/app/project/variables/' + projectId + '/fetch-all')
  this.isReady[projectId] = true

  if (variables.length === 0) {
    return 0
  }

  variables.forEach(variable => {
    const ti = this.list.findIndex(x => x.id === variable.id)

    if (ti < 0) {
      this.list.push(variable)
    } else {
      this.list[ti] = variable
    }
  })

  return variables.length
}
