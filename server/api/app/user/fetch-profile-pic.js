export default defineAppEventHandler(async (event) => {
  const { userId } = getQuery(event)
  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
  return await hubBlob().serve(event, 'images/' + 'dp-' + userId)
})
