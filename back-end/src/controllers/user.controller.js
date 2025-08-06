/* eslint-disable quotes */
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV, SALT_ROUNDS } from '../config/config.js'
import bcrypt from 'bcrypt'
import { HttpError } from '../utils/customErrors.js'
import sendEmail from '../utils/sendEmail.js'
import { sqDb } from '../config/db.config.js'
import User from '../models/user.model.js'
import handlerExtractUtcTimestamp from '../utils/extractUtcTimeStamp.js'
import TokenWhiteList from '../models/tokenWhiteList.model.js'
import TokenBlackList from '../models/tokenBlackList.model.js'
import UserAddress from '../models/userAddress.module.js'
import Address from '../models/address.model.js'
import Commune from '../models/commune.model.js'
import { randomBytes } from 'crypto'
import { Op } from 'sequelize'
import { saveLogController } from './logger.controller.js'

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

// TODO Verify proxy
// TODO Generate integration test for the remaining controllers
// REVIEW Id device has to be seted in the client, and the backend ensures that id in a cookie

// NOTE Handlers
const handlerSendingEmailWithLink = async (idUser, emailUser, nameUser, lastNameUser, customEndpoint, expiredIn, subject) => {
  const verifyToken = jwt.sign(
    { id: idUser },
    JWT_SECRET,
    { expiresIn: expiredIn }
  )

  const endpointComplete = customEndpoint + verifyToken

  await sendEmail(emailUser, endpointComplete, nameUser, lastNameUser, subject)
}

const handlerGetPostalCode = async (street, number, comune) => {
  // eslint-disable-next-line quotes
  try {
    const postalCode = await fetch(`https://api.pudupostal.com/v1/postal?direccion=${street}&comuna=${comune}&numero=${number}`)
    const result = await postalCode.json()
    return result
  } catch (error) {
    console.log('handlerGetPostalCode: ', error.status)
    return null
  }
}

