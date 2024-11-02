import { variables, projectVariables } from '@/server/database/schema'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
  isSecret: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const projectId = event.context.params.projectId
  const body = await readBody(event)
  const data = schema.parse(body)
  
  const newQueryVariable = await useDrizzle().insert(variables).values(data).returning()
  const variable = newQueryVariable[0]

  await useDrizzle().insert(projectVariables).values({
    projectId,
    variableId: variable.id
  })

  return variable
})
