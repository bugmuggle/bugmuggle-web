import { users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const { user } = event.context
  const db = useDrizzle()

  const body = await readBody(event)

  const queryUser = await db.select().from(users).where(eq(users.id, user.id))

  if (!queryUser.length) {
    return createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const filteredUpdates = Object.fromEntries(
    Object.entries(body).filter(([_, value]) => value !== undefined)
  )

  await db.update(users).set(filteredUpdates).where(eq(users.id, user.id))

  return true
})
