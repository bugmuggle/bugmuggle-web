import Jimp from 'jimp-compact'

export const generateThumbnail = async (buffer, fileType) => {
  if (fileType.startsWith('image/')) {
    const image = await Jimp.read(buffer)
    // reduce to 100px width
    image.scaleToFit(100, Jimp.AUTO)
    return await image.getBufferAsync(Jimp.AUTO)
  }
  return null
}

