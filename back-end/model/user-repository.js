import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../src/config/config.js'
const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: 'string', unique: true, required: true },
  username: { type: 'string', unique: true, required: true },
  password: { type: 'string', required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (typeof password !== 'string') throw new Error('Password must be a string')

    const user = User.findOne({ username })
    if (user) throw new Error('User already exists')

    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS) // 10 es el número de rondas de hashing, se puede cambiar para aumentar la seguridad

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (typeof password !== 'string') throw new Error('Password must be a string')

    const user = User.findOne({ username })
    if (!user) throw new Error('User dont exists')

    const isValid = bcrypt.compareSync(password, user.password) // Encripta password y compara user.password
    if (!isValid) throw new Error('Invalid password')

    // const { password: _, ...publicUser } = user

    return {
      id: user._id,
      username: user.username
    }
  }
}
