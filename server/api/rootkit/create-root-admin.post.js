import { useValidatedBody, z } from "h3-zod";
import { users, rootAdmins } from "@/server/database/schema";
import bcrypt from 'bcryptjs'

const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  try {
    const token = (getHeader(event, 'Authorization') || '').split('Bearer ')[1] || null

    if (token !== useRuntimeConfig().rootkitToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const { email, password } = await useValidatedBody(event, validationSchema)

    const queryUser = await useDrizzle().select().from(users).where(eq(users.email, email))

    if (queryUser.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hashSync(password, salt)

    const queryNewUser = await useDrizzle().insert(users).values({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }).returning()

    await useDrizzle().insert(rootAdmins).values({
      userId: queryNewUser[0].id,
    })

    return {
      success: true,
      message: 'Admin created successfully',
    }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
})
