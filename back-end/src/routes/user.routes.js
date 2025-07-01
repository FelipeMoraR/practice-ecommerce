import express from 'express'
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  confirmEmailVerificationController,
  sendEmailVerificationController,
  sendForgotPasswordEmailController,
  changePasswordController,
  addUserAddressController,
  updateUserPhoneController,
  getAllClientsController,
  createClientController,
  deleteClientController,
  updateUserAddressController,
  deleteUserAddressController,
  viewUserController,
  updateBasicClientInfoController
} from '../controllers/user.controller.js'
import { validateSquema } from '../middlewares/validationSquema.middleware.js'
import { privateRoute, adminRoute } from '../middlewares/protectedRoute.middleware.js'
import {
  loginSchema,
  registerSchema,
  emailSchema,
  userIdSchema,
  changePasswordSchema, tokenSchema,
  addAddressUserSchema,
  updateAddressUserSchema,
  updatePhoneUserSchema,
  getClientsSchema,
  addressIdSchema
} from '../squemas/user.squema.js'

const UserRouter = express.Router()

// SECTION GET
// ANCHOR Public get
// ANCHOR Private get
UserRouter.get('/get-all-client', privateRoute, adminRoute, validateSquema(getClientsSchema, 'query'), getAllClientsController)
UserRouter.get('/get-user', privateRoute, viewUserController)

// SECTION POST
// ANCHOR Public post
UserRouter.post('/login', validateSquema(loginSchema, 'body'), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema, 'body'), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/confirm-email', validateSquema(tokenSchema, 'body'), confirmEmailVerificationController)
// FIXME Change it and send the id as query
UserRouter.post('/resend-email-verification', validateSquema(userIdSchema, 'body'), sendEmailVerificationController)
UserRouter.post('/send-email-forgot-password', validateSquema(emailSchema, 'body'), sendForgotPasswordEmailController)
UserRouter.post('/update-password', validateSquema(changePasswordSchema, 'body'), changePasswordController)

// ANCHOR Private post
UserRouter.post('/add-user-address', privateRoute, validateSquema(addAddressUserSchema, 'body'), addUserAddressController)
UserRouter.patch('/update-user-address', privateRoute, validateSquema(updateAddressUserSchema, 'body'), updateUserAddressController)
UserRouter.post('/create-new-client', privateRoute, adminRoute, validateSquema(registerSchema, 'body'), createClientController)

// SECTION PATCH
// ANCHOR Public PATCH
// ANCHOR Private PATCH
UserRouter.patch('/update-user-phone', privateRoute, validateSquema(updatePhoneUserSchema, 'body'), updateUserPhoneController)
UserRouter.patch('/update-client-personal-info', privateRoute, adminRoute, updateBasicClientInfoController)

// SECTION Delete
// ANCHOR Public Delete
// ANCHOR Private Delete
UserRouter.delete('/delete-client/:userId', privateRoute, adminRoute, validateSquema(userIdSchema, 'params'), deleteClientController)
UserRouter.delete('/delete-user-address/:idAddress', privateRoute, validateSquema(addressIdSchema, 'params'), deleteUserAddressController)

export default UserRouter
