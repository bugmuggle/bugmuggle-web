import { variables, projectVariables } from '@/server/database/schema'
import { z } from 'zod'

const schema = z.object({
  variableId: z.number().min(0, 'Variable ID is required')
})

export default defineAppEventHandler(async (event) => {
  const projectId = event.context.params.projectId
  const body = await readBody(event)
  const data = schema.parse(body)
  
  await useDrizzle().delete(projectVariables).where(and(eq(projectVariables.projectId, projectId), eq(projectVariables.variableId, data.variableId)))
  await useDrizzle().delete(variables).where(eq(variables.id, data.variableId))

  return true
})