// NOTE login, Tested
export const loginUserController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null // NOTE CF-Connecting-IP because i will upload in cloudefare

  try {
    const { email, password } = req.body
    const deviceIdReceived = req.cookies.id_device || req.body.deviceId || null

    if (!deviceIdReceived) throw new HttpError('deviceId not seted', 403)

    const result = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE User verification
      const user = await User.findOne({ where: { email } })
      if (!user) throw new HttpError('Email or password invalid', 401)

      const passwordIsValid = await bcrypt.compare(password, user.password)
      if (!passwordIsValid) {
        await saveLogController('ERROR', 'Attemp to login but fails in autentication', email, ip)
        throw new HttpError('Email or password invalid', 401)
      }

      // NOTE Spam controll to user verification
      // ANCHOR i remove this, we dont remember why we put this user.lastForgotPasswordSentAt &&
      if ((now - user.lastVerificationEmailSentAt) / 1000 <= 90 && !user.isVerified) {
        await saveLogController('WARNING', 'Attemp to login but user wasnt verified. Email was already sended', email, ip)
        return { accessToken: null, refreshToken: null, deviceId: null, isVerified: user.isVerified, emailSendInCooldown: true, user: null }
      }

      // NOTE Sending email in case user isn't verified
      if (!user.isVerified) {
        const endpointWithOutToken = process.env.CORS_ORIGIN + '/verifying-email?token='
        await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m', 'Verify email')

        await User.update({ lastVerificationEmailSentAt: now, updatedAt: now }, { where: { id: user.id } })
        await saveLogController('AUDIT', 'Attemp to login but user wasnt verified. Email was sended', email, ip)

        return { accessToken: null, refreshToken: null, deviceId: null, isVerified: user.isVerified, emailSendInCooldown: false, user: null }
      }

      // NOTE Generate access tokens
      const accessToken = jwt.sign(
        { id: user.id, userFullName: `${user.name} ${user.lastName}` },
        JWT_SECRET,
        {
          expiresIn: '10m'
        })
      const idRefreshToken = crypto.randomUUID()
      const refreshToken = jwt.sign(
        { id: user.id, jti: idRefreshToken },
        JWT_SECRET,
        {
          expiresIn: '7d'
        })

      await saveLogController('AUDIT', 'Validating if the user has already a session with one device', email, ip)
      const oldTokenInWhiteList = await TokenWhiteList.findOne({ where: { id_device: deviceIdReceived } })

      if (oldTokenInWhiteList) {
        const oldToken = jwt.decode(oldTokenInWhiteList.token)
        const expOldToken = new Date(oldToken.exp * 1000)
        await TokenWhiteList.destroy({ where: { id_device: deviceIdReceived } })
        const idNewBlackListToken = crypto.randomUUID()
        await TokenBlackList.create({ id: idNewBlackListToken, token: oldTokenInWhiteList.token, expDate: expOldToken, fk_id_user: oldTokenInWhiteList.fk_id_user, fk_id_type_token: 2 })
      }

      // NOTE Saving token in white list
      const dataRefreshToken = jwt.decode(refreshToken)
      const expRefreshToken = new Date(dataRefreshToken.exp * 1000)

      // NOTE type 2 is for refresh token
      await TokenWhiteList.create({ id: idRefreshToken, token: refreshToken, id_device: deviceIdReceived, expDate: expRefreshToken, fk_id_user: user.id, fk_id_type_token: 2 })

      return { accessToken, refreshToken, deviceId: deviceIdReceived, isVerified: user.isVerified, user }
    })

    if (result.emailSendInCooldown && !result.isVerified) return res.status(403).send({ status: 403, message: 'Email has to be verified but an email was already sended. Wait a while...' })
    if (!result.isVerified) return res.status(403).send({ status: 403, message: 'User must be email verified' })

    await saveLogController('AUDIT', 'User loged successfull', email, ip)

    return res
      .cookie('id_device', result.deviceId, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365 // 365 days
      })
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
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
      .send({ status: 200, message: 'User logged!!!', user: { id: result.user.id, userFullName: `${result.user.name} ${result.user.lastName}`, typeUser: result.user.fk_id_type_user } })
  } catch (error) {
    console.log('loginUserController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'loginUserController: ' + error.message, null, ip)

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Tested
export const registerUserController = async (req, res) => {
  const startTime = performance.now()
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    const { email, password, name, lastName } = req.body
    await sqDb.transaction(async () => {
      // NOTE Prev validations
      const userExist = await User.findOne({ where: { email } })
      if (userExist) {
        await saveLogController('WARNING', 'User tried to register but he already has an account', email, ip)
        throw new HttpError('User already exist', 409)
      }

      // NOTE Creating user
      const id = crypto.randomUUID()
      const hashedPassword = await bcrypt.hash(password, salty)
      const newUser = await User.create({ id, email, password: hashedPassword, name, lastName, fk_id_type_user: 2 })

      // NOTE Generate token, endpoint and sending email
      // NOTE This will be controlled in the front, we extract the token as a param and validate with the confirmEmailVerificationController
      const endpointWithOutToken = process.env.CORS_ORIGIN + '/verifying-email?token='
      await handlerSendingEmailWithLink(newUser.id, newUser.email, newUser.name, newUser.lastName, endpointWithOutToken, '10m', 'Verify email')
      await saveLogController('AUDIT', 'verification email Sended', email, ip)
    })
    const endTime = performance.now()
    await saveLogController('AUDIT', `User registered, time performance ${endTime - startTime}`, email, ip)
    return res.status(200).send({ status: 200, message: 'User Created!!!' })
  } catch (error) {
    // NOTE Dont send all the info of error.
    const endTime = performance.now()
    await saveLogController('AUDIT', `Time to register and fail ${endTime - startTime}`, null, ip)

    console.error('registerUserController::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'registerUserController: ' + error.message, null, ip)

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Tested
export const logoutUserController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    await sqDb.transaction(async () => {
      const cookieRefreshTokenBrowser = req.cookies.refresh_token
      if (!cookieRefreshTokenBrowser) throw new HttpError('No cookie provided', 404)
      const tokenData = jwt.decode(cookieRefreshTokenBrowser)

      const userData = await User.findByPk(tokenData.id)
      if (!userData) {
        await saveLogController('ERROR', 'Trying to logout with a id user that do not exist', null, ip)
        throw new HttpError('User not exist', 404)
      }

      await saveLogController('AUDIT', 'User logout', userData.email, ip)
      const tokenIsValid = await TokenWhiteList.findByPk(tokenData.jti)
      if (!tokenIsValid) throw new HttpError('Token not exist in white list', 404)
      await TokenWhiteList.destroy({ where: { id: tokenData.jti } })

      // NOTE saving token in blackList
      const expDateToken = new Date(tokenData.exp * 1000)
      const idNewBlackListToken = crypto.randomUUID()
      await TokenBlackList.create({ id: idNewBlackListToken, token: cookieRefreshTokenBrowser, expDate: expDateToken, fk_id_user: tokenData.id, fk_id_type_token: 2 })
    })
    return res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .clearCookie('id_device')
      .status(200)
      .send({ status: 200, message: 'Logout successful' })
  } catch (error) {
    console.error('logoutUserController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'logoutUserController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Email Verification, Tested end-2-end
export const confirmEmailVerificationController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE Token validation
      const token = req.params.token

      // NOTE User validation
      const data = jwt.verify(token, JWT_SECRET)
      const user = await User.findByPk(data.id)
      if (!user) {
        await saveLogController('WARNING', 'Trying to use a token with a bad id user', null, ip)
        throw new HttpError('User not found', 404)
      }
      if (user.isVerified) return 304

      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()

      // NOTE updating verification
      await User.update({ isVerified: true, updateAt: now }, { where: { id: data.id } })
      await saveLogController('AUDIT', 'User verified his email', user.email, ip)

      return 200
    })

    // TODO this has to redirect you to the login page.
    return res.status(statusVerification).send({
      status: statusVerification,
      message: statusVerification === 200 ? 'Email verified!!!' : null
    })
  } catch (error) {
    console.log('confirmEmailController::: ', error)
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      await saveLogController('ERROR', 'confirmEmailVerificationController: ' + error.message, null, ip)
      return res.status(498).send({ status: 498, message: error.message })
    }
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'confirmEmailVerificationController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Tested
export const sendEmailVerificationController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE User validation
      const { email } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) throw new HttpError('User not found', 404)
      if (user.isVerified) {
        await saveLogController('AUDIT', 'User is verified but tried to send another email', user.email, ip)
        return 204
      }

      // NOTE Spam controll
      if (!user.isVerified && (now - user.lastVerificationEmailSentAt) / 1000 <= 90) {
        await saveLogController('AUDIT', 'User trying to send another verification email but is in cooldown', user.email, ip)
        throw new HttpError('Email sended, wait a moment', 403)
      }

      // NOTE Sending email
      const endpointWithOutToken = process.env.CORS_ORIGIN + '/verifying-email?token='
      await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m', 'Verify email')

      await User.update({ lastVerificationEmailSentAt: now, updateAt: now }, { where: { email } })
      await saveLogController('INFO', 'User send a new email verification', user.email, ip)

      return 200
    })

    return res.status(statusVerification).send({ status: 200, message: statusVerification === 200 ? 'Email resended!!!' : null })
  } catch (error) {
    console.log('sendEmailVerificationController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'sendEmailVerificationController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Forgot password, Tested
export const sendForgotPasswordEmailController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    const dataStatus = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE Finding user
      const { email } = req.body
      const deviceIdReceived = req.cookies.id_device || req.body.deviceId || null

      if (!deviceIdReceived) throw new HttpError('Id device not seted', 403)

      const user = await User.findOne({ where: { email } })
      if (!user) {
        await saveLogController('AUDIT', 'User trying to change password with a invalid email', email, ip)
        throw new HttpError('User not found', 404)
      }

      // NOTE Email verify spam controll
      // NOTE Remember user has to be verified to use the forgot password controller
      if (user.lastVerificationEmailSentAt && (now - user.lastVerificationEmailSentAt) / 1000 <= 90 && !user.isVerified) {
        await saveLogController('WARNING', 'User trying to send another verification email but is in cooldown', user.email, ip)
        throw new HttpError('The email to verify user was already sended, wait a moment...', 403)
      }

      // NOTE Sending email in case user isn't verified
      if (!user.isVerified) {
        const endpointWithOutToken = process.env.CORS_ORIGIN + '/verifying-email?token='
        await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m', 'Forgot password')

        await User.update({ lastVerificationEmailSentAt: now, updateAt: now }, { where: { id: user.id } })
        await saveLogController('INFO', 'User send a new email verification', user.email, ip)

        return { status: 200, message: 'The email to verify user was sended' }
      }

      // NOTE Spam controll forgot password
      if (user.lastForgotPasswordSentAt && (now - user.lastForgotPasswordSentAt) / 1000 <= 90) {
        await saveLogController('WARNING', 'User trying to send another forgot password email but is in cooldown', user.email, ip)
        throw new HttpError('The email to verify the forgot password was already sended, wait a moment...', 403)
      }

      // NOTE Unvalidating all old reset password tokens
      const allOldTokens = await TokenWhiteList.findAll({ where: { fk_id_user: user.id, fk_id_type_token: 1 } })
      await TokenWhiteList.destroy({ where: { fk_id_user: user.id, fk_id_type_token: 1 } })
      if (allOldTokens.length > 0) {
        allOldTokens.forEach(async (oldToken) => {
          const idTokenBlackList = crypto.randomUUID()
          await TokenBlackList.create({ id: idTokenBlackList, token: oldToken.token, fk_id_user: user.id, fk_id_type_token: 1 })
        })
      }

      // NOTE Saving a new one token forgot password
      const idResetTokenWhiteList = crypto.randomUUID()
      const passwordResetTokenJwt = jwt.sign(
        { id: user.id, jti: idResetTokenWhiteList, type: 'passwordReset' },
        JWT_SECRET,
        { expiresIn: '15m' }
      )

      const secretReset = randomBytes(32).toString('hex')
      const hashedResetToken = await bcrypt.hash(secretReset, salty)
      const decodeResetTokenJwt = jwt.decode(passwordResetTokenJwt)

      await TokenWhiteList.create({
        id: idResetTokenWhiteList,
        token: hashedResetToken,
        id_device: deviceIdReceived,
        expDate: new Date(decodeResetTokenJwt.exp * 1000),
        fk_id_user: user.id,
        fk_id_type_token: 1
      })

      // NOTE Sending email
      // TODO This has to be send to the update password form
      const endpoint = process.env.CORS_ORIGIN + '/reset-password?token=' + passwordResetTokenJwt + '&secret=' + secretReset
      await sendEmail(user.email, endpoint, user.name, user.lastName, 'Forgot password')

      await User.update({ lastForgotPasswordSentAt: now, updateAt: now }, { where: { id: user.id } })
      await saveLogController('INFO', 'User sended a new email to retrieve his password', user.email, ip)

      return { status: 200, message: 'The email to verify the forgot password was sended' }
    })

    return res.status(dataStatus.status).send({ status: dataStatus.status, message: dataStatus.message })
  } catch (error) {
    console.log('sendForgotPasswordEmailController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'sendForgotPasswordEmailController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// ANCHOR This return a 401 be carefull, testing end-2-end
export const changePasswordController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    await sqDb.transaction(async () => {
      const { token, secret, newPassword } = req.body
      // NOTE Validate token with jwt
      const dataToken = jwt.verify(token, JWT_SECRET)

      const tokenIsBanned = await TokenBlackList.findByPk(dataToken.jti)
      if (tokenIsBanned) {
        await saveLogController('AUDIT', 'Attempt to use a banned token to change password', null, ip)
        throw new HttpError('Token is banned', 401)
      }

      // NOTE Validating token in whiteList
      const tokenInWhiteList = await TokenWhiteList.findOne({ where: { fk_id_user: dataToken.id, fk_id_type_token: 1 } })
      if (!tokenInWhiteList) {
        await saveLogController('AUDIT', 'Attempt to use an invalid token to change password', null, ip)
        throw new HttpError('Token doesnt exist', 404)
      }

      const isSecretMatch = await bcrypt.compare(secret, tokenInWhiteList.token)
      if (!isSecretMatch) {
        await saveLogController('AUDIT', 'Attempt to use an invalid secret to change password', null, ip)
        throw new HttpError('Invalid secret', 401)
      }

      // NOTE Validating the new password
      const user = await User.findByPk(dataToken.id)
      if (!user) throw new HttpError('User do not exist', 404)
      const newPasswordIsNotNew = await bcrypt.compare(newPassword, user.password)
      if (newPasswordIsNotNew) {
        await saveLogController('AUDIT', 'Attempt to use the old password to change password', user.email, ip)
        throw new HttpError('New password have to be new', 422)
      }

      // NOTE Creating new password encripted
      const hashedPassword = await bcrypt.hash(newPassword, salty)

      // NOTE Updating password user and invalidating token
      const now = await handlerExtractUtcTimestamp()

      await TokenWhiteList.destroy({ where: { id: tokenInWhiteList.id } })
      await TokenBlackList.create({ id: tokenInWhiteList.id, token: tokenInWhiteList.token, fk_id_user: tokenInWhiteList.fk_id_user, fk_id_type_token: tokenInWhiteList.fk_id_type_token })
      await User.update({ password: hashedPassword, updatedAt: now }, { where: { id: user.id } })

      await saveLogController('INFO', 'User change password correctly', user.email, ip)
    })

    return res.status(200).send({
      status: 200,
      message: 'Password changed'
    })
  } catch (error) {
    console.log('changePasswordController::: ', error)
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      await saveLogController('ERROR', 'changePasswordController: ' + error.message, null, ip)
      return res.status(498).send({ status: 498, message: error.message })
    }
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'changePasswordController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE User data, Tested
export const viewUserController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  console.log('called viewUserController')
  try {
    const user = await sqDb.transaction(async () => {
      const { id } = req.userSession
      const userInfo = await User.findOne({ include: { model: UserAddress, include: { model: Address, include: { model: Commune } } }, where: { id } })
      if (!userInfo) throw new HttpError('User not found', 404)

      const userInfoParsed = { email: userInfo.email, name: userInfo.name, lastname: userInfo.lastName, phone: userInfo.phone, isVerified: userInfo.isVerified, addresses: [] }

      if (!userInfo.useraddresses) return userInfoParsed

      const addressesParsed = userInfo.useraddresses.map(addrs => {
        const addressToSave = { id: addrs.id, name: addrs.name, street: addrs.address.street, number: addrs.address.number, numDpto: addrs.address.numDpto, postalCode: addrs.address.postalCode, commune: addrs.address.commune.name }
        return addressToSave
      })

      userInfoParsed.addresses = addressesParsed

      return userInfoParsed
    })

    return res.status(200).send({ status: 200, user })
  } catch (error) {
    console.log('viewUserController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'viewUserController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE This was created to prevent scams, such as making a purchase and then canceling it multiple times and then changing the name.
// NOTE Tested
export const updateBasicUserInfoController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    await sqDb.transaction(async () => {
      const { id } = req.userSession
      const { name, lastName } = req.body

      // NOTE No changes sended
      if (!name && !lastName) throw new HttpError('Not modified', 304)

      const userExist = await User.findByPk(id)
      if (!userExist) {
        await saveLogController('AUDIT', 'Attemp to update an user that doesnt exist', null, ip)
        throw new HttpError('User not found', 404)
      }

      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()
      if (userExist.lastUpdateBasicInfoUserByUser) {
        if ((now - userExist.lastUpdateBasicInfoUserByUser) / 1000 < 2592000) {
          throw new HttpError('User can not update their values because 30 days have not passed since the last update', 403)
        }
      }

      const valuesToUpdate = {
        name: name || userExist.name,
        lastName: lastName || userExist.lastName,
        updatedAt: now,
        lastUpdateBasicInfoUserByUser: now
      }

      await User.update(valuesToUpdate, { where: { id } })
      await saveLogController('INFO', 'User updated his values', userExist.email, ip)
    })

    return res.status(200).send({ status: 200, message: 'User personal info updated!' })
  } catch (error) {
    console.log('updateBasicUserInfoController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'updateBasicUserInfoController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Tested
export const updateUserPhoneController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    await sqDb.transaction(async () => {
      const { id: idUser } = req.userSession

      const user = await User.findByPk(idUser)
      if (!user) throw new HttpError('User not found', 404)

      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()

      const { phone } = req.body

      await User.update({ phone, updatedAt: now }, { where: { id: idUser } })
      await saveLogController('INFO', 'User phone updated', user.email, ip)
    })

    return res.status(200).send({ status: 200, message: 'Phone user updated' })
  } catch (error) {
    console.log('updateUserPhoneController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'updateUserPhoneController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// TODO When the user change the password all sesion has to be ended, so i have to think in a way to controll the access token...
// NOTE Tested
export const updateUserPasswordController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    const { id } = req.userSession
    const { oldPassword, newPassword } = req.body

    await sqDb.transaction(async () => {
      const user = await User.findByPk(id)
      if (!user) throw new HttpError('User not found', 404)

      const oldPasswordIsValid = await bcrypt.compare(oldPassword, user.password)

      if (!oldPasswordIsValid) {
        await saveLogController('WARNING', 'User tried to change password and failed', user.email, ip)
        throw new HttpError('Old password not valid', 401)
      }
      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()

      const newPassordToSave = await bcrypt.hash(newPassword, salty)

      await User.update({ password: newPassordToSave, updatedAt: now }, { where: { id } })
      await saveLogController('INFO', 'User change password successfully', user.email, ip)

      const allTokenWhiteList = await TokenWhiteList.findAll({ where: { fk_id_user: id } })

      // NOTE If no session is up
      if (allTokenWhiteList.length <= 0) return

      const destroyAllTokenWhiteListPromise = TokenWhiteList.destroy({ where: { fk_id_user: id } })
      const addBlackListTokenPromise = allTokenWhiteList.map(el => {
        const randomId = crypto.randomUUID()
        return TokenBlackList.create({ id: randomId, token: el.token, fk_id_user: el.fk_id_user, fk_id_type_token: el.fk_id_type_token })
      })

      await Promise.all([...addBlackListTokenPromise, destroyAllTokenWhiteListPromise])
    })

    return res.status(200).send({ status: 200, message: 'Password changed!' })
  } catch (error) {
    console.log('updateUserPasswordController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'updateUserPasswordController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Tested
export const addUserAddressController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    await sqDb.transaction(async () => {
      const { id: idUser } = req.userSession

      const user = await User.findByPk(idUser)
      if (!user) throw new HttpError('User not found', 404)

      const { street, number, numDpto = null, postalCode, idCommune } = req.body

      const comunneExist = await Commune.findByPk(idCommune)
      if (!comunneExist) {
        await saveLogController('AUDIT', 'Trying to use an invalid commune id', user.email, ip)
        throw new HttpError('Commune not exist in table', 404)
      }

      const { count } = await UserAddress.findAndCountAll({ where: { fk_id_user: idUser } })

      if (count >= 3) {
        await saveLogController('AUDIT', 'User trying to add a new address but he reatches the limit', user.email, ip)
        throw new HttpError('Limit address reached', 409)
      }

      const addressIsRepeated = await UserAddress.findOne({ include: { model: Address, where: { street, number, numDpto, fk_id_commune: idCommune } }, where: { fk_id_user: idUser } })
      if (addressIsRepeated) {
        await saveLogController('AUDIT', 'User trying to add a new address but he already has one equal', user.email, ip)
        throw new HttpError('That address was already saved', 409)
      }

      const postalCodeResponse = await handlerGetPostalCode(street, number, comunneExist.name)

      if (!postalCodeResponse || postalCodeResponse.status) {
        const errorMessage = postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code'
        const errorStatus = postalCodeResponse && postalCodeResponse.status ? postalCodeResponse.status : 500
        await saveLogController('ERROR', postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code', user.email, ip)
        throw new HttpError(errorMessage, errorStatus)
      }

      if (postalCode !== postalCodeResponse.codigoPostal) {
        await saveLogController('ERROR', 'User sent an invalid postal code', user.email, ip)
        throw new HttpError('Postal code provided not valid', 403)
      }

      const idAddress = crypto.randomUUID()
      const newUserAddress = await Address.create({ id: idAddress, street, number, numDpto, postalCode, fk_id_commune: idCommune })
      const newNameUserAddress = user.name + 'Address'
      const newIdForUserAdress = crypto.randomUUID()
      await UserAddress.create({ id: newIdForUserAdress, name: newNameUserAddress, fk_id_user: idUser, fk_id_address: newUserAddress.id })
      await saveLogController('INFO', 'User saved a new address', user.email, ip)
    })

    return res.status(200).send({ status: 200, message: 'User address added!!!' })
  } catch (error) {
    console.log('addUserAddressController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'addUserAddressController: ' + error.message, null, ip)

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Tested
export const updateUserAddressController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    await sqDb.transaction(async () => {
      const { id: idUser } = req.userSession
      const { idAddress, street, number, numDpto, postalCode, idCommune } = req.body
      if (!street && !number && !numDpto && !postalCode && !idCommune) throw new HttpError('Not modified', 304)

      const user = await User.findByPk(idUser)
      if (!user) throw new HttpError('User not found', 404)

      const userAddressExist = await UserAddress.findOne({ where: { fk_id_user: idUser, fk_id_address: idAddress }, include: { model: Address, include: { model: Commune } } })
      if (!userAddressExist) {
        await saveLogController('AUDIT', 'User tried to update a non-exist address', user.email, ip)
        throw new HttpError('Address not found', 404)
      }

      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()

      // NOTE This allow flexibility to the front and send only the info that change
      const valuesToUpdate = {
        street: street || userAddressExist.address.street,
        number: number || userAddressExist.address.number,
        numDpto: numDpto || userAddressExist.address.numDpto,
        postalCode: postalCode || userAddressExist.address.postalCode,
        updatedAt: now,
        fk_id_commune: idCommune || userAddressExist.address.fk_id_commune
      }

      const addressIsRepeated = await UserAddress.findOne({ include: { model: Address, where: { street: valuesToUpdate.street, number: valuesToUpdate.number, numDpto: valuesToUpdate.numDpto, fk_id_commune: valuesToUpdate.fk_id_commune } }, where: { fk_id_user: idUser } })
      if (addressIsRepeated) {
        await saveLogController('AUDIT', 'User attempted to update to an existing address', user.email, ip)
        throw new HttpError('That address was already saved to the user', 409)
      }

      let newCommuneExist = null
      if (idCommune) {
        newCommuneExist = await Commune.findByPk(idCommune)
        if (!newCommuneExist) {
          await saveLogController('AUDIT', 'User tried to use an invalid id commune', user.email, ip)
          throw new HttpError('Commune not exist in table', 404)
        }
        valuesToUpdate.fk_id_commune = newCommuneExist.id
      }

      if (street || number || postalCode || newCommuneExist) {
        const postalCodeResponse = await handlerGetPostalCode(valuesToUpdate.street, valuesToUpdate.number, newCommuneExist ? newCommuneExist.name : userAddressExist.address.commune.name)

        if (!postalCodeResponse || postalCodeResponse.status) {
          const errorMessage = postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code'
          const errorStatus = postalCodeResponse && postalCodeResponse.status ? postalCodeResponse.status : 500
          await saveLogController('ERROR', postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code', user.email, ip)
          throw new HttpError(errorMessage, errorStatus)
        }

        if (valuesToUpdate.postalCode !== postalCodeResponse.codigoPostal) {
          await saveLogController('ERROR', 'User sent an invalid postal code', user.email, ip)
          throw new HttpError('Postal code provided not valid', 403)
        }
      }

      await Address.update(valuesToUpdate, { where: { id: idAddress } })
      await saveLogController('INGO', 'User updated an address', user.email, ip)
    })

    return res.status(200).send({ status: 200, message: 'Address updated!' })
  } catch (error) {
    console.log('updateUserAddressController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'updateUserAddressController: ' + error.message, null, ip)

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Tested
export const deleteUserAddressController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null

  try {
    await sqDb.transaction(async () => {
      const { id: idUser } = req.userSession
      const idAddress = req.params.idAddress

      const userAddressExist = await UserAddress.findOne({ where: { fk_id_user: idUser, fk_id_address: idAddress } })
      if (!userAddressExist) {
        await saveLogController('AUDIT', 'Attempt to delete an address with bad values', null, ip)
        throw new HttpError('Address not found', 404)
      }

      await UserAddress.destroy({ where: { fk_id_user: idUser, fk_id_address: idAddress } })
      await Address.destroy({ where: { id: idAddress } })
      await saveLogController('INFO', 'User address deleted', null, ip)
    })

    return res.status(200).send({ status: 200, message: 'Address deleted' })
  } catch (error) {
    console.log('deleteUserAddressController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'deleteUserAddressController: ' + error.message, null, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Admin basic crud, Tested
export const getAllClientsController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  const { email: adminEmail } = req.adminSession
  await saveLogController('AUDIT', 'Attemp to view all clients', adminEmail, ip)

  try {
    const { page = 0, size = 10, search = '', order = 'asc(name)' } = req.query
    const searchSpaces = search.split(' ')
    let searchConfig = {}
    if (searchSpaces.length > 1) {
      const andConfig = [
        { name: { [Op.like]: `%${searchSpaces[0]}%` } },
        { lastName: { [Op.like]: `%${searchSpaces[1]}%` } }
      ]
      searchConfig = { [Op.and]: andConfig }
    }

    if (searchSpaces.length === 1 && search !== '') {
      const orConfig = [
        { name: { [Op.regexp]: `.*${search}.*` } },
        { lastName: { [Op.regexp]: `.*${search}.*` } }
      ]

      searchConfig = { [Op.or]: orConfig }
    }

    let sort = [['name', 'ASC']]

    if (order !== 'asc(name)') {
      const newOrderSort = order.split(',').map(el => {
        const first = el.indexOf('(')
        const second = el.indexOf(')')

        if (first !== -1 && second !== -1) {
          const field = el.slice(first + 1, second)
          const direction = el.includes('asc') ? 'ASC' : 'DESC'
          // ANCHOR When we use the includes in the order statement we have to the specify the column of the tables that we wanna use
          if (field.includes('userAddressName')) return [{ model: UserAddress }, 'name', direction]

          if (field.includes('street')) return [{ model: UserAddress }, { model: Address }, 'street', direction]
          if (field.includes('number')) return [{ model: UserAddress }, { model: Address }, 'number', direction]
          if (field.includes('numDpto')) return [{ model: UserAddress }, { model: Address }, 'numDpto', direction]
          if (field.includes('postalCode')) return [{ model: UserAddress }, { model: Address }, 'postalCode', direction]

          if (field.includes('communeName')) return [{ model: UserAddress }, { model: Address }, { model: Commune }, 'name', direction]

          return [field, direction]
        }
        return null
      }).filter(el => el !== null)
      if (newOrderSort.length > 0) {
        sort = newOrderSort
      }
    }

    const whereUserConfig = { [Op.and]: [{ fk_id_type_user: 2 }, search !== '' ? searchConfig : {}] }
    const includeConfig = [{ model: UserAddress, include: [{ model: Address, include: [{ model: Commune }] }] }]
    const config = { where: whereUserConfig, include: includeConfig, limit: Number(size), offset: Number(page) * Number(size), order: sort }
    const resultUser = await sqDb.transaction(async () => {
      // NOTE Just clients
      const { count, rows } = await User.findAndCountAll(config)
      return { count, rows }
    })
    if (resultUser.rows.length <= 0) return res.status(200).send({ status: 200, data: [], count: 0, size: Number(size), page: Number(page), total: resultUser.count })

    const dataParsed = resultUser.rows.map(el => {
      const newUserToSave = { id: el.id, email: el.email, name: el.name, lastname: el.lastName, phone: el.phone, isVerified: el.isVerified, addresses: [] }

      if (!el.useraddresses) return newUserToSave

      const addressesParsed = el.useraddresses.map(addrs => {
        const addressToSave = { id: addrs.id, name: addrs.name, street: addrs.address.street, number: addrs.address.number, numDpto: addrs.address.numDpto, postalCode: addrs.address.postalCode, commune: addrs.address.commune.name }
        return addressToSave
      })
      newUserToSave.addresses = addressesParsed
      return newUserToSave
    })
    await saveLogController('INFO', 'Admin could see the clients', adminEmail, ip)
    return res.status(200).send({ status: 200, data: dataParsed, count: resultUser.rows.length, size: Number(size), page: Number(page), total: resultUser.count })
  } catch (error) {
    console.log('getAllClientsController: ', error)
    if (error.parent.errno === 1054) {
      await saveLogController('ERROR', 'Bad field error', adminEmail, ip)
      return res.status(400).send({ status: 400, message: 'Bad field error' })
    }
    if (error.name) await saveLogController('ERROR', 'getAllClientsController: ' + error.message, adminEmail, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const createClientController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  const { email: adminEmail } = req.adminSession
  await saveLogController('AUDIT', 'Attemp to create a client', adminEmail, ip)

  try {
    await sqDb.transaction(async () => {
      // NOTE Prev validations
      const { email, password, name, lastName } = req.body
      const userExist = await User.findOne({ where: { email } })
      if (userExist) throw new HttpError('User already exist', 409)

      // NOTE Creating user
      const id = crypto.randomUUID()
      const hashedPassword = await bcrypt.hash(password, salty)
      const newUser = await User.create({ id, email, password: hashedPassword, name, lastName, fk_id_type_user: 2 })

      // NOTE Generate token, endpoint and sending email
      // NOTE This will be controlled in the front, we extract the token as a para and validate with the confirmEmailVerificationController
      const endpointWithOutToken = process.env.CORS_ORIGIN + '/verifying-email?token='
      await handlerSendingEmailWithLink(newUser.id, newUser.email, newUser.name, newUser.lastName, endpointWithOutToken, '10m', 'Verify email')
      await saveLogController('INFO', 'Admin was able to created a new client', adminEmail, ip)
    })

    return res.status(200).send({ status: 200, message: 'User Created!!!' })
  } catch (error) {
    // NOTE Dont send all the info of error.
    console.error('createClientController::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'createClientController: ' + error.message, adminEmail, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// REVIEW Front has to send a confirmation of the action, like "U sure of deleting this user? This cant ne undone "
export const deleteClientController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  const { email: adminEmail } = req.adminSession
  await saveLogController('AUDIT', 'Attemp to eliminate a client', adminEmail, ip)

  try {
    await sqDb.transaction(async () => {
      const userId = req.params.userId
      const userFound = await User.findByPk(userId)
      if (!userFound) throw new HttpError('User not found', 404)

      const userAddresses = await UserAddress.findAll({ where: { fk_id_user: userId } })

      // NOTE User not has address
      if (userAddresses.length < 1) {
        await User.destroy({ where: { id: userId } })
        await saveLogController('AUDIT', 'Admin was able to delete an user and that user didnt have any addresses saved', adminEmail, ip)
        return
      }

      const addressPromises = userAddresses.map(el => Address.destroy({ where: { id: el.fk_id_address } }))
      await Promise.all(addressPromises)
      await User.destroy({ where: { id: userId } })
      await saveLogController('AUDIT', 'Admin was able to delete an user and his addresses', adminEmail, ip)
    })

    return res.status(200).send({ status: 200, message: 'User deleted!' })
  } catch (error) {
    console.log('deleteClientController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'deleteClientController: ' + error.message, adminEmail, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Generate two controllers, one to update address, and other to update only personal info
export const updateBasicClientInfoController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  const { email: adminEmail } = req.adminSession
  await saveLogController('AUDIT', 'Attemp to update the basic info of a client', adminEmail, ip)

  try {
    await sqDb.transaction(async () => {
      const { id, email, password, name, lastName, phone } = req.body
      // NOTE No changes sended
      if (!email && !password && !name && !lastName && !phone) throw new HttpError('Not modified', 304)

      if (email) {
        const emailAlreadyUsed = await User.findOne({ where: { [Op.and]: [{ email }, { id: { [Op.ne]: id } }] } })
        if (emailAlreadyUsed) {
          await saveLogController('AUDIT', 'Admin tried to update the email with an email that already exist', adminEmail, ip)
          throw new HttpError('Email not valid, other user already logged with that email', 409)
        }
      }
      const userExist = await User.findByPk(id)
      if (!userExist) {
        await saveLogController('AUDIT', 'Admin tried to update an user that doesnt exist', adminEmail, ip)
        throw new HttpError('User not found', 404)
      }

      let passwordToSave = userExist.password

      if (password) {
        passwordToSave = await bcrypt.hash(password, salty)
        await saveLogController('AUDIT', 'Admin updated the password of the client', adminEmail, ip)
      }

      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()

      const valuesToUpdate = {
        email: email || userExist.email,
        password: passwordToSave,
        name: name || userExist.name,
        lastName: lastName || userExist.lastName,
        phone: phone || userExist.phone,
        updatedAt: now,
        lastUpdateUserByAdmin: now,
        isVerified: userExist.isVerified ? (!email) : false
      }

      await User.update(valuesToUpdate, { where: { id } })
      await saveLogController('INFO', 'Admin was able to update the client', adminEmail, ip)
    })

    return res.status(200).send({ status: 200, message: 'User personal info updated!' })
  } catch (error) {
    console.log('updateBasicClientInfoController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'updateBasicClientInfoController: ' + error.message, adminEmail, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const updateAddressClientInfoController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  const { email: adminEmail } = req.adminSession
  await saveLogController('AUDIT', 'Attemp to update the address info of a client', adminEmail, ip)

  try {
    await sqDb.transaction(async () => {
      const { idUser, idAddress, street, number, numDpto, postalCode, idCommune } = req.body
      if (!street && !number && !numDpto && !postalCode && !idCommune) throw new HttpError('Not modified', 304)

      const user = await User.findByPk(idUser)
      if (!user) {
        await saveLogController('AUDIT', 'Admin tried to update an user that doesnt exist', adminEmail, ip)
        throw new HttpError('User not found', 404)
      }

      const userAddressExist = await UserAddress.findOne({ where: { fk_id_user: idUser, fk_id_address: idAddress }, include: { model: Address, include: { model: Commune } } })
      if (!userAddressExist) {
        await saveLogController('AUDIT', 'Admin tried to update an address that doesnt exist', adminEmail, ip)
        throw new HttpError('Address not found', 404)
      }

      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()

      // NOTE This allow flexibility to the front and send only the info that change
      const valuesToUpdate = {
        street: street || userAddressExist.address.street,
        number: number || userAddressExist.address.number,
        numDpto: numDpto || userAddressExist.address.numDpto,
        postalCode: postalCode || userAddressExist.address.postalCode,
        updatedAt: now,
        fk_id_commune: idCommune || userAddressExist.address.fk_id_commune
      }

      const addressIsRepeated = await UserAddress.findOne({ include: { model: Address, where: { street: valuesToUpdate.street, number: valuesToUpdate.number, numDpto: valuesToUpdate.numDpto, fk_id_commune: valuesToUpdate.fk_id_commune } }, where: { fk_id_user: idUser } })
      if (addressIsRepeated) {
        await saveLogController('AUDIT', 'Admin tried to update an address to an existing one', adminEmail, ip)
        throw new HttpError('That address was already saved to the user', 409)
      }

      let newCommuneExist = null
      if (idCommune) {
        newCommuneExist = await Commune.findByPk(idCommune)
        if (!newCommuneExist) {
          await saveLogController('AUDIT', 'Admin tried to use an invalid id commune', adminEmail, ip)
          throw new HttpError('Commune not exist in table', 404)
        }
        valuesToUpdate.fk_id_commune = newCommuneExist.id
      }

      if (street || number || postalCode || newCommuneExist) {
        const postalCodeResponse = await handlerGetPostalCode(valuesToUpdate.street, valuesToUpdate.number, newCommuneExist ? newCommuneExist.name : userAddressExist.address.commune.name)

        if (!postalCodeResponse || postalCodeResponse.status) {
          const errorMessage = postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code'
          const errorStatus = postalCodeResponse && postalCodeResponse.status ? postalCodeResponse.status : 500
          await saveLogController('ERROR', postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code', adminEmail, ip)
          throw new HttpError(errorMessage, errorStatus)
        }

        if (valuesToUpdate.postalCode !== postalCodeResponse.codigoPostal) {
          await saveLogController('ERROR', 'Admin sent an invalid postal code', adminEmail, ip)
          throw new HttpError('Postal code provided not valid', 403)
        }
      }

      await Address.update(valuesToUpdate, { where: { id: idAddress } })
      await User.update({ lastUpdateUserByAdmin: now, updatedAt: now }, { where: { id: idUser } })
      await saveLogController('INFO', 'Admin was able to update an address', adminEmail, ip)
    })

    return res.status(200).send({ status: 200, message: 'User address updated!' })
  } catch (error) {
    console.log('updateAddressClientInfoController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'updateAddressClientInfoController: ' + error.message, adminEmail, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const createNewAddressClientController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  const { email: adminEmail } = req.adminSession
  await saveLogController('AUDIT', 'Attemp to create a new address for a client', adminEmail, ip)

  try {
    await sqDb.transaction(async () => {
      const { idUser, street, number, numDpto, postalCode, idCommune } = req.body

      const user = await User.findByPk(idUser)
      if (!user) throw new HttpError('User not found', 404)

      const comunneExist = await Commune.findByPk(idCommune)
      if (!comunneExist) {
        await saveLogController('AUDIT', 'Admin tried to use an invalid commune id', user.email, ip)
        throw new HttpError('Commune not exist in table', 404)
      }

      const { count } = await UserAddress.findAndCountAll({ where: { fk_id_user: idUser } })

      if (count >= 3) {
        await saveLogController('AUDIT', 'Admin trying to add a new address but the user reatches the limit', user.email, ip)
        throw new HttpError('Limit address reached', 409)
      }

      const addressIsRepeated = await UserAddress.findOne({ include: { model: Address, where: { street, number, numDpto, fk_id_commune: idCommune } }, where: { fk_id_user: idUser } })
      if (addressIsRepeated) {
        await saveLogController('AUDIT', 'Admin trying to add a new address but the useer already has one equal', user.email, ip)
        throw new HttpError('That address was already saved', 409)
      }

      const postalCodeResponse = await handlerGetPostalCode(street, number, comunneExist.name)

      if (!postalCodeResponse || postalCodeResponse.status) {
        const errorMessage = postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code'
        const errorStatus = postalCodeResponse && postalCodeResponse.status ? postalCodeResponse.status : 500
        await saveLogController('ERROR', postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code', user.email, ip)
        throw new HttpError(errorMessage, errorStatus)
      }

      if (postalCode !== postalCodeResponse.codigoPostal) {
        await saveLogController('ERROR', 'Admin sent an invalid postal code for the new address', user.email, ip)
        throw new HttpError('Postal code provided not valid', 403)
      }

      const idAddress = crypto.randomUUID()
      const newUserAddress = await Address.create({ id: idAddress, street, number, numDpto, postalCode, fk_id_commune: idCommune })

      const newNameUserAddress = user.name + 'Address'
      const newIdForUserAdress = crypto.randomUUID()
      await UserAddress.create({ id: newIdForUserAdress, name: newNameUserAddress, fk_id_user: idUser, fk_id_address: newUserAddress.id })
      await saveLogController('INFO', 'User saved a new address', user.email, ip)
    })

    return res.status(200).send({ status: 200, message: 'User address updated!!!' })
  } catch (error) {
    console.log('addUserAddressController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'addUserAddressController: ' + error.message, null, ip)

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const deleteAddressClientController = async (req, res) => {
  const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAdrress || req.ip || null
  const { email: adminEmail } = req.adminSession
  await saveLogController('AUDIT', 'Attemp to delete an address of a client', adminEmail, ip)

  try {
    await sqDb.transaction(async () => {
      const idAddress = req.params.idAddress
      const idUser = req.params.idUser

      const userAddressExist = await UserAddress.findOne({ where: { fk_id_user: idUser, fk_id_address: idAddress } })
      if (!userAddressExist) {
        await saveLogController('AUDIT', 'Admin tried to delete an non-existing address', adminEmail, ip)
        throw new HttpError('Address not found', 404)
      }

      // NOTE Extract the actual time
      const extractUtcTimeStampPromise = handlerExtractUtcTimestamp()
      const userAddressDestroyPromise = UserAddress.destroy({ where: { fk_id_user: idUser, fk_id_address: idAddress } })
      const addressDestroyPromise = Address.destroy({ where: { id: idAddress } })

      const [nowResult] = await Promise.all([extractUtcTimeStampPromise, userAddressDestroyPromise, addressDestroyPromise])

      const userUpdatePromise = User.update({ lastUpdateUserByAdmin: nowResult, updateAt: nowResult }, { where: { id: idUser } })
      const saveLogPromise = saveLogController('INFO', 'Admin was able to delete an address', adminEmail, ip)

      await Promise.all([userUpdatePromise, saveLogPromise])
    })

    return res.status(200).send({ status: 200, message: 'Address deleted' })
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    if (error.message) await saveLogController('ERROR', 'updateAddressClientInfoController: ' + error.message, adminEmail, ip)
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}
