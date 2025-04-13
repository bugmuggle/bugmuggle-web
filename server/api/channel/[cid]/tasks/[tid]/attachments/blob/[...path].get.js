export default defineEventHandler(async (event) => {
  try {
    const cid = getRouterParam(event, 'cid')
    const tid = getRouterParam(event, 'tid')
    const path = getRouterParam(event, 'path')
    const blob = await hubBlob().get(`attachments/${path}`)

    if (!blob) {
      throw createError({ statusCode: 404, message: 'File not found' })
    }

    // Set appropriate headers
    setResponseHeaders(event, {
      'Content-Type': blob.type,
      'Content-Disposition': `inline; filename="${path.split('/').pop()}"`,
    })

    return blob
  } catch (error) {
    console.error('Error serving blob:', error)
    throw createError({
      statusCode: 500,
      message: 'Error serving file',
      cause: error,
    })
  }
}) 
