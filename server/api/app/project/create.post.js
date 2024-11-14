import { useValidatedBody, z } from 'h3-zod'
import { projects, projectMembers } from '~/server/database/schema'

const validationSchema = z.object({
  name: z.string().min(1)
})

export default defineAppEventHandler(async (event) => {
  const { name } = await useValidatedBody(event, validationSchema)

  const project = await useDrizzle().insert(projects).values({
    name,
    createdBy: event.context.user.id,
    createdAt: new Date()
  }).returning()

  await useDrizzle().insert(projectMembers).values({
    projectId: project[0].id,
    userId: event.context.user.id,
    role: 'owner'
  })

  return project[0]
})
