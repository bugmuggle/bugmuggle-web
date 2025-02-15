const createChannel = async (name) => {
  return await useDrizzle().insert(tables.channels).values({
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 1,
  }).returning()
}
export default defineAuthEventHandler(async (event) => {
  const user = (await getUserSession(event)).user
  console.log(user)
  // githubId

  let queryUser = await useDrizzle().select().from(tables.users).where(eq(tables.users.githubId, user.githubId))

  if (!queryUser.length) {
    const newUser = await useDrizzle().insert(tables.users).values({
      githubId: user.githubId,
      createdAt: new Date(),
    }).returning()

    queryUser = newUser[0]

    // Create a "General" channel
    const newChannel = await createChannel('General')

    await useDrizzle().insert(tables.members).values({
      userId: newUser[0].id,
      channelId: newChannel[0].id,
      type: 'ADMIN',
      createdAt: new Date()
    })

    await useDrizzle().update(tables.users).set({
      lastVisitedChannelId: newChannel[0].id,
    }).where(eq(tables.users.id, newUser[0].id))

    return {
      success: true,
      data: {
        lastVisitedChannelId: newChannel[0].id,
      }
    }
  }

  let channel = await useDrizzle().select().from(tables.channels).where(
    eq(tables.channels.id, queryUser[0].lastVisitedChannelId)
  )

  if (!channel.length) {
    // Get first available channel
    channel = await useDrizzle().select().from(tables.channels).orderBy(tables.channels.id).limit(1)
  }

  if (!channel.length) {
    // Create a "General" channel
    channel = await createChannel('General')
  }

  return {
    success: true,
    data: {
      lastVisitedChannelId: channel[0].id,
    }
  }
})
