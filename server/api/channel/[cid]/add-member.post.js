export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const { username } = await readBody(event)

  let queryUser = await useDrizzle().select().from(tables.users).where(eq(tables.users.githubUsername, username))

  if (queryUser.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      const githubUser = await $fetch('https://api.github.com/users/' + username)

      // Create a user if it doesn't exist
      queryUser = await useDrizzle().insert(tables.users).values({
        githubId: githubUser.id,
        githubUsername: githubUser.login,
        githubAvatarUrl: githubUser.avatar_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning()
    } else {
      return createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }
  }

  const res = await useDrizzle()
    .insert(tables.members)
    .values({
      channelId: cid,
      userId: queryUser[0].id,
      type: 'REGULAR',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()

  return {
    success: true,
    data: queryUser[0]
  }
})
