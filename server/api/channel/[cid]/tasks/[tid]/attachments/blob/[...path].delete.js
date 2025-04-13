export default defineAuthEventHandler(async (event) => {
  try {
    const cid = getRouterParam(event, 'cid')
    const tid = getRouterParam(event, 'tid')
    const path = getRouterParam(event, 'path')

    if (!path) {
      throw createError({ statusCode: 400, message: 'No path provided' })
    }

    await hubBlob().del(`attachments/${cid}/${tid}/${path}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw createError({
      statusCode: 500,
      message: 'Error deleting file',
      cause: error,
    })
  }
})
