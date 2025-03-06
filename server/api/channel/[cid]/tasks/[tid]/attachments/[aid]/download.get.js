export default defineAuthEventHandler(async (event) => {
  const aid = getRouterParam(event, 'aid')
  
  const attachment = await useDrizzle()
    .select()
    .from(tables.taskAttachments)
    .where(eq(tables.taskAttachments.id, aid))
    .get()

  if (!attachment) {
    throw createError({ statusCode: 404, message: 'Attachment not found' })
  }

  const blob = await hubBlob().get(attachment.blobKey)
  if (!blob) {
    throw createError({ statusCode: 404, message: 'File not found' })
  }
  
  setHeaders(event, {
    'Content-Type': attachment.fileType,
    'Content-Disposition': `attachment; filename="${attachment.fileName}"`
  })

  return blob
})
