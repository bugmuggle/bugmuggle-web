export default defineAuthEventHandler(async (event) => {
  const { name, description, priority } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  // Insert the task and return its ID
  const [insertedTask] = await useDrizzle().insert(tables.tasks).values({
    title: name,
    description,
    priority,
    createdBy: user.id,
    channelId: cid,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning({ id: tables.tasks.id })

  if (!insertedTask?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create task' })
  }

  // Fetch the newly created task with user details
  const [task] = await useDrizzle().select({
    ...tables.tasks,
    createdByGithubAvatarUrl: tables.users.githubAvatarUrl,
    createdByGithubUsername: tables.users.githubUsername,
  })
  .from(tables.tasks)
  .where(eq(tables.tasks.id, insertedTask.id))
  .leftJoin(tables.users, eq(tables.tasks.createdBy, tables.users.id))

  return {
    success: true,
    data: { task },
  }
})
