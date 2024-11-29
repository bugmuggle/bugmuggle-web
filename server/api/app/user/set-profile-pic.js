import { users } from '@/server/database/schema'

export default defineAppEventHandler(async (event) => {
  const form = await readFormData(event)
  const file = form.get('file')

  const { user } = event.context

  if (!file || !file.size) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  ensureBlob(file, {
    maxSize: '1MB',
    types: ['image']
  })

  const responseBlobPut = await hubBlob().put('dp-' + user.id, file, {
    addRandomSuffix: false,
    prefix: 'images'
  })

  await useDrizzle().update(users).set({
    profilePicPath: responseBlobPut.pathname
  }).where(eq(users.id, user.id))

  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
  const blob = await hubBlob().serve(event, responseBlobPut.pathname)

  return blob
})