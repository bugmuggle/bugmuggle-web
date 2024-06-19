export default defineEventHandler(async (event) => {
  try {
    return  true
  } catch (error) {
    return error
  }
})
