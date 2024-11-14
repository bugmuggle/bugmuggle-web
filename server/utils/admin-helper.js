import { eq } from 'drizzle-orm'
import { rootAdmins } from '@/server/database/schema'

export const isRootAdmin = async (db, user) => {
  const queryRootAdmins = await db
    .select()
    .from(rootAdmins)
    .where(eq(rootAdmins.userId, user.id))
    .limit(1)

  return queryRootAdmins.length > 0
}
