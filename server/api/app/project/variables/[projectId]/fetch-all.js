import { variables, projectVariables } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineAppEventHandler(async (event) => {
  const projectId = event.context.params.projectId

  const results = await useDrizzle()
    .select({
      id: projectVariables.variableId,
      projectId: projectVariables.projectId,
      name: variables.name,
      value: variables.value,
      isSecret: variables.isSecret,
    })
    .from(projectVariables)
    .leftJoin(variables, eq(variables.id, projectVariables.variableId))
    .where(eq(projectVariables.projectId, projectId))
  
  return results
})
