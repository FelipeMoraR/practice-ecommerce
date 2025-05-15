import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV, SALT_ROUNDS } from '../config/config.js'
import bcrypt from 'bcrypt'
import { HttpError } from '../utils/customErrors.js'
import User from '../models/user.model.js'
import sendEmail from '../utils/sendEmail.js'
import { sqDb } from '../config/db.config.js'

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

// TODO Generate test for this controllers.

export const loginUserController = async (req, res) => {
  try {
    const result = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const [result] = await sqDb.query('SELECT UTC_TIMESTAMP();') // NOTE With this i verify we are using the same time as sequelize configuration (Coordinated Universal Time)
      const now = result[0]['UTC_TIMESTAMP()']

      // NOTE User verification
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) throw new HttpError('Email not founded', 404)
      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (!passwordIsValid) throw new HttpError('Invalid password', 403)

      // NOTE Spam controll
      if ((now - user.lastVerificationEmailSentAt) / 1000 <= 90) return { accessToken: null, refreshToken: null, isVerified: user.isVerified, emailSendInCooldown: true }

      // NOTE Sending email in case user isn't verified
      if (!user.isVerified) {
        const verifyEmailToken = jwt.sign(
          { id: user.id },
          JWT_SECRET,
          { expiresIn: '10m' }
        )
        const endpointConfirmEmail = process.env.CUSTOM_DOMAIN + '/api/users/confirm-email/' + verifyEmailToken
        await sendEmail(user.email, endpointConfirmEmail, user.name, user.lastName)
        await User.update({ lastVerificationEmailSentAt: now }, { where: { id: user.id } })

        return { accessToken: null, refreshToken: null, isVerified: user.isVerified, emailSendInCooldown: false }
      }

      // NOTE Generate access tokens
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        {
          expiresIn: '10m'
        })

      const refreshToken = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        {
          expiresIn: '7d'
        })

      return { accessToken, refreshToken, isVerified: user.isVerified }
    })

    if (result.emailSendInCooldown) return res.status(503).send({ status: 503, message: 'Wait a while, email was sended...' })
    if (!result.isVerified) return res.status(403).send({ status: 403, message: 'User must be email verified' })

    return res
      .cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 10 // 10 minutes
      })
      .cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 hours
      })
      .send({ status: 200, message: 'User logged!!!' })
  } catch (error) {
    console.log('Error in loginUserController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const registerUserController = async (req, res) => {
  try {
    const user = await sqDb.transaction(async () => {
      // NOTE Prev validations
      const { email, password, name, lastName } = req.body
      const userExist = await User.findOne({ where: { email } })
      if (userExist) throw new HttpError('User already exist', 409)

      // NOTE Creating user
      const id = crypto.randomUUID()
      const hashedPassword = bcrypt.hashSync(password, salty)
      const newUser = await User.create({ id, email, password: hashedPassword, name, lastName })

      // NOTE Generate token, endpoint and sending email
      const verifyEmailToken = jwt.sign(
        { id: newUser.id },
        JWT_SECRET,
        { expiresIn: '10m' }
      )
      const endpointConfirmEmail = process.env.CUSTOM_DOMAIN + '/api/users/confirm-email/' + verifyEmailToken
      await sendEmail(newUser.email, endpointConfirmEmail, newUser.name, newUser.lastName)

      return newUser
    })

    return res.status(200).send({ status: 200, message: 'User Created!!!', data: { idUser: user.id } })
  } catch (error) {
    // NOTE Dont send all the info of error.
    console.error('Error in registerUserController::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const logoutUserController = async (_, res) => {
  try {
    return res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .send({ message: 'Logout successful' })
  } catch (error) {
    console.error('Error in logoutUserController::: ', error)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const resendEmailVerificationController = async (req, res) => {
  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE User validation
      const { userId } = req.body
      const user = await User.findOne({ where: { id: userId } })
      if (!user) throw new HttpError('User not founded', 404)
      if (user.isVerified) return 204

      // NOTE Sending email
      const verifyEmailToken = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: '10m' }
      )
      const endpointConfirmEmail = process.env.CUSTOM_DOMAIN + '/api/users/confirm-email/' + verifyEmailToken
      await sendEmail(user.email, endpointConfirmEmail, user.name, user.lastName)
    })

    return res.status(statusVerification).send({ status: 200, message: statusVerification === 200 ? 'Email resended!!!' : null })
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const confirmEmailVerificationController = async (req, res) => {
  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE Token validation
      const token = req.params.emailToken
      if (!token) throw new HttpError('Token not founded', 404)

      // NOTE User validation
      const data = jwt.verify(token, JWT_SECRET)
      const user = await User.findOne({ where: { id: data.id } })
      if (!user) throw new HttpError('User not founded', 404)
      if (user.isVerified) return 304

      // NOTE updating verification
      await User.update({ isVerified: true }, { where: { id: data.id } })

      return 200
    })

    // TODO this has to redirect you to the login page.
    return res.status(statusVerification).send({
      status: statusVerification,
      message: statusVerification === 200 ? 'Email verified!!!' : null
    })
  } catch (error) {
    console.log('Error in confirmEmailController::: ', error)
    if (error.name === 'TokenExpiredError') return res.status(498).send({ status: 498, message: 'Token invalid/expired' })
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// TODO Delete THIS in the future
export const protectedRoute = (req, res) => {
  // NOTE JWT ayuda con la seguridad en la interaccion entre 2 partes, se divide en 3 partes: header, payload y signature, permite autenticacion de estado.
  const token = req.cookies.access_token

  if (!token) return res.status(401).send('Access not authorized')

  try {
    const data = jwt.verify(token, JWT_SECRET)
    return res.status(200).send({ status: 200, data })
  } catch (error) {
    return res.status(500).send('Internal server error')
  }
}
