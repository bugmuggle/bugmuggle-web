import { projectMembers, users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const projectId = event.context.params.projectId
  console.log(projectId)

  const queryMembers = await useDrizzle()
    .select({
      id: projectMembers.id,
      projectId: projectMembers.projectId,
      userId: projectMembers.userId,
      role: projectMembers.role,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId))
    .leftJoin(users, eq(projectMembers.userId, users.id))

  if (!queryMembers.length) {
    return []
  }

  return queryMembers
})
