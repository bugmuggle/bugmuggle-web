import { inArray } from "drizzle-orm"

export default defineAuthEventHandler(async (event) => {
  let channels = []

  const githubId = (await getUserSession(event)).user?.githubId
  const user = await getUserByGithubId(githubId)

  const queryMembers = await useDrizzle().select().from(tables.members).where(eq(tables.members.userId, user.id))

  if (queryMembers.length) {
    channels = await useDrizzle().select().from(tables.channels).where(inArray(tables.channels.id, queryMembers.map(m => m.channelId)))
  }

  return {
    success: true,
    data: { channels },
  }
})
