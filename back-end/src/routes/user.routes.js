import express from 'express'
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  protectedRoute,
  confirmEmailVerificationController,
  resendEmailVerificationController,
  forgotPasswordValidateEmailController,
  confirmForgotPasswordController
} from '../controllers/user.controller.js'
import { validateSquema } from '../middlewares/validation.middleware.js'
import { loginSchema, registerSchema, emailSchema, userIdSchema } from '../squemas/user.squema.js'

const UserRouter = express.Router()

// ANCHOR GET
UserRouter.get('/confirm-email/:emailToken', confirmEmailVerificationController)
UserRouter.get('/confirm-email-forgot-pass/:forgotPassToken', confirmForgotPasswordController)

// ANCHOR POST
UserRouter.post('/login', validateSquema(loginSchema), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/protected', protectedRoute)
UserRouter.post('/resend-email-verification', validateSquema(userIdSchema), resendEmailVerificationController)
UserRouter.post('/send-email-forgot-password', validateSquema(emailSchema), forgotPasswordValidateEmailController)

export default UserRouter
