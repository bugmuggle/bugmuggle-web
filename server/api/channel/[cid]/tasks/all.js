import { and, eq, or, isNull } from 'drizzle-orm'

export default defineAuthEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const { archived } = getQuery(event)

  let results = []
  
  if (archived === 'true') {
    results = await useDrizzle()
      .select()
      .from(tables.tasks)
      .where(
        and(
          eq(tables.tasks.channelId, cid),
          or(tables.tasks.archived, true)
        )
      )
  } else {
    results = await useDrizzle()
      .select()
      .from(tables.tasks)
      .where(
        and(
          eq(tables.tasks.channelId, cid),
          or(eq(tables.tasks.archived, false), isNull(tables.tasks.archived))
        )
      )
  }

  return {
    success: true,
    data: results,
  }
})
