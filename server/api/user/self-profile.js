export default defineAuthEventHandler(async (event) => {
  const user = (await getUserSession(event)).user

  const userProfile = await useDrizzle().select().from(tables.users).where(eq(tables.users.githubId, user.githubId))

  return {
    success: true,
    data: userProfile[0],
  }
})
