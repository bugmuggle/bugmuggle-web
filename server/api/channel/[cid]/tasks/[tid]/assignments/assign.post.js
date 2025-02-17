export default defineAuthEventHandler(async (event) => {
  const { assigneeIds } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  await useDrizzle().delete(tables.taskAssignees)
    .where(eq(tables.taskAssignees.taskId, tid))

  const resolver = []
  assigneeIds.forEach(async (assigneeId) => {
    resolver.push(useDrizzle().insert(tables.taskAssignees)
      .values({
        taskId: tid,
        userId: assigneeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    )
  })

  const results = (await Promise.allSettled(resolver))
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)

  return {
    success: true,
    data: results.flat()
  }
})
