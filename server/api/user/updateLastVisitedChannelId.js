export default defineAuthEventHandler(async (event) => {
  const { cid } = await readBody(event)
  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)
  
  await useDrizzle().update(tables.users)
    .set({
      lastVisitedChannelId: cid,
    })
    .where(eq(tables.users.id, user.id))

  return {
    success: true,
  }
})
