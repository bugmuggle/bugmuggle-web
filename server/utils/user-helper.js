import { eq } from 'drizzle-orm'
import { users, userPreferences } from '@/server/database/schema'

export const getUser = async (db, userId) => {
  const queryUser = await db.select().from(users).where(eq(users.id, userId))
  return queryUser?.[0] || null
}

export const getUserPreferences = async (db, userId) => {
  const queryUserPreferences = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId))
  return queryUserPreferences
}
