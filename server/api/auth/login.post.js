import { useValidatedBody, z } from "h3-zod";
import { users } from "@/server/database/schema";
import bcrypt from 'bcryptjs'

const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await useValidatedBody(event, validationSchema)

    const queryUser = await useDrizzle().select().from(users).where(eq(users.email, email))

    if (!queryUser.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User not found',
      })
    }

    const user = queryUser[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid password',
      })
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email
      }
    })

    return true
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
})
