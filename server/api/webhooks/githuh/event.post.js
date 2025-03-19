export default defineEventHandler(async (event) => {
  const signature = getHeader(event, 'x-hub-signature-256')
  const { githubWebhookSecret } = useRuntimeConfig(event)
  
  // Verify the webhook signature
  if (!signature) {
    console.error('GitHub webhook signature missing')
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing signature'
    })
  }
  
  // Create expected signature
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', githubWebhookSecret)
  const digest = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex')
  
  // Compare signatures (using timing-safe comparison)
  const verified = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
  
  if (!verified) {
    console.error('GitHub webhook signature verification failed')
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid signature'
    })
  }

  // Process the verified webhook
  console.log('Received verified GitHub webhook')
  const payload = await readBody(event)

  console.log(payload)
  
  return true
})