import { nanoid } from 'nanoid'

export default defineAuthEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file')

    if (!file) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    const uniqueId = nanoid()
    const fileExtension = file.name.split('.').pop()
    const blobKey = `${uniqueId}.${fileExtension}`

    await hubBlob().put(`attachments/${blobKey}`, file, {
      type: file.type,
      metadata: {
        fileName: file.name,
      },
    })

    // Construct the URL using the blob key
    const url = `/api/channel/attachments/blob/${blobKey}`

    return {
      success: 1,
      file: {
        url,
      },
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw createError({
      statusCode: 500,
      message: 'Error processing file upload',
      cause: error,
    })
  }
})
