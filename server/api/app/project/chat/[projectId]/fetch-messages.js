import { eq, lt, and, desc } from 'drizzle-orm'
import { messages } from '@/server/database/schema'

export default defineAppEventHandler(async (event) => {
  const { projectId } = event.context.params

  const body = await readBody(event)

  const { limit = 50, offsetId } = body

  const queryMessages = await useDrizzle()
    .select()
    .from(messages)
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
