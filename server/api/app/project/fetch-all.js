import { projects } from '@/server/database/schema'

export default defineAppEventHandler(async (event) => {
  const queryProjects = await useDrizzle().select().from(projects)
  return queryProjects
})
