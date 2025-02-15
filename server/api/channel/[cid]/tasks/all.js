export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const tasks = await useDrizzle().select().from(tables.tasks).where(eq(tables.tasks.channelId, cid))
  return {
    success: true,
    data: { tasks },
  }
})
