import { variables, projectVariables } from '@/server/database/schema'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required'),
  role: z.enum(['admin', 'member']).optional(),
})

export default defineEventHandler(async (event) => {
  const projectId = event.context.params.projectId
  const body = await readBody(event)
  const data = schema.parse(body)
  
  const queryMember = await useDrizzle().select().from(members).where(eq(members.email, data.email))

  if (queryMember.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Member already exists'
    })
  }

  const newQueryMember = await useDrizzle().insert(members).values(data).returning()
  const member = newQueryMember[0]

  await useDrizzle().insert(projectMembers).values({
    projectId,
    memberId: member.id
  })
})
