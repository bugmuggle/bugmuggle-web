import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const channels = sqliteTable('channels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  userId: integer('user_id').references(() => users.id),
  memberCount: integer('member_count').notNull(),
})

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  githubId: text('github_id').notNull(),
  lastVisitedChannelId: integer('last_visited_channel_id').references(() => channels.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(),
  channelId: integer('channel_id').references(() => channels.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
