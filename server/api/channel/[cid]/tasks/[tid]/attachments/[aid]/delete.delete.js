export default defineAuthEventHandler(async (event) => {
  const aid = getRouterParam(event, 'aid')
  
  const attachment = await useDrizzle()
    .delete(tables.taskAttachments)
    .where(eq(tables.taskAttachments.id, aid))
    .returning()

  if (attachment.length > 0) {
    await hubBlob().delete(attachment[0].blobKey).catch(console.error)
  }

  if (attachment[0].thumbnailBlobKey) {
    await hubBlob().delete(attachment[0].thumbnailBlobKey).catch(console.error)
  }

  return {
    success: true,
    data: attachment[0]
  }
})
