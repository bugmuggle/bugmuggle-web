import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { projectMembers, projects } from '@/server/database/schema'

const validationSchema = z.object({
  userId: z.number().min(0)
})

export default defineAppEventHandler(async (event) => {
  const { user } = event.context

  const projectId = event.context.params.projectId
  const body = await readBody(event)
  const data = validationSchema.parse(body)

  const db = useDrizzle()

  if (!user.isRootAdmin && getProjectAccess(db, user.id, projectId) !== 'admin') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Requesting user do not have permission/role to perform this action on project'
    })
  }

  const queryMember = await db.select()
    .from(projectMembers)
    .where(and(
      eq(projectMembers.userId, data.userId),
      eq(projectMembers.projectId, projectId)
    ))

  if (!queryMember.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User is not a member of the requesting project'
    })
  }

  await db.delete(projectMembers)
    .where(eq(projectMembers.userId, data.userId))

  return queryMember[0]
})
