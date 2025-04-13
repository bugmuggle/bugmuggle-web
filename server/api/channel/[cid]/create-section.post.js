export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')

  const res = await useDrizzle()
    .insert(tables.sections)
    .values({
      channelId: cid,
      name: 'New Section',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()

  return {
    success: true,
    data: res[0]
  }
})