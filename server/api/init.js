const createChannel = async (name) => {
  return await useDrizzle().insert(tables.channels).values({
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 1,
  })
}
export default defineAuthEventHandler(async (event) => {
  const user = (await getUserSession(event)).user
  console.log(user)
  // githubId

  const queryUser = await useDrizzle().select().from(tables.users).where(eq(tables.users.githubId, user.githubId))

  if (!queryUser.length) {
    await useDrizzle().insert(tables.users).values({
      githubId: user.githubId,
      createdAt: new Date(),
    })

    // Create a "General" channel
    const channel = await createChannel('General')

    await useDrizzle().insert(tables.members).values({
      userId: queryUser[0].id,
      channelId: 1,
      type: 'ADMIN',
      createdAt: new Date(),
    })

    await useDrizzle().update(tables.users).set({
      lastVisitedChannelId: channel.id,
    }).where(eq(tables.users.id, queryUser[0].id))

    return {
      success: true,
      data: {
        lastVisitedChannelId: channel.id,
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
