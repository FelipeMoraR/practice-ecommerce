import { JWT_SECRET } from '../config/config.js'
import { HttpError } from '../utils/customErrors.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const privateRoute = (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token
    if (!accessToken) throw new HttpError('Access token not provided', 401)
    const verifiedToken = jwt.verify(accessToken, JWT_SECRET)
    // NOTE Pass data downstream as a new key of the req object
    req.userSession = verifiedToken
    next()
  } catch (error) {
    console.log('protectedRoute::: ', error)
    if (error.name === 'TokenExpiredError') return res.status(498).send({ status: 498, message: 'Token invalid/expired' })
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const adminRoute = async (req, res, next) => {
  try {
    if (!req.userSession) throw new HttpError('User info not exist', 404)
    const user = await User.findByPk(req.userSession.id)
    if (!user) throw new HttpError('User not exist', 404)
    if (user.fk_id_type_user !== 1) throw new HttpError('User has to be admin', 401)

    req.adminSession = { id: user.id, email: user.email }

    next()
  } catch (error) {
    console.log('adminRoute: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}
