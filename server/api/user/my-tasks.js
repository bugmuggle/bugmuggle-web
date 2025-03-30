export default defineAuthEventHandler(async (event) => {
  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  const tasks = await useDrizzle()
    .select({
      ...tables.tasks,
      assigneeUserId: tables.taskAssignees.userId,
      createdByGithubAvatarUrl: tables.users.githubAvatarUrl,
      createdByGithubUsername: tables.users.githubUsername
    })
    .from(tables.tasks)
    .innerJoin(tables.taskAssignees, eq(tables.tasks.id, tables.taskAssignees.taskId))
    .leftJoin(tables.users, eq(tables.tasks.createdBy, tables.users.id))
    .where(eq(tables.taskAssignees.userId, user.id))
    .orderBy(tables.tasks.order)

  return {
    success: true,
    data: tasks
  }
})
