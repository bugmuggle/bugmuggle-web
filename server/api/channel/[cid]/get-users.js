export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')

  // Get all members of the channel
  const queryMembers = await useDrizzle().select().from(tables.members).where(eq(tables.members.channelId, cid))

  const resolver = []
  queryMembers.forEach(async (member) => {
    resolver.push(useDrizzle().select().from(tables.users).where(eq(tables.users.id, member.userId)))
  })

  const users = (await Promise.allSettled(resolver))
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)

  const resolverGithubUsers = []

  users.forEach(async (user) => {
    resolverGithubUsers.push($fetch('https://api.github.com/user/35134207.0'))
  })

  const githubUsers = (await Promise.allSettled(resolverGithubUsers))
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)


  return {
    success: true,
    data: githubUsers
  }
})
