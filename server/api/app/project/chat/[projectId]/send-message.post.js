import { z, useValidatedBody } from 'h3-zod'
import { messages, users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

const schema = z.object({
  message: z.string().min(1),
})

export default defineAppEventHandler(async (event) => {
  try {
    const user = event.context.user
    const projectId = event.context.params.projectId
    const body = await useValidatedBody(event, schema)

    const db = useDrizzle()

    const newMessage = await db
      .insert(messages)
      .values({
        message: body.message,
        fromUserId: user.id,
        projectId: projectId,
        createdAt: new Date()
      })
      .returning()
      .$dynamic()

    // Fetch the complete message with user data
    const messageWithUser = await db
      .select({
        messageId: messages.id,
        message: messages.message,
        projectId: messages.projectId,
        createdAt: messages.createdAt,
        fromUserId: messages.fromUserId,
        toUserId: messages.toUserId,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(messages)
      .innerJoin(users, eq(messages.fromUserId, users.id))
      .where(eq(messages.id, newMessage[0].id))
      .get()

    return messageWithUser
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
