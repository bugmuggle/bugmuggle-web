export default defineAuthEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file')
    
    if (!file) {
      throw createError({ statusCode: 400, message: 'Invalid file upload' })
    }

    const tid = getRouterParam(event, 'tid')
    const githubId = (await getUserSession(event)).user.githubId
    const user = await getUserByGithubId(githubId)

    const arrayBuffer = await file.arrayBuffer()
    const blobKey = `tasks/${tid}/attachments/${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    
    await hubBlob().put(blobKey, file, {
      type: file.type,
      metadata: {
        fileName: file.name
      }
    })

    // Generate thumbnail for images and PDFs
    let thumbnailBlobKey = null
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      try {
        // Create a thumbnail using jimp or other image processing library
        const thumbnailBuffer = await generateThumbnail(arrayBuffer, file.type)
        thumbnailBlobKey = `${blobKey}-thumbnail`
        
        await hubBlob().put(thumbnailBlobKey, new File([thumbnailBuffer], file.name + '-thumbnail', { type: file.type }), {
          type: file.type,
          metadata: {
            fileName: file.name + '-thumbnail'
          }
        })
      } catch (thumbError) {
        console.error('Thumbnail generation error:', thumbError)
        // Continue without thumbnail if generation fails
      }
    }

    const db = useDrizzle()
    const attachment = await db.insert(tables.taskAttachments).values({
      taskId: tid,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      thumbnailBlobKey,
      blobKey,
      uploadedBy: user.id,
      createdAt: new Date()
    }).returning({
      id: tables.taskAttachments.id,
      fileName: tables.taskAttachments.fileName,
      fileSize: tables.taskAttachments.fileSize,
      fileType: tables.taskAttachments.fileType,
      thumbnailBlobKey: tables.taskAttachments.thumbnailBlobKey,
    })

    const resolveThumbnailUrl = []
    attachment.forEach((attachment) => {
      if (attachment.thumbnailBlobKey) {
        resolveThumbnailUrl.push(resolveThumbnailAttachment(attachment))
      }
    })

    const resolvedThumbnailUrl = (await Promise.allSettled(resolveThumbnailUrl))
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value)

    const resolvedBase64UrlAttachments = []
    resolvedThumbnailUrl.forEach((attachment, index) => {
      resolvedBase64UrlAttachments.push((async () => {
        return {
          base64Url: await getBase64UrlFromBlob(attachment.thumbnail, attachment.fileType),
          attachmentId: attachment.attachmentId
        }
      })())
    })

    const resolvedAttachments = (await Promise.allSettled(resolvedBase64UrlAttachments))
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value)

    resolvedAttachments.forEach((item, index) => {
      const attachmentIndex = attachment.findIndex(a => a.id === item.attachmentId)
      if (attachmentIndex > -1) {
        attachment[attachmentIndex]['thumbnailBase64Url'] = item.base64Url
      }
    })
      
    return {
      success: true,
      data: attachment[0]
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error processing file upload',
      cause: error 
    })
  }
})
