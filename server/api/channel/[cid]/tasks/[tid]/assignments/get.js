export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  // query all assignments for the task and join with users table
  const assignment = await useDrizzle().select({
    id: tables.taskAssignees.id,
    userId: tables.taskAssignees.userId,
    taskId: tables.taskAssignees.taskId,
    createdAt: tables.taskAssignees.createdAt,
    updatedAt: tables.taskAssignees.updatedAt,
    githubUsername: tables.users.githubUsername,
    githubAvatarUrl: tables.users.githubAvatarUrl,
    githubId: tables.users.githubId,
  })
    .from(tables.taskAssignees)
    .leftJoin(tables.users, eq(tables.taskAssignees.userId, tables.users.id))
    .where(eq(tables.taskAssignees.taskId, tid))

  return {
    success: true,
    data: assignment
  }
})
