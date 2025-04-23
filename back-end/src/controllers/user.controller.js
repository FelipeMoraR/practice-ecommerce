// import { UserRepository } from '../../model/user-repository.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from '../config/config.js'
import { loginUserModel, registerUserModel } from '../models/user.module.js'

export const loginUserController = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await loginUserModel(username, password)
    const accessToken = jwt.sign({ id: user.id, user: user.username }, JWT_SECRET,
      {
        expiresIn: '10m'
      })

    const refreshToken = jwt.sign({ id: user.id, user: user.username }, JWT_SECRET,
      {
        expiresIn: '7d'
      })

    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 10 // 10 minutes
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 7 // 7 hours
      })
      .send({ user })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

// This need be fixed
export const registerUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await registerUserModel(username, password)
    res.status(200).send({ status: 200, message: 'User Created', id })
  } catch (error) {
    // Dont send all the error.
    res.status(500).send({ error: error.message })
  }
}

export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .send({ message: 'Logout successful' })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

export const protectedRoute = (req, res) => {
  // JWT ayuda con la seguridad en la interaccion entre 2 partes, se divide en 3 partes: header, payload y signature, permite autenticacion de estado.
  const token = req.cookies.access_token

  if (!token) return res.status(401).send('Access not authorized')

  try {
    const data = jwt.verify(token, JWT_SECRET)
    res.status(200).send({ status: 200, data })
  } catch (error) {
    return res.status(500).send('Internal server error')
  }
}
