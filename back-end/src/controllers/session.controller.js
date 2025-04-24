import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from '../config/config.js'
import { getUserModel } from '../models/user.model.js'

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) return res.status(404).send({ status: 404, message: 'Refresh token not provided' })

    const tokenValid = jwt.verify(refreshToken, JWT_SECRET)
    if (!tokenValid) return res.status(406).send({ status: 406, message: 'Invalid refresh token' })

    const user = await getUserModel(tokenValid.id)

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
      }).send({ message: 'Token refreshed successfully' })
  } catch (error) {
    console.error('Error in refreshToken::: ', error)
    return res.status(400).send({ message: 'Error refreshing token' })
  }
}

export const getSessionInfoController = async (req, res) => {
  const accessToken = req.cookies.access_token
  if (!accessToken) return res.status(401).send({ status: 401, message: 'Access token not provided' })

  const tokenIsValid = jwt.verify(accessToken, JWT_SECRET)
  console.log(tokenIsValid)
  if (!tokenIsValid) return res.status(406).send({ status: 406, message: 'Access token is not valid' })

  return res.status(200).send({
    status: 200,
    user: {
      id: tokenIsValid.id,
      username: tokenIsValid.username
    }
  })
}
