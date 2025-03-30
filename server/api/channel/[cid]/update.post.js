import { eq } from 'drizzle-orm'

export default defineAuthEventHandler(async (event) => {
  const { updates } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  console.log('updates', updates)

  const updatedChannel = await useDrizzle().update(tables.channels)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(tables.channels.id, cid))
    .returning()

  if (!updatedChannel || updatedChannel.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Channel not found or update failed',
    })
  }

  return {
    success: true,
    data: updatedChannel[0],
  }
})
