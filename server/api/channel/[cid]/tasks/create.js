export default defineAuthEventHandler(async (event) => {
  const { name, description, priority } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  const task = await useDrizzle().insert(tables.tasks).values({
    title: name,
    description,
    priority,
    createdBy: user.id,
    channelId: cid,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning()

  return {
    success: true,
    data: { task: task[0] },
  }
})
