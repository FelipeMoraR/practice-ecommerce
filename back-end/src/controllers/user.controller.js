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
const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

// TODO Generate test for all controllers.
// TODO Generate logger db and controllers
// TODO User can change some values, but one time per 60 days

// NOTE Handlers
const handlerSendingEmailWithLink = async (idUser, emailUser, nameUser, lastNameUser, customEndpoint, expiredIn, customToken) => {
  const verifyToken = jwt.sign(
    { id: idUser },
    JWT_SECRET,
    { expiresIn: expiredIn }
  )

  const endpointComplete = customEndpoint + verifyToken

  await sendEmail(emailUser, endpointComplete, nameUser, lastNameUser)
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

// NOTE Basic login logic
export const loginUserController = async (req, res) => {
  try {
    const result = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE User verification
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) throw new HttpError('Email not found', 404)
      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (!passwordIsValid) throw new HttpError('Invalid password', 403)

      // NOTE Spam controll to user verification
      if ((now - user.lastVerificationEmailSentAt) / 1000 <= 90 && !user.isVerified) return { accessToken: null, refreshToken: null, isVerified: user.isVerified, emailSendInCooldown: true }

      // NOTE Sending email in case user isn't verified
      if (!user.isVerified) {
        const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/verifying-email?token='
        await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m')

        await User.update({ lastVerificationEmailSentAt: now, updatedAt: now }, { where: { id: user.id } })

        return { accessToken: null, refreshToken: null, isVerified: user.isVerified, emailSendInCooldown: false }
      }

      // NOTE Generate access tokens
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
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

      // NOTE Saving token in white list
      const dataRefreshToken = jwt.decode(refreshToken)
      const expRefreshToken = new Date(dataRefreshToken.exp * 1000)

      // NOTE type 2 is for refresh token
      await TokenWhiteList.create({ id: idRefreshToken, token: refreshToken, expDate: expRefreshToken, fk_id_user: user.id, fk_id_type_token: 2 })

      return { accessToken, refreshToken, isVerified: user.isVerified }
    })

    if (result.emailSendInCooldown && !result.isVerified) return res.status(403).send({ status: 403, message: 'Email has to be verified but an email was already sended. Wait a while...' })
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
    await sqDb.transaction(async () => {
      // NOTE Prev validations
      const { email, password, name, lastName } = req.body
      const userExist = await User.findOne({ where: { email } })
      if (userExist) throw new HttpError('User already exist', 409)

      // NOTE Creating user
      const id = crypto.randomUUID()
      const hashedPassword = bcrypt.hashSync(password, salty)
      const newUser = await User.create({ id, email, password: hashedPassword, name, lastName, fk_id_type_user: 2 })

      // NOTE Generate token, endpoint and sending email
      // NOTE This will be controlled in the front, we extract the token as a para and validate with the confirmEmailVerificationController
      const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/verifying-email?token='
      await handlerSendingEmailWithLink(newUser.id, newUser.email, newUser.name, newUser.lastName, endpointWithOutToken, '10m')
    })

    return res.status(200).send({ status: 200, message: 'User Created!!!' })
  } catch (error) {
    // NOTE Dont send all the info of error.
    console.error('registerUserController::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// ANCHOR This return a 401 be carefull
export const logoutUserController = async (req, res) => {
  try {
    await sqDb.transaction(async () => {
      const cookieRefreshTokenBrowser = req.cookies.refresh_token
      if (!cookieRefreshTokenBrowser) throw new HttpError('No cookie provided', 404)
      const tokenData = jwt.decode(cookieRefreshTokenBrowser)
      const tokenIsValid = await TokenWhiteList.findByPk(tokenData.jti)
      if (!tokenIsValid) throw new HttpError('Token not exist in white list', 401)
      await TokenWhiteList.destroy({ where: { id: tokenData.jti } })

      // NOTE saving token in blackList
      const expDateToken = new Date(tokenData.exp * 1000)
      const idNewBlackListToken = crypto.randomUUID()
      await TokenBlackList.create({ id: idNewBlackListToken, token: cookieRefreshTokenBrowser, expDate: expDateToken, fk_id_user: tokenData.id, fk_id_type_token: 2 })
    })
    return res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(200)
      .send({ status: 200, message: 'Logout successful' })
  } catch (error) {
    console.error('logoutUserController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Email Verification
export const confirmEmailVerificationController = async (req, res) => {
  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE Token validation
      const { token } = req.body
      if (!token) throw new HttpError('Token not found', 404)

      // NOTE User validation
      const data = jwt.verify(token, JWT_SECRET)
      const user = await User.findByPk(data.id)
      if (!user) throw new HttpError('User not found', 404)
      if (user.isVerified) return 304

      // NOTE Extract the actual time
      const now = await handlerExtractUtcTimestamp()

      // NOTE updating verification
      await User.update({ isVerified: true, updateAt: now }, { where: { id: data.id } })

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

export const sendEmailVerificationController = async (req, res) => {
  try {
    const statusVerification = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE User validation
      const { userId } = req.body
      const user = await User.findOne({ where: { id: userId } })
      if (!user) throw new HttpError('User not found', 404)
      if (user.isVerified) return 204

      // NOTE Spam controll
      if (!user.isVerified && (now - user.lastVerificationEmailSentAt) / 1000 <= 90) {
        throw new HttpError('Email sended, wait a moment', 403)
      }

      // NOTE Sending email
      const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/verifying-email?token='
      await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m')

      await User.update({ lastVerificationEmailSentAt: now, updateAt: now }, { where: { id: userId } })
      return 200
    })

    return res.status(statusVerification).send({ status: 200, message: statusVerification === 200 ? 'Email resended!!!' : null })
  } catch (error) {
    console.log('sendEmailVerificationController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Forgot password
export const sendForgotPasswordEmailController = async (req, res) => {
  try {
    const dataStatus = await sqDb.transaction(async () => {
      // NOTE extract the actual date FROM DB
      const now = await handlerExtractUtcTimestamp()

      // NOTE Finding user
      const { email } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) throw new HttpError('User not found', 404)

      // NOTE Email verify spam controll
      // NOTE Remember user has to be verified to use the forgot password controller
      if ((now - user.lastVerificationEmailSentAt) / 1000 <= 90 && !user.isVerified) throw new HttpError('The email to verify user was already sended, wait a moment...', 403)

      // NOTE Sending email in case user isn't verified
      if (!user.isVerified) {
        const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/verifying-email?token='
        await handlerSendingEmailWithLink(user.id, user.email, user.name, user.lastName, endpointWithOutToken, '10m')

        await User.update({ lastVerificationEmailSentAt: now, updateAt: now }, { where: { id: user.id } })

        return { status: 200, message: 'The email to verify user was sended' }
      }

      // NOTE Spam controll
      if (user.lastForgotPasswordSentAt && (now - user.lastForgotPasswordSentAt) / 1000 <= 90) throw new HttpError('The email to verify the forgot password was already sended, wait a moment...', 403)

      // NOTE Unvalidating all old reset password tokens
      const allOldTokens = await TokenWhiteList.findAll({ where: { fk_id_user: user.id, fk_id_type_token: 1 } })
      await TokenWhiteList.destroy({ where: { fk_id_user: user.id, fk_id_type_token: 1 } })
      if (allOldTokens.length > 0) {
        allOldTokens.forEach(async (oldToken) => {
          const idTokenBlackList = crypto.randomUUID()
          await TokenBlackList.create({ id: idTokenBlackList, token: oldToken.token, fk_id_user: user.id, fk_id_type_token: 1 })
        })
      }
      // NOTE Saving a new one
      const idResetTokenWhiteList = crypto.randomUUID()
      const passwordResetTokenJwt = jwt.sign(
        { id: user.id, jti: idResetTokenWhiteList, type: 'passwordReset' },
        JWT_SECRET,
        { expiresIn: '15m' }
      )

      // TODO Verify if is better use hash or hashSync
      const secretReset = randomBytes(32).toString('hex')
      const hashedResetToken = bcrypt.hashSync(secretReset, salty)
      const decodeResetTokenJwt = jwt.decode(passwordResetTokenJwt)

      await TokenWhiteList.create({
        id: idResetTokenWhiteList,
        token: hashedResetToken,
        expDate: new Date(decodeResetTokenJwt.exp * 1000),
        fk_id_user: user.id,
        fk_id_type_token: 1
      })

      // NOTE Sending email
      // TODO This has to be send to the update password form
      const endpoint = process.env.CUSTOM_DOMAIN + '/reset-password?token=' + passwordResetTokenJwt + '&secret=' + secretReset
      await sendEmail(user.email, endpoint, user.name, user.lastName)

      await User.update({ lastForgotPasswordSentAt: now, updateAt: now }, { where: { id: user.id } })

      return { status: 200, message: 'The email to verify the forgot password was sended' }
    })

    return res.status(dataStatus.status).send({ status: dataStatus.status, message: dataStatus.message })
  } catch (error) {
    console.log('forgotPasswordSendEmailController::: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// ANCHOR This return a 401 be carefull
export const changePasswordController = async (req, res) => {
  try {
    await sqDb.transaction(async () => {
      const { token, secret, newPassword } = req.body
      // NOTE Validate token with jwt
      const dataToken = jwt.verify(token, JWT_SECRET)

      const tokenIsBanned = await TokenBlackList.findByPk(dataToken.jti)
      if (tokenIsBanned) throw new HttpError('Token is banned', 401)

      // NOTE Validating token in whiteList
      const tokenInWhiteList = await TokenWhiteList.findOne({ where: { fk_id_user: dataToken.id, fk_id_type_token: 1 } })
      if (!tokenInWhiteList) throw new HttpError('Token doesnt exist', 404)

      // TODO Verify whose is better copare or comapreSync
      const isSecretMatch = bcrypt.compareSync(secret, tokenInWhiteList.token)
      if (!isSecretMatch) throw new HttpError('Invalid secret', 401)

      // NOTE Validating the new password
      const user = await User.findByPk(dataToken.id)
      if (!user) throw new HttpError('User do not exist', 404)
      const newPasswordIsNotNew = bcrypt.compareSync(newPassword, user.password)
      if (newPasswordIsNotNew) throw new HttpError('New password have to be new', 422)

      // NOTE Creating new password encripted
      const hashedPassword = bcrypt.hashSync(newPassword, salty)

      // NOTE Updating password user and invalidating token
      const now = await handlerExtractUtcTimestamp()

      await TokenWhiteList.destroy({ where: { id: tokenInWhiteList.id } })
      await TokenBlackList.create({ id: tokenInWhiteList.id, token: tokenInWhiteList.token, fk_id_user: tokenInWhiteList.fk_id_user, fk_id_type_token: tokenInWhiteList.fk_id_type_token })
      await User.update({ password: hashedPassword, updatedAt: now }, { where: { id: user.id } })
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

// NOTE User data
// FIXME An user can has more than one address
// FIXME This has a problem of security, take too much time
export const updateUserAddressController = async (req, res) => {
  try {
    await sqDb.transaction(async () => {
      const { id: idUser } = req.userSession
      if (!idUser) throw new HttpError('Id user not provided', 404)

      const user = await User.findByPk(idUser)
      if (!user) throw new HttpError('User not found', 404)

      const { street, number, numDpto, postalCode, idCommune } = req.body

      const comunneExist = await Commune.findByPk(idCommune)
      if (!comunneExist) throw new HttpError('Commune not exist in table', 404)

      const postalCodeResponse = await handlerGetPostalCode(street, number, comunneExist.name)

      if (!postalCodeResponse || postalCodeResponse.status) {
        const errorMessage = postalCodeResponse ? postalCodeResponse.error : 'Error getting postal code'
        const errorStatus = postalCodeResponse && postalCodeResponse.status ? postalCodeResponse.status : 500
        throw new HttpError(errorMessage, errorStatus)
      }

      if (postalCode !== postalCodeResponse.codigoPostal) throw new HttpError('Postal code provided not valid', 403)

      const userHasAddress = await UserAddress.findOne({ where: { fk_id_user: idUser } })
      const idAddress = crypto.randomUUID()
      if (userHasAddress) {
        console.log('User already had an address')
        const now = await handlerExtractUtcTimestamp()
        await Address.update({ street, number, numDpto, postalCode, fk_id_commune: idCommune, updateAt: now }, { where: { id: userHasAddress.fk_id_address } })
      } else {
        console.log('User doesnt have an address, creating a new one...')
        const newUserAddress = await Address.create({ id: idAddress, street, number, numDpto, postalCode, fk_id_commune: idCommune })
        const newNameUserAddress = user.name + 'Address'
        const newIdForUserAdress = crypto.randomUUID()
        await UserAddress.create({ id: newIdForUserAdress, name: newNameUserAddress, fk_id_user: idUser, fk_id_address: newUserAddress.id })
      }
    })

    return res.status(200).send({ status: 200, message: 'User address updated!!!' })
  } catch (error) {
    console.log('updateUserAddressController: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const updateUserPhoneController = async (req, res) => {
  try {
    await sqDb.transaction(async () => {
      const { id: idUser } = req.userSession
      if (!idUser) throw new HttpError('Id user not provided', 404)

      const user = await User.findByPk(idUser)
      if (!user) throw new HttpError('User not found', 404)

      const { phone } = req.body

      await User.update({ phone }, { where: { id: idUser } })
    })

    return res.status(200).send({ status: 200, message: 'Phone user updated' })
  } catch (error) {
    console.log('UpdateUserPhone: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// NOTE Admin basic crud
export const getAllClientsController = async (req, res) => {
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
    if (resultUser.count <= 0) return res.status(200).send({ status: 200, data: [], count: resultUser.count, size: Number(size), page: page * size })

    const dataParsed = resultUser.rows.map(el => {
      const newUserToSave = { id: el.id, email: el.email, name: el.name, lastname: el.lastName, phone: el.phone, isVerified: el.isVerified, addresses: [] }

      if (!el.useraddresses) return newUserToSave

      const addressesParsed = el.useraddresses.map(addrs => {
        const addressToSave = { name: addrs.name, street: addrs.address.street, number: addrs.address.number, numDpto: addrs.address.numDpto, postalCode: addrs.address.postalCode, commune: addrs.address.commune.name }
        return addressToSave
      })
      newUserToSave.addresses = addressesParsed
      return newUserToSave
    })

    return res.status(200).send({ status: 200, data: dataParsed, count: resultUser.count, size: Number(size), page: page * size })
  } catch (error) {
    console.log('getAllClientsController: ', error)
    if (error.parent.errno === 1054) return res.status(400).send({ status: 400, message: 'Bad field error' })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const createClientController = async (req, res) => {
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
      const endpointWithOutToken = process.env.CUSTOM_DOMAIN + '/verifying-email?token='
      await handlerSendingEmailWithLink(newUser.id, newUser.email, newUser.name, newUser.lastName, endpointWithOutToken, '10m')
    })

    return res.status(200).send({ status: 200, message: 'User Created!!!' })
  } catch (error) {
    // NOTE Dont send all the info of error.
    console.error('createClientController::: ', error)

    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

// TODO Front has to send a confirmation of the action, like "U sure of deleting this user? This cant ne undone "
export const deleteClientController = async (req, res) => {
  try {
    await sqDb.transaction(async () => {
      const userId = req.params.userId
      const userFound = await User.findByPk(userId)
      if (!userFound) throw new HttpError('User not found', 404)
      await User.destroy({ where: { id: userId } })
    })

    return res.status(200).send({ status: 200, message: 'User deleted!' })
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const updateClientController = async (req, res) => {
  try {
    await sqDb.transaction(async () => {

    })
  } catch (error) {
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}
