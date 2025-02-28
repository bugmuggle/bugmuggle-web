export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  // Delete all task assignments
  await useDrizzle().delete(tables.taskAssignees).where(eq(tables.taskAssignees.taskId, tid))

  // Delete task
  const deletedTask = await useDrizzle().delete(tables.tasks).where(eq(tables.tasks.id, tid)).returning()

  return {
    success: true,
    data: deletedTask[0],
  }
})
