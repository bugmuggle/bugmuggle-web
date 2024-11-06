import { userPreferences, projects, users, projectMembers } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const { user } = event.context

  const db = useDrizzle()

  const result = {
    user: null,
    lastVisitedProjectId: null,
    members: [],
  }
  
  const queryUser = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, user.id))

  if (!queryUser.length) {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  if (queryUser.length > 0) {
    result.user = queryUser[0]
  }

  const queryUserPreferences = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, user.id))

  const lastVisitedProjectId = queryUserPreferences.find(
    (preference) => preference.preference === 'lastVisitedProjectId'
  )?.value

  if (lastVisitedProjectId) {
    result.lastVisitedProjectId = lastVisitedProjectId

    const queryProjectMembers = await db
      .select()
      .from(projectMembers)
      .where(eq(projectMembers.projectId, result.lastVisitedProjectId))
      .$dynamic()

    result.members = queryProjectMembers
  } else {
    const queryProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.createdBy, user.id))
      .limit(1)

    if (queryProjects.length > 0) {
      result.lastVisitedProjectId = queryProjects[0].id

      const queryProjectMembers = await db
        .select()
        .from(projectMembers)
        .where(eq(projectMembers.projectId, result.lastVisitedProjectId))
        .$dynamic()

      result.members = queryProjectMembers
    } else {
      const sampleProject = await db.insert(projects).values({
        name: 'Sample Project',
        createdBy: user.id,
        createdAt: new Date()
      }).returning()

      const sampleProjectId = sampleProject[0].id

      const sampleProjectMember = await db
        .insert(projectMembers)
        .values({
          projectId: sampleProjectId,
          userId: user.id,
          role: 'owner',
          createdAt: new Date()
        })
        .returning({
          id: projectMembers.id,
          projectId: projectMembers.projectId,
          userId: projectMembers.userId,
          role: projectMembers.role,
          createdAt: projectMembers.createdAt,
          user: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          }
        })
        .$dynamic();

      result.members = [sampleProjectMember]
      result.lastVisitedProjectId = sampleProjectId
    }
  }

  return result
})
