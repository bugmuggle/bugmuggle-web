export default defineAuthEventHandler(async (event) => {
  const user = (await getUserSession(event)).user
  console.log(user)

  console.log(await useDrizzle().select().from(tables.users).all())

  return true
})
