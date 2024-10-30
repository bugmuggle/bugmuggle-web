import { projects } from '@/server/database/schema'

export default defineAppEventHandler(async (event) => {
  // Get the project id from the request query
  const { id } = getQuery(event)

  const queryProjects = await useDrizzle().select().from(projects).where(eq(projects.id, id))

  if (queryProjects.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found'
    })
  }

  return queryProjects[0]
})
