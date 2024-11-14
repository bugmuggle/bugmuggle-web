export default defineAppEventHandler(async (event) => {
  const { user } = event.context
  const db = useDrizzle()

  return await getProjectsByUserId(db, user.id)
})
