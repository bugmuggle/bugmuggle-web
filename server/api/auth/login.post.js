import { useValidatedBody, z } from "h3-zod";
import { users } from "@/server/database/schema";

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

    console.log(queryUser)
    return true
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
})
