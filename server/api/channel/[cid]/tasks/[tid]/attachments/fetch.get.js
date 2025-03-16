export default defineAuthEventHandler(async (event) => {
  const tid = getRouterParam(event, 'tid')
  
  const attachments = await useDrizzle()
    .select()
    .from(tables.taskAttachments)
    .where(eq(tables.taskAttachments.taskId, tid))

  const asyncResolveThumbnailAttachments = []
  attachments.forEach(attachment => {
    if (attachment.thumbnailBlobKey) {
      asyncResolveThumbnailAttachments.push(resolveThumbnailAttachment(attachment))
    }
  })

  const resolvedThumbnailAttachments = (await Promise.allSettled(asyncResolveThumbnailAttachments))
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => result.value)

  const resolvedBase64UrlAttachments = []
  resolvedThumbnailAttachments.forEach(async (attachment) => {
    const thumbnailAttachment = attachments.findIndex(a => a.id === attachment.attachmentId)
    if (thumbnailAttachment > -1) {
      resolvedBase64UrlAttachments.push((async () => {
        return {
          base64Url: await getBase64UrlFromBlob(attachment.thumbnail, attachment.fileType),
          attachmentId: attachment.attachmentId
        }
      })())
    }
  })

  const resolvedAttachments = (await Promise.allSettled(resolvedBase64UrlAttachments))
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => result.value)

  resolvedAttachments.forEach((attachment, index) => {
    const attachmentIndex = attachments.findIndex(a => a.id === attachment.attachmentId)
    if (attachmentIndex > -1) {
      attachments[attachmentIndex]['thumbnailBase64Url'] = attachment.base64Url
    }
  })

  return {
    success: true,
    data: attachments
  }
})
