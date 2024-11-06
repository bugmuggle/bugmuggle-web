import { userPreferences, projects, users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const { user } = event.context
  const db = useDrizzle()

  const result = {
    user: null,
    lastVisitedProjectId: null,
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
  } else {
    const queryProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.createdBy, user.id))
      .limit(1)

    if (queryProjects.length > 0) {
      result.lastVisitedProjectId = queryProjects[0].id
    }
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

  if (queryUser.length > 0) {
    result.user = queryUser[0]
  }

  return result
})
