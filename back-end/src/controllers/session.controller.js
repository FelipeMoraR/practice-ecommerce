import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from '../config/config.js'
import { HttpError } from '../utils/customErrors.js'
import TokenBlackList from '../models/tokenBlackList.model.js'
import User from '../models/user.model.js'
import { saveLogController } from './logger.controller.js'

export const refreshAccessTokenController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) throw new HttpError('Refresh token not provided', 404)

    const tokenValid = jwt.verify(refreshToken, JWT_SECRET)
    if (!tokenValid) throw new HttpError('Invalid refresh token', 406)

    const tokenIsBanned = await TokenBlackList.findOne({ where: { token: refreshToken } })
    if (tokenIsBanned) throw new HttpError('Invalid refresh token', 403)

    const user = await User.findOne({ where: { id: tokenValid.id } })
    if (!user) throw new HttpError('User not found', 404)

    await saveLogController('INFO', 'User refresh token', user.email, ip)

    const accessToken = jwt.sign(
      { id: user.id, userFullName: `${user.name} ${user.lastName}` },
      JWT_SECRET,
      { expiresIn: '10m' }
    )

    return res.status(200)
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 10 // 10 minutes
      }).send({ status: 200, message: 'Token refreshed successfully', user: { id: user.id, userFullName: `${user.name} ${user.lastName}`, typeUser: user.fk_id_type_user } })
  } catch (error) {
    console.error('refreshToken::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Error refreshing token' })
  }
}

export const validateAccessTokenController = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token
    if (!accessToken) throw new HttpError('Access token not provided', 401)

    const tokenIsValid = jwt.verify(accessToken, JWT_SECRET)

    if (!tokenIsValid) throw new HttpError('Access token is not valid', 406)

    return res.status(200).send({
      status: 200,
      user: { id: tokenIsValid.id, userFullName: tokenIsValid.userFullName, typeUser: tokenIsValid.typeUser }
    })
  } catch (error) {
    console.log('validateAccessTokenController::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Something went wrong' })
  }
}
