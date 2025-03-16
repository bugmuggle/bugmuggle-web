export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  const task = await useDrizzle()
    .select({
      ...tables.tasks,
      createdByGithubAvatarUrl: tables.users.githubAvatarUrl,
      createdByGithubUsername: tables.users.githubUsername
    })
    .from(tables.tasks)
    .where(eq(tables.tasks.id, tid))
    .leftJoin(tables.users, eq(tables.tasks.createdBy, tables.users.id))

  return {
    success: true,
    data: task[0],
  }
})
