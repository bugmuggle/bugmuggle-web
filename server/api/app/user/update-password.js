import { useValidatedBody, z } from "h3-zod";
import { users } from "@/server/database/schema";
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export default defineAppEventHandler(async (event) => {
  try {
    
  } catch (error) {
    
  }
  const { user } = event.context
  const db = useDrizzle()
  
  const { currentPassword, newPassword } = await useValidatedBody(event, schema)

  const queryUser = await db.select().from(users).where(eq(users.id, user.id))

  if (!queryUser.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, queryUser[0].password)

  if (!isPasswordValid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Current password is incorrect'
    })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hashSync(newPassword, salt)

  await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, user.id))

  return true
})
