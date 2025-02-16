export default defineAuthEventHandler(async (event) => {
  const { userId } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  const task = await useDrizzle().insert(tables.taskAssignees)
    .values({
      taskId: tid,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return {
    success: true,
    data: task[0]
  }
})
