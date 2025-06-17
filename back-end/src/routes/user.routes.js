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
import { validateSquema } from '../middlewares/validation.middleware.js'
import { loginSchema, registerSchema, emailSchema, userIdSchema, changePasswordSchema } from '../squemas/user.squema.js'

const UserRouter = express.Router()

// ANCHOR GET
UserRouter.get('/confirm-email/:emailToken', confirmEmailVerificationController)

// ANCHOR POST
UserRouter.post('/login', validateSquema(loginSchema), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/resend-email-verification', validateSquema(userIdSchema), sendEmailVerificationController)
UserRouter.post('/send-email-forgot-password', validateSquema(emailSchema), sendForgotPasswordEmailController)
UserRouter.post('/update-password', validateSquema(changePasswordSchema), changePasswordController)

export default UserRouter
