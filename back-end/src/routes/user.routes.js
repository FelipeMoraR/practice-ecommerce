import express from 'express'
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  confirmEmailVerificationController,
  sendEmailVerificationController,
  sendForgotPasswordEmailController,
  changePasswordController
} from '../controllers/user.controller.js'
import { validateSquema } from '../middlewares/validationSquema.middleware.js'
import { privateRoute } from '../middlewares/protectedRoute.middleware.js'
import { loginSchema, registerSchema, emailSchema, userIdSchema, changePasswordSchema, tokenSchema } from '../squemas/user.squema.js'

const UserRouter = express.Router()

// ANCHOR GET
UserRouter.get('/test-protected', privateRoute, (req, res) => {
  try {
    console.log(req.userSession)
    console.log(req)
    return res.status(200).send({ status: 200, message: 'Ok!' })
  } catch (error) {
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
})

// ANCHOR POST
UserRouter.post('/login', validateSquema(loginSchema), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/confirm-email', validateSquema(tokenSchema), confirmEmailVerificationController)
UserRouter.post('/resend-email-verification', validateSquema(userIdSchema), sendEmailVerificationController)
UserRouter.post('/send-email-forgot-password', validateSquema(emailSchema), sendForgotPasswordEmailController)
UserRouter.post('/update-password', validateSquema(changePasswordSchema), changePasswordController)

export default UserRouter
