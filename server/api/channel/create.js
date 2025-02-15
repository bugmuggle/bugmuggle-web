export default defineAuthEventHandler(async (event) => {
  const { name } = await readBody(event)
  const githubId = (await getUserSession(event)).user.githubId

  const user = await getUserByGithubId(githubId)

  const channel = await useDrizzle().insert(tables.channels).values({
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 1,
  }).returning()

  await useDrizzle().insert(tables.members).values({
    userId: user.id,
    channelId: channel[0].id,
    type: 'ADMIN',
    createdAt: new Date(),
  })

  return {
    success: true,
    data: { channel: channel[0] },
  }
})
