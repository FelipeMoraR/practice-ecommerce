import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from '../config/config.js'
import { HttpError } from '../utils/customErrors.js'
import User from '../models/user.model.js'

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) throw new HttpError('Refresh token not provided', 404)

    const tokenValid = jwt.verify(refreshToken, JWT_SECRET)
    if (!tokenValid) throw new HttpError('Invalid refresh token', 406)

    const user = await User.findOne({ where: { id: tokenValid.id } })

    if (!user) throw new HttpError('User not finded', 404)

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '10m' }
    )

    return res.status(200)
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 10 // 10 minutes
      }).send({ status: 200, message: 'Token refreshed successfully' })
  } catch (error) {
    console.error('refreshToken::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Error refreshing token' })
  }
}

export const getSessionInfoController = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token
    if (!accessToken) throw new HttpError('Access token not provided', 401)

    const tokenIsValid = jwt.verify(accessToken, JWT_SECRET)

    console.log('getSessionInfoController tokenIsValid:: ', tokenIsValid)

    if (!tokenIsValid) throw new HttpError('Access token is not valid', 406)

    return res.status(200).send({
      status: 200,
      user: {
        id: tokenIsValid.id,
        username: tokenIsValid.username
      }
    })
  } catch (error) {
    // TODO not show all the error
    console.log('getSessionInfoController::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Something went wrong' })
  }
}
