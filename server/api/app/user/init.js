import {
  userPreferences,
  projects,
  users,
  projectMembers,
  rootAdmins,
} from '@/server/database/schema'
import { eq } from 'drizzle-orm'

const adminProcess = async (db, user) => {
  const result = {}

  const queryFirstProject = await getFirstProjectFromAllProjects(db)

  if (!queryFirstProject) {
    const { id: newSampleProjectId, members: newSampleProjectMembers } = await createSampleProject(db, user)

    result.lastVisitedProjectId = newSampleProjectId
    result.members = newSampleProjectMembers
  } else {
    const queryProjectMembers = await getProjectMembers(db, queryFirstProject.id)

    result.lastVisitedProjectId = queryFirstProject.id
    result.members = queryProjectMembers
  }

  return result
}

const userProcess = async (db, user) => {
  const result = {}

  const queryUserPreferences = await getUserPreferences(db, user.id)
  const lastVisitedProjectId = queryUserPreferences.find(
    (preference) => preference.preference === 'lastVisitedProjectId'
  )?.value

  if (lastVisitedProjectId) {
    result.lastVisitedProjectId = lastVisitedProjectId

    const queryProjectMembers = await getProjectMembers(db, result.lastVisitedProjectId)

    result.members = queryProjectMembers
  } else {
    const firstAvailableProject = await getFirstProjectByUserId(db, user.id)

    if (firstAvailableProject) {
      result.lastVisitedProjectId = firstAvailableProject.id

      const queryProjectMembers = await getProjectMembers(db, result.lastVisitedProjectId)

      result.members = queryProjectMembers
    } else {
      const { id: sampleProjectId, members: sampleProjectMembers } = await createSampleProject(db, user)

      result.members = sampleProjectMembers
      result.lastVisitedProjectId = sampleProjectId
    }
  }

  return result
}

export default defineAppEventHandler(async (event) => {
  // Get user from event context
  const { user } = event.context

  // Get database instance
  const db = useDrizzle()

  // Initialize result object
  let result = {
    isRootAdmin: false,
    user: null,
    lastVisitedProjectId: null,
    members: [],
  }

  const queryUser = await getUser(db, user.id)

  if (!queryUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  result.user = queryUser

  // Check if user is root admin
  if (await isRootAdmin(db, user.id)) {
    const resultAdmin = await adminProcess(db, user)

    result = {
      ...result,
      ...resultAdmin,
      isRootAdmin: true,
    }
  } else {
    const resultUser = await userProcess(db, user)

    result = {
      ...result,
      ...resultUser,
    }
  }

  return result
})
