import { JWT_SECRET } from '../config/config.js'
import { HttpError } from '../utils/customErrors.js'
import jwt from 'jsonwebtoken'

export const privateRoute = (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token
    if (!accessToken) throw new HttpError('Access token not provided', 404)
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
