import { createHmac, timingSafeEqual } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const { webhookSecret } = useRuntimeConfig(event)
  const signature = getHeader(event, 'X-Hub-Signature-256')
  const body = await readRawBody(event) // Read raw body for signature verification

  if (!signature || !body) {
    throw createError({ statusCode: 400, statusMessage: 'Missing signature or body' })
  }

  // Verify the signature
  const hmac = createHmac('sha256', webhookSecret)
  const digest = Buffer.from(`sha256=${hmac.update(body).digest('hex')}`, 'utf8')
  const checksum = Buffer.from(signature, 'utf8')

  if (checksum.length !== digest.length || !timingSafeEqual(digest, checksum)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  // If signature is valid, parse the body (which is usually JSON) and log it
  try {
    const payload = JSON.parse(body)
    console.log('Received GitHub webhook payload:', payload)

    // --- Add your webhook processing logic here ---

    return { received: true } // Send a success response
  } catch (error) {
     console.error('Error parsing webhook payload:', error)
     throw createError({ statusCode: 400, statusMessage: 'Invalid JSON payload' })
  }
})
