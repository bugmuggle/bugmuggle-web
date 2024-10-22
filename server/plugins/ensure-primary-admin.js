import bcrypt from 'bcryptjs'

export default defineNitroPlugin(async (nitroApp) => {
  console.log(bcrypt.hashSync('testpass', 10))
})
