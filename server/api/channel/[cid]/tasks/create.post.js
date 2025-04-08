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

  // Fetch the complete task data with creator information
  const completeTask = await useDrizzle()
    .select({
      ...tables.tasks,
      createdByGithubAvatarUrl: tables.users.githubAvatarUrl,
      createdByGithubUsername: tables.users.githubUsername,
    })
    .from(tables.tasks)
    .where(eq(tables.tasks.id, task[0].id))
    .leftJoin(tables.users, eq(tables.tasks.createdBy, tables.users.id))

  return {
    success: true,
    data: { task: completeTask[0] },
  }
})
