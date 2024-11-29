import { projectMembers, users } from '@/server/database/schema'
import { eq, or, and } from 'drizzle-orm'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { de } from 'date-fns/locale'

const schema = z.object({
  email: z.string().min(1, 'Email is required'),
  role: z.enum(['admin', 'member']).optional(),
})

export default defineAppEventHandler(async (event) => {
  const { user } = event.context

  const projectId = event.context.params.projectId
  const body = await readBody(event)
  const data = schema.parse(body)

  const queryUserIsOwner = await useDrizzle().select().from(projectMembers)
    .where(eq(projectMembers.userId), user.id)
    .where(
      or(
        eq(projectMembers.role, 'owner'),
        eq(projectMembers.role, 'admin')
      )
    )

  if (!queryUserIsOwner.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only project owners or admins invite members'
    })
  }

  let newUserPassword = null
  let targetUser = null
  const queryUser = await useDrizzle().select().from(users).where(eq(users.email, data.email))

  if (!queryUser.length) {
    // Create user
    newUserPassword = nanoid()
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hashSync(newUserPassword, salt)

    const newQueryUser = await useDrizzle().insert(users).values({
      email: data.email,
      password: hashedPassword,
      createdAt: new Date(),
    }).returning()

    targetUser = newQueryUser[0]
  } else {
    targetUser = queryUser[0]
  }
  
  const queryMember = await useDrizzle().select().from(projectMembers).where(and(
    eq(projectMembers.id, targetUser.id),
    eq(projectMembers.projectId, projectId)
  ))

  if (queryMember.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Member already exists'
    })
  }

  const newQueryMember = await useDrizzle().insert(projectMembers).values({
    projectId,
    userId: targetUser.id,
    role: data.role || 'member'
  }).returning()

  const result = newQueryMember[0]

  if (newUserPassword) {
    result.password = newUserPassword
  }

  delete targetUser.password

  return { ...result, ...targetUser }
})
