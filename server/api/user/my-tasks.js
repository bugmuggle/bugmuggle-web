export default defineAuthEventHandler(async (event) => {
  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  const tasks = await useDrizzle()
    .select({
      ...tables.tasks,
      assigneeUserId: tables.taskAssignees.userId,
    })
    .from(tables.tasks)
    .innerJoin(tables.taskAssignees, eq(tables.tasks.id, tables.taskAssignees.taskId))
    .where(eq(tables.taskAssignees.userId, user.id))
    .orderBy(tables.tasks.order)

  return {
    success: true,
    data: { tasks },
  }
})
