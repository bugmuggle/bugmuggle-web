import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  doingTheseDays: text('doing_these_days'),
  displayName: text('display_name'),
  position: text('position'),
  phoneNumber: text('phone_number'),
  profilePicPath: text('profile_pic_path'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  preference: text('preference').notNull(),
  value: text('value').notNull(),
})

export const rootAdmins = sqliteTable('root_admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
})

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  createdBy: integer('created_by').notNull().references(() => users.id),
})

export const projectMembers = sqliteTable('project_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => projects.id),
  userId: integer('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('member'),
})

export const variables = sqliteTable('variables', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  value: text('value').notNull(),
  isSecret: integer('is_secret', { mode: 'boolean' }).notNull().default(false),
})

export const projectVariables = sqliteTable('project_variables', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => projects.id),
  variableId: integer('variable_id').notNull().references(() => variables.id),
})

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
  fromUserId: integer('from_user_id').notNull().references(() => users.id),
  projectId: integer('project_id').notNull().references(() => projects.id),
  toUserId: integer('to_user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
