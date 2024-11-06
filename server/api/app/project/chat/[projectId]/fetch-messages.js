import { eq, lt, and, desc } from 'drizzle-orm'
import { messages, users } from '@/server/database/schema'

export default defineAppEventHandler(async (event) => {
  const { projectId } = event.context.params

  const body = await readBody(event)

  const { limit = 50, offsetId } = body

  const queryMessages = await useDrizzle()
    .select({
      id: messages.id,
      message: messages.message,
      createdAt: messages.createdAt,
      projectId: messages.projectId,
      fromUserId: messages.fromUserId,
      toUserId: messages.toUserId,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      },
    })
    .from(messages)
    .leftJoin(users, eq(messages.fromUserId, users.id))
    .where(
      and(
        eq(messages.projectId, projectId),
        offsetId ? lt(messages.id, offsetId) : undefined
      )
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit)

  return queryMessages
})
