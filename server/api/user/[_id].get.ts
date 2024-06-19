export default defineEventHandler(async (event) => {
  try {
    const docUser = await UserSchema.findOne({ _id: event.context.params?._id });
    return docUser
  } catch (error) {
    return error
  }
})
