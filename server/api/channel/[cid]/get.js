export default defineAuthEventHandler(async (event) => {
  const cid = event.context.params.cid
  const channel = await useDrizzle().select().from(tables.channels).where(eq(tables.channels.id, cid))
  return {
    success: true,
    data: {
      channel: channel[0],
    },
  }
})
