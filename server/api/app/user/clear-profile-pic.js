import { users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const { user } = event.context
  const db = useDrizzle()

  const queryUser = await db.select({
    profilePicPath: users.profilePicPath
  })
  .from(users)
  .where(eq(users.id, user.id))
  .get()

  if (queryUser?.profilePicPath) {
    await hubBlob().delete(queryUser.profilePicPath)
  }

  await db.update(users)
    .set({ profilePicPath: null })
    .where(eq(users.id, user.id))

  return true
})
