import Jimp from 'jimp-compact'

/**
 * Generates a thumbnail from the provided file buffer
 * @param {ArrayBuffer} buffer - The file buffer
 * @param {string} fileType - The MIME type of the file
 * @returns {Promise<Buffer>} - The thumbnail buffer
 */
export const generateThumbnail = async (buffer, fileType) => {
  // For images
  if (fileType.startsWith('image/')) {
    // Ensure buffer is properly converted to Buffer if it's an ArrayBuffer
    const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
    
    const image = await Jimp.read(inputBuffer);
    // Maintain aspect ratio by setting only the max dimensions
    image.scaleToFit(320, 240);
    return await image.getBufferAsync(Jimp.AUTO);
  }
  
  throw new Error('Unsupported file type for thumbnail generation')
}
