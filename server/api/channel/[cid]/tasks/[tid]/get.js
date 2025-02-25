export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const tid = getRouterParam(event, 'tid')

  const task = await useDrizzle().select().from(tables.tasks).where(eq(tables.tasks.id, tid))

  return {
    success: true,
    data: task[0],
  }
})
