export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  const assignment = await useDrizzle().select().from(tables.taskAssignees).where(eq(tables.taskAssignees.taskId, tid))

  return {
    success: true,
    data: assignment
  }
})
