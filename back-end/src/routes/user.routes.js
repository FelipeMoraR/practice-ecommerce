import express from 'express'
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  confirmEmailVerificationController,
  sendEmailVerificationController,
  sendForgotPasswordEmailController,
  changePasswordController,
  updateUserAddressController,
  updateUserPhoneController,
  getAllClientsController
} from '../controllers/user.controller.js'
import { validateSquema } from '../middlewares/validationSquema.middleware.js'
import { privateRoute, adminRoute } from '../middlewares/protectedRoute.middleware.js'
import {
  loginSchema,
  registerSchema,
  emailSchema,
  userIdSchema,
  changePasswordSchema, tokenSchema,
  updateAddressUser,
  updatePhoneUser
} from '../squemas/user.squema.js'

const UserRouter = express.Router()

// SECTION GET
// ANCHOR Public get
// ANCHOR Private get
UserRouter.get('/test-protected', privateRoute, (req, res) => {
  try {
    console.log(req.userSession)
    console.log(req)
    return res.status(200).send({ status: 200, message: 'Ok!' })
  } catch (error) {
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
})

UserRouter.get('/test-admin-protected', privateRoute, adminRoute, (req, res) => {
  try {
    return res.status(200).send({ status: 200, message: 'Ok!' })
  } catch (error) {
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
})

UserRouter.get('/get-all-client', privateRoute, adminRoute, getAllClientsController)

// SECTION POST
// ANCHOR Public post
UserRouter.post('/login', validateSquema(loginSchema), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/confirm-email', validateSquema(tokenSchema), confirmEmailVerificationController)
UserRouter.post('/resend-email-verification', validateSquema(userIdSchema), sendEmailVerificationController)
UserRouter.post('/send-email-forgot-password', validateSquema(emailSchema), sendForgotPasswordEmailController)
UserRouter.post('/update-password', validateSquema(changePasswordSchema), changePasswordController)

// ANCHOR Private post
UserRouter.post('/update-user-address', privateRoute, validateSquema(updateAddressUser), updateUserAddressController)
UserRouter.post('/update-user-phone', privateRoute, validateSquema(updatePhoneUser), updateUserPhoneController)

export default UserRouter
