export default defineAuthEventHandler(async (event) => {
  const { updates } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  if (updates.dueDate) {
    updates.dueDate = new Date(updates.dueDate)
  }

  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  const task = await useDrizzle().update(tables.tasks)
    .set({
      ...updates,
      updatedAt: new Date(),
      updatedBy: user.id,
      createdByGithubAvatarUrl: tables.users.githubAvatarUrl,
      createdByGithubUsername: tables.users.githubUsername
    })
    .where(eq(tables.tasks.id, tid))
    .leftJoin(tables.users, eq(tables.tasks.createdBy, tables.users.id))
    .returning()

  return {
    success: true,
    data: task[0]
  }
})
