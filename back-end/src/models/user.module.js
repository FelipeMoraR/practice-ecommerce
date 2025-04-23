import { SALT_ROUNDS } from '../config/config.js'
import { db } from '../config/db.config.js'
import bcrypt from 'bcrypt'
import { UserExistError } from '../utils/customErrors.js'

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

export const loginUserModel = async (username, password) => {
  try {
    const [[user]] = await db.query('SELECT id, username, password FROM USER WHERE USERNAME = ?', // NOTE If you use only rows without the brackets you will recibe the metadata of the query as other array [rows, fields]
      [username])

    if (!user) throw new Error('User not founded')

    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) throw new Error('Invalid password') // Remember never send the password anywhere

    return {
      id: user.id,
      username: user.username
    }
  } catch (error) {
    console.error('Error in loginUserModel::: ', error)
    throw error
  }
}

export const registerUserModel = async (username, password) => {
  try {
    const [[user]] = await db.query('SELECT id FROM USER WHERE USERNAME = ?',
      [username])

    if (user) throw new UserExistError()

    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, salty)

    const userInserted = await db.query('INSERT INTO USER (ID, USERNAME, PASSWORD) VALUES (?, ?, ?)',
      [id, username, hashedPassword]
    )

    console.log('registerUserModel: User inserted::: ', userInserted)

    return {
      id
    }
  } catch (error) {
    console.error('Error in registerUserModel::: ', error)
    throw error
  }
}
