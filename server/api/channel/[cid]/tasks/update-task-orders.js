export default defineAuthEventHandler(async (event) => {
  const { orderString } = await readBody(event)
  const cid = getRouterParam(event, 'cid')
  const githubId = (await getUserSession(event)).user.githubId
  const user = await getUserByGithubId(githubId)

  const taskOrders = orderString.split(',')
    .map(order => ({ taskId: order.split('-')[0], order: order.split('-')[1] }))

  
  const promiseResolver = []

  taskOrders.forEach(async (taskOrder) => {
    promiseResolver.push(
      useDrizzle().update(tables.tasks)
        .set({
          order: sql`${taskOrder.order}`,
          updatedAt: new Date(),
          updatedBy: user.id,
        })
        .where(eq(tables.tasks.id, taskOrder.taskId))
    )
  })

  await Promise.all(promiseResolver)

  return {
    success: true
  }
})
