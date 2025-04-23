import { SALT_ROUNDS } from '../config/config.js'
import { db } from '../config/db.config.js'
import bcrypt from 'bcrypt'

// export const testBd = async () => {
//   try {
//     const [rows] = await db.execute('SELECT * FROM test') // If you use only rows without the brackets you will recibe the metadata of the query as other array [rows, fields]
//     return rows
//   } catch (error) {
//     console.log('Error in testBd', error)
//     throw error
//   }
// }

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

export const loginUserModel = async (username, password) => {
  try {
    const [[user]] = await db.query('SELECT id, username, password FROM USER WHERE USERNAME = ?',
      [username])

    if (!user) throw new Error('User not founded')

    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) throw new Error('Invalid password') // Remember never send the password anywhere

    return {
      id: user.id,
      username: user.username
    }
  } catch (error) {
    console.error('Error in login', error)
    throw error
  }
}

export const registerUserModel = async (username, password) => {
  try {
    const [[user]] = await db.query('SELECT id FROM USER WHERE USERNAME = ?',
      [username])

    if (user) throw new Error('User already exist')

    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, salty)

    const userInserted = await db.query('INSERT INTO USER (ID, USERNAME, PASSWORD) VALUES (?, ?, ?)',
      [id, username, hashedPassword]
    )

    console.log('userInserted => ', userInserted)

    return {
      id
    }
  } catch (error) {
    console.error('Error user register', error)
    throw error
  }
}
