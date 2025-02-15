export default async function getUserByGithubId(githubId) {
  const queryUser = await useDrizzle().select().from(tables.users).where(eq(tables.users.githubId, githubId))
  return queryUser[0]
}
