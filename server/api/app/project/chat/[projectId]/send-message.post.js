import { z, useValidatedBody } from 'h3-zod'
import { messages } from '@/server/database/schema'

const schema = z.object({
  message: z.string().min(1),
})

export default defineAppEventHandler(async (event) => {
  try {
    const user = event.context.user
    const projectId = event.context.params.projectId
    const body = await useValidatedBody(event, schema)

    const newMessage = await useDrizzle().insert(messages).values({
      message: body.message,
      fromUserId: user.id,
      projectId: projectId,
      createdAt: new Date()
    }).returning()

    return newMessage[0]
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
