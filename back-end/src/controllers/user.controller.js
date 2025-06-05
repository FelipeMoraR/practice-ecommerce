import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV, SALT_ROUNDS } from '../config/config.js'
import bcrypt from 'bcrypt'
import { HttpError } from '../utils/customErrors.js'
import sendEmail from '../utils/sendEmail.js'
import { sqDb } from '../config/db.config.js'
import User from '../models/user.model.js'
import TokenWhiteList from '../models/tokenWhiteList.model.js'

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

// TODO Generate test for all controllers.

const handlerSendingEmailWithLink = async (idUser, emailUser, nameUser, lastNameUser, endpointConfirmEmail, expiredIn) => {
  const verifyToken = jwt.sign(
    { id: idUser },
    JWT_SECRET,
    { expiresIn: expiredIn }
  )

  const endpointComplete = endpointConfirmEmail + verifyToken

  await sendEmail(emailUser, endpointComplete, nameUser, lastNameUser)
}

const handlerExtractUtcTimestamp = async () => {
  const [result] = await sqDb.query('SELECT UTC_TIMESTAMP();') // NOTE With this i verify we are using the same time as sequelize configuration (Coordinated Universal Time)
  const now = result[0]['UTC_TIMESTAMP()']

  if (!now) throw new Error('Couldnt extract the time')

  return now
}

