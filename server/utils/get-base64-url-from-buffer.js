export const getBase64UrlFromBlob = async (blob, type) => {
  const arrayBuffer = await blob.arrayBuffer();
  // Convert ArrayBuffer to Buffer
  const buffer = Buffer.from(arrayBuffer);
  // Convert Buffer to base64 string
  const base64Data = buffer.toString('base64');

  return `data:${type};base64,${base64Data}`
}

export const resolveThumbnailAttachment = async (attachment) => {
  if (attachment.thumbnailBlobKey) {
    const thumbnail = await hubBlob().get(attachment.thumbnailBlobKey)
    return { attachmentId: attachment.id, thumbnail }
  }
  return null
}
