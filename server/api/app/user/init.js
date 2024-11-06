import { userPreferences, projects } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const { user } = event.context
  const db = useDrizzle()

  const result = {
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

  return result
})
