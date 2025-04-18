export default defineAuthEventHandler(async (event) => {
  const { updates } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  if (updates.dueDate) {
    updates.dueDate = new Date(updates.dueDate)
  }

  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  const snapshotUpdateTask = await useDrizzle().update(tables.tasks)
    .set({
      ...updates,
      updatedAt: new Date(),
      updatedBy: user.id,
    })
    .where(eq(tables.tasks.id, tid))
    .returning()

  return {
    success: true,
    data: snapshotUpdateTask[0]
  }
})
