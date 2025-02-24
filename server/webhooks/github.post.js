export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('GitHub webhook received:', body)

  return sendNoContent(event, 200)
})
