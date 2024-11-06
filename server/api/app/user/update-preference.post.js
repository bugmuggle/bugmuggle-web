import { userPreferences } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const { user } = event.context
  const db = useDrizzle()

  const body = await readBody(event)
  console.log(body)

  const queryPreferenceByKey = await db
    .select()
    .from(userPreferences)
    .where(
      and(
        eq(userPreferences.userId, user.id),
        eq(userPreferences.preference, body.preference)
      )
    )

  if (queryPreferenceByKey.length > 0) {
    await db.update(userPreferences).set({ value: body.value }).where(eq(userPreferences.id, queryPreferenceByKey[0].id))
  } else {
    await db.insert(userPreferences).values({ userId: user.id, preference: body.preference, value: body.value })
  }

  return true
})
