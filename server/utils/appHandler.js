import { rootAdmins } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export const defineAppEventHandler = (handler) => {
  return defineEventHandler(async (event) => {
    try {
      const session = await getUserSession(event)
      if (!session || !session.user) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Unauthorized request'
        })
      }

      const db = useDrizzle()

      const queryRootAdmin = await db.select({ id: rootAdmins.id })
        .from(rootAdmins)
        .where(eq(rootAdmins.userId, session.user.id))
        .limit(1)

      event.context.user = {
        ...session.user,
        isRootAdmin: queryRootAdmin.length > 0
      }

      const response = await handler(event)
      return response
    } catch (err) {
      console.log(err)
      if (err.statusCode) {
        throw err
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error'
        })
      }
    }
  })
}
