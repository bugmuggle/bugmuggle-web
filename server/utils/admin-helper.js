import { eq } from 'drizzle-orm'
import { rootAdmins } from '@/server/database/schema'

export const isRootAdmin = async (db, userId) => {
  const queryRootAdmins = await db
    .select()
    .from(rootAdmins)
    .where(eq(rootAdmins.userId, userId))
    .limit(1)

  return queryRootAdmins.length > 0
}
