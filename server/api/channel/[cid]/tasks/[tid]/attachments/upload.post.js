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
    
    await hubBlob().put(blobKey, arrayBuffer, {
      type: file.type,
      metadata: {
        fileName: file.name
      }
    })

    const db = useDrizzle()
    const attachment = await db.insert(tables.taskAttachments).values({
      taskId: tid,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      blobKey,
      uploadedBy: user.id,
      createdAt: new Date()
    }).returning()

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
