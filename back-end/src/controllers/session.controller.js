import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from '../config/config.js'

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) return res.status(401).send({ status: 401, message: 'No refresh token provided' })

    const tokenValid = jwt.verify(refreshToken, JWT_SECRET) // This send an error and it is catched?
    if (!tokenValid) return res.status(401).send({ status: 401, message: 'Invalid refresh token' })

    const accessToken = jwt.sign({ id: tokenValid.id, user: tokenValid.username }, JWT_SECRET,
      {
        expiresIn: '10m'
      })

    return res.status(200)
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 10 // 10 minutes
      }).send({ message: 'Token refreshed successfully' })
  } catch (error) {
    res.status(400).send({ message: 'Error refreshing token' })
  }
}
