import sharp from 'sharp'

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
    
    return await sharp(inputBuffer).resize(320, 240, { fit: 'inside' }).toBuffer()
  }
  
  throw new Error('Unsupported file type for thumbnail generation')
}
