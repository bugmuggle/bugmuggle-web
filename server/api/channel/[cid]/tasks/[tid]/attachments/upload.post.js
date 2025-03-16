import { nanoid } from 'nanoid'

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

    const uniqueId = nanoid()
    const arrayBuffer = await file.arrayBuffer()
    const blobKey = `tasks/${tid}/attachments/${uniqueId}.${file.type.split('/')[1]}`
    
    await hubBlob().put(blobKey, file, {
      type: file.type,
      metadata: {
        fileName: file.name
      }
    })

    const thumbnail = await generateThumbnail(arrayBuffer, file.type)
    const thumbnailBlobKey = `tasks/${tid}/attachments/thumbnails/${uniqueId}-thumbnail.${file.type.split('/')[1]}`

    if (thumbnail) {
      /* await hubBlob().put(thumbnailBlobKey, new File([thumbnail], file.name, { type: file.type }), {
        type: file.type,
      }) */
    }


    const db = useDrizzle()
    const attachment = await db.insert(tables.taskAttachments).values({
      taskId: tid,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      thumbnailBlobKey: null,
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