export const loginUserController = async (req, res) => {
  try {
    const result = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE User verification
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) throw new HttpError('Email not finded', 404)
      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (!passwordIsValid) throw new HttpError('Invalid password', 403)

      // NOTE Spam controll
      if ((now - user.lastVerificationEmailSentAt) / 1000 <= 90 && !user.isVerified) return { accessToken: null, refreshToken: null, isVerified: user.isVerified, emailSendInCooldown: true }

      // NOTE Sending email in case user isn't verified
      if (!user.isVerified) {
        const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/api/v1/users/confirm-email/'
        await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m')

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

    if (result.emailSendInCooldown && !result.isVerified) return res.status(403).send({ status: 403, message: 'Wait a while, email was sended...' })
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
    console.log('loginUserController::: ', error)
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
      const newUser = await User.create({ id, email, password: hashedPassword, name, lastName, fk_id_type_user: 2 })

      // NOTE Generate token, endpoint and sending email
      const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/api/v1/users/confirm-email/'
      await handlerSendingEmailWithLink(newUser.id, newUser.email, newUser.name, newUser.lastName, endpointWithOutToken, '10m')

      return newUser
    })

    return res.status(200).send({ status: 200, message: 'User Created!!!', data: { idUser: user.id } })
  } catch (error) {
    // NOTE Dont send all the info of error.
    console.error('registerUserController::: ', error)

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
    console.error('logoutUserController::: ', error)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const resendEmailVerificationController = async (req, res) => {
  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE User validation
      const { userId } = req.body
      const user = await User.findOne({ where: { id: userId } })
      if (!user) throw new HttpError('User not finded', 404)
      if (user.isVerified) return 204

      // NOTE Spam controll
      if (!user.isVerified && (now - user.lastVerificationEmailSentAt) / 1000 <= 90) {
        throw new HttpError('Email sended, wait a moment', 403)
      }

      // NOTE Sending email
      const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/api/v1/users/confirm-email/'
      await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m')
      await User.update({ lastVerificationEmailSentAt: now }, { where: { id: userId } })
      return 200
    })

    return res.status(statusVerification).send({ status: 200, message: statusVerification === 200 ? 'Email resended!!!' : null })
  } catch (error) {
    console.log('resendEmailVerificationController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const confirmEmailVerificationController = async (req, res) => {
  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE Token validation
      const token = req.params.emailToken
      if (!token) throw new HttpError('Token not finded', 404)

      // NOTE User validation
      const data = jwt.verify(token, JWT_SECRET)
      const user = await User.findOne({ where: { id: data.id } })
      if (!user) throw new HttpError('User not finded', 404)
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
    console.log('confirmEmailController::: ', error)
    if (error.name === 'TokenExpiredError') return res.status(498).send({ status: 498, message: 'Token invalid/expired' })
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const sendForgotPasswordEmailController = async (req, res) => {
  try {
    const dataStatus = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE Finding user
      const { email } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) throw new HttpError('User not finded', 404)

      // NOTE Email verify spam controll
      // NOTE Remember user has to be verified to use the forgot password controller
      if ((now - user.lastVerificationEmailSentAt) / 1000 <= 90 && !user.isVerified) throw new HttpError('Email verify user was already sended, wait a moment...', 403)

      // NOTE Sending email in case user isn't verified
      if (!user.isVerified) {
        const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/api/v1/users/confirm-email/'
        await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m')

        await User.update({ lastVerificationEmailSentAt: now }, { where: { id: user.id } })

        return { status: 200, message: 'Email verify user sended' }
      }

      // NOTE Spam controll
      if (user.lastForgotPasswordSentAt && (now - user.lastForgotPasswordSentAt) / 1000 <= 90) throw new HttpError('Email verify forgot password was already sended, wait a moment', 403)

      // NOTE Sending email
      const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/api/v1/users/confirm-email-forgot-pass/'
      await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '1h')
      await User.update({ lastForgotPasswordSentAt: now }, { where: { id: user.id } })

      return { status: 200, message: 'Email verify forgot password sended' }
    })

    return res.status(dataStatus.status).send({ status: dataStatus.status, message: dataStatus.message })
  } catch (error) {
    console.log('forgotPasswordSendEmailController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const confirmForgotPasswordController = async (req, res) => {
  try {
    const status = await sqDb.transaction(async () => {
      // NOTE Token validation
      const token = req.params.forgotPassToken
      if (!token) throw new HttpError('Token not finded', 404)

      // NOTE User validation
      const data = jwt.verify(token, JWT_SECRET) // NOTE this controll if the token is not valid (exp, secret, format, etc)
      const user = await User.findOne({ where: { id: data.id } })
      if (!user) throw new HttpError('User not finded', 404)

      // NOTE Saving token in white list
      const idToken = crypto.randomUUID()
      const expToken = new Date(data.exp * 1000)

      // ANCHOR 1 token per issue, if the user send 2 petitions of forgot password we have to inactive the oldest.
      const oldUserToken = await TokenWhiteList.findOne({ where: { fk_id_user: user.id, fk_id_type_token: 1 } })

      // NOTE This happend when the user try to confirm the forgot password for the first time
      if (!oldUserToken) {
        console.log('confirmForgotPasswordController::: Saving token')
        await TokenWhiteList.create({ id: idToken, token, expDate: expToken, fk_id_user: user.id, fk_id_type_token: 1 })
        return 200
      }

      // NOTE This is when the user make send the same token as previus.
      if (oldUserToken.token === token) {
        console.log('confirmForgotPasswordController::: Token already saved')
        return 304
      }

      // NOTE this is when user already has a token in the white list but send a new one
      if (oldUserToken.token !== token) {
        console.log('confirmForgotPasswordController::: Destroying old token and adding the new one')
        await TokenWhiteList.destroy({ where: { id: oldUserToken.id } })
        await TokenWhiteList.create({ id: idToken, token, expDate: expToken, fk_id_user: user.id, fk_id_type_token: 1 })
        return 200
      }
    })

    return res.status(status).send({
      status,
      message: 'User can change its password'
    })
  } catch (error) {
    console.log('confirmForgotPasswordController::: ', error)
    if (error.name === 'TokenExpiredError') return res.status(498).send({ status: 498, message: 'Token invalid/expired' })
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const changePasswordController = async (req, res) => {
  try {
    await sqDb.transaction(async () => {
      const { userId, newPassword } = req.body

      // NOTE Validating user
      const user = await User.findOne({ where: { id: userId } })
      if (!user) throw new HttpError('User not finded', 404)

      // NOTE Validating token
      const tokenInWhiteList = await TokenWhiteList.findOne({ where: { fk_id_user: user.id } })
      if (!tokenInWhiteList) throw new HttpError('Token doesnt exist', 404)
      if (tokenInWhiteList.isUsed) throw new HttpError('Token invalid, it was already used', 498)
      jwt.verify(tokenInWhiteList.token, JWT_SECRET)

      // NOTE Validating the new password
      const newPasswordIsNotNew = bcrypt.compareSync(newPassword, user.password)
      console.log(newPasswordIsNotNew)
      if (newPasswordIsNotNew) throw new HttpError('New password have to be new', 422)
      // NOTE Creating new password encripted
      const hashedPassword = bcrypt.hashSync(newPassword, salty)

      // NOTE Updating password user and invalidating token
      const now = await handlerExtractUtcTimestamp()

      await TokenWhiteList.update({ isUsed: true, updatedAt: now }, { where: { id: tokenInWhiteList.id } })
      await User.update({ password: hashedPassword, updatedAt: now }, { where: { id: userId } })
    })

    return res.status(200).send({
      status: 200,
      message: 'Password changed'
    })
  } catch (error) {
    console.log('changePasswordController::: ', error)
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
