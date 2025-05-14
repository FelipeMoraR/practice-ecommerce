import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV, SALT_ROUNDS } from '../config/config.js'
import bcrypt from 'bcrypt'
import { HttpError } from '../utils/customErrors.js'
import User from '../models/user.model.js'
import { transporter, nodeMailer } from '../config/email.config.js'

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) throw new HttpError('Email not founded', 404)

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) throw new HttpError('Invalid password', 401)

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

    return res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 10 // 10 minutes
      })
      .cookie('refresh_token', refreshToken, {
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
    const { email, password, name, lastName } = req.body

    const userExist = await User.findOne({ where: { email } }) // TODO verify if we can resctrict the return information

    if (userExist) throw new HttpError('User already exist', 409)

    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, salty)

    await User.create({ id, email, password: hashedPassword, name, lastName })

    return res.status(200).send({ status: 200, message: 'User Created!!!' })
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

export const testEmail = async (_, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"Mi App (Mailtrap)" <no-reply@demomailtrap.co>', // sender address
      to: 'felipestorage2@gmail.com', // list of receivers
      subject: 'Hello', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
    })

    console.log('info', info)
    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info))
    return res.status(200).send({ status: 200, message: 'Email sended' })
  } catch (error) {
    console.error('Error while sending mail', error)
    return res.status(500).send({ status: 500, message: 'Error sending email' })
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
