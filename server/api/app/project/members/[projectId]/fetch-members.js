import { projectMembers, users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const projectId = event.context.params.projectId

  const queryMembers = await useDrizzle()
    .select()
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId))
    .leftJoin(users, eq(projectMembers.userId, users.id))

  if (!queryMembers.length) {
    return []
  }

  return queryMembers
})
