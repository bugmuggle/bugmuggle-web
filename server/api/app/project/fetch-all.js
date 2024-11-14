export default defineAppEventHandler(async (event) => {
  const { user } = event.context
  const db = useDrizzle()

  if (await isRootAdmin(db, user)) {
    return await getAllProjects(db)
  }

  return await getProjectsByUserId(db, user)
})
