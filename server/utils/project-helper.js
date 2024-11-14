import { eq, and } from 'drizzle-orm'
import { users, projects, projectMembers } from '@/server/database/schema'

/**
 * Get project access for a user
 * @param {import('drizzle-orm').Database} db
 * @param {number} userId
 * @param {number} projectId
 * @returns {Promise<{ hasAccess: boolean, role: string }>}
 */
export const getProjectAccess = async (db, userId, projectId) => {
  const queryProjectMembers = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))

  return {
    hasAccess: queryProjectMembers.length > 0,
    role: queryProjectMembers[0].role,
  }
}

/**
 * Get project by ID
 * @param {import('drizzle-orm').Database} db
 * @param {number} projectId
 * @returns 
 */
export const getProjectById = async (db, projectId) => {
  const queryProject = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
  return queryProject?.[0] || null
}

/**
 * Get the first project from all available projects
 * @param {import('drizzle-orm').Database} db - Database instance
 * @returns {Promise<Object|null>} First project found or null if none exists
 */
export const getFirstProjectFromAllProjects = async (db) => {
  const queryProjects = await db.select().from(projects).limit(1)
  return queryProjects?.[0] || null
}

/**
 * Get all projects
 * @param {import('drizzle-orm').Database} db - Database instance
 * @returns {Promise<Array>} Array of projects
 */
export const getAllProjects = async (db) => {
  const queryProjects = await db.select().from(projects)
  return queryProjects
}

/**
 * Creates a sample project and assigns the user as owner
 * @param {import('drizzle-orm').Database} db - Database instance
 * @param {number} userId - ID of the user creating the project
 * @returns {Promise<{id: number, members: Array}>} Created project with its members
 */
export const createSampleProject = async (db, user) => {
  const sampleProject = await db.insert(projects).values({
    name: 'Sample Project',
    createdBy: user.id,
    createdAt: new Date()
  }).returning();

  const sampleProjectId = sampleProject[0].id;

  const sampleProjectMember = await db
    .insert(projectMembers)
    .values({
      projectId: sampleProjectId,
      userId: user.id,
      role: 'owner',
      createdAt: new Date()
    })
    .returning()

  if (!sampleProjectMember?.[0]?.id) {
    throw new Error('Failed to create project member')
  }

  const memberWithUser = await db
    .select({
      id: projectMembers.id,
      projectId: projectMembers.projectId,
      userId: projectMembers.userId,
      role: projectMembers.role,
      createdAt: projectMembers.createdAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      }
    })
    .from(projectMembers)
    .leftJoin(users, eq(users.id, projectMembers.userId))
    .where(eq(projectMembers.id, sampleProjectMember[0].id))
    .limit(1);

  return {
    id: sampleProjectId,
    members: [memberWithUser[0]]
  }
}

/**
 * Get project members by project ID
 * @param {import('drizzle-orm').Database} db - Database instance
 * @param {number} projectId - ID of the project
 * @returns {Promise<Array>} Array of project members
 */
export const getProjectMembers = async (db, projectId) => {
  const queryProjectMembers = await db.select().from(projectMembers).where(eq(projectMembers.projectId, projectId)).$dynamic()
  return queryProjectMembers
}

/**
 * Get projects by user ID
 * @param {import('drizzle-orm').Database} db - Database instance
 * @param {number} userId - ID of the user
 * @returns {Promise<Array>} Array of projects
 */
export const getProjectsByUserId = async (db, user) => {
  const queryProjects = await db.select({
    id: projects.id,
    name: projects.name,
    description: projects.description,
    createdAt: projects.createdAt,
    createdBy: projects.createdBy,
  })
    .from(projectMembers)
    .leftJoin(projects, eq(projects.id, projectMembers.projectId))
    .where(eq(projectMembers.userId, user.id))
    .$dynamic()

  return queryProjects
}

/**
 * Get the first project by user ID
 * @param {import('drizzle-orm').Database} db - Database instance
 * @param {number} userId - ID of the user
 * @returns {Promise<Object|null>} First project found or null if none exists
 */
export const getFirstProjectByUserId = async (db, userId) => {
  const queryProjects = await db.select({
    id: projects.id,
    name: projects.name,
    description: projects.description,
    createdAt: projects.createdAt,
    createdBy: projects.createdBy,
  })
    .from(projectMembers)
    .leftJoin(projects, eq(projects.id, projectMembers.projectId))
    .where(eq(projectMembers.userId, userId))
    .limit(1)
    .$dynamic()

  return queryProjects?.[0] || null
}
