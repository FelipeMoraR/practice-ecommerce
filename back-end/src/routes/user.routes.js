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
  getAllClientsController,
  createClientController,
  deleteClientController,
  updateUserAddressController,
  deleteUserAddressController,
  viewUserController,
  updateBasicClientInfoController,
  updateAddressClientInfoController,
  deleteAddressClientController,
  createNewAddressClientController,
  updateBasicUserInfoController,
  updateUserPasswordController,
  updateUserPhoneController
} from '../controllers/user.controller.js'
import { validateSquema } from '../middlewares/validationSquema.middleware.js'
import { privateRoute, adminRoute } from '../middlewares/protectedRoute.middleware.js'
import {
  loginSchema,
  registerSchema,
  sendForgotPasswordEmailSchema,
  userIdSchema,
  forgotPasswordSchema,
  tokenSchema,
  addAddressUserSchema,
  updateAddressUserSchema,
  getClientsSchema,
  addressIdSchema,
  updateClientPersonalInfoSchema,
  updateClientAddressSchema,
  deleteClientAddressSchema,
  addAddressUserByAdminSchema,
  updateBasicUserInfoSchema,
  updatePasswordSchema,
  validateEmailSchema,
  updatePhoneUserSchema
} from '../squemas/user.squema.js'

const UserRouter = express.Router()

// SECTION GET
// ANCHOR Public get
// ANCHOR Private get
// FIXME not use verb on the endpoints
UserRouter.get('/get-all-client', privateRoute, adminRoute, validateSquema(getClientsSchema, 'query'), getAllClientsController)
UserRouter.get('/get-user', privateRoute, viewUserController)

// SECTION POST
// ANCHOR Public post
UserRouter.post('/login', validateSquema(loginSchema, 'body'), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema, 'body'), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/confirm-email/:token', validateSquema(tokenSchema, 'params'), confirmEmailVerificationController)
UserRouter.post('/resend-email-verification', validateSquema(validateEmailSchema, 'body'), sendEmailVerificationController)
UserRouter.post('/send-email-forgot-password', validateSquema(sendForgotPasswordEmailSchema, 'body'), sendForgotPasswordEmailController)
UserRouter.post('/update-password', validateSquema(forgotPasswordSchema, 'body'), changePasswordController)

// ANCHOR Private post
UserRouter.post('/add-user-address', privateRoute, validateSquema(addAddressUserSchema, 'body'), addUserAddressController)
UserRouter.post('/create-new-client', privateRoute, adminRoute, validateSquema(registerSchema, 'body'), createClientController)
UserRouter.post('/create-new-address-client', privateRoute, adminRoute, validateSquema(addAddressUserByAdminSchema, 'body'), createNewAddressClientController)

// SECTION PUT
// ANCHOR Public PUT
// ANCHOR Private PUT
UserRouter.put('/update-user-phone', privateRoute, validateSquema(updatePhoneUserSchema, 'body'), updateUserPhoneController)

// SECTION PATCH
// ANCHOR Public PATCH
// ANCHOR Private PATCH
UserRouter.patch('/update-user-address', privateRoute, validateSquema(updateAddressUserSchema, 'body'), updateUserAddressController)
UserRouter.patch('/update-basic-user-info', privateRoute, validateSquema(updateBasicUserInfoSchema, 'body'), updateBasicUserInfoController)
UserRouter.patch('/update-password-user', privateRoute, validateSquema(updatePasswordSchema, 'body'), updateUserPasswordController)
UserRouter.patch('/update-client-personal-info', privateRoute, adminRoute, validateSquema(updateClientPersonalInfoSchema, 'body'), updateBasicClientInfoController)
UserRouter.patch('/update-client-address-info', privateRoute, adminRoute, validateSquema(updateClientAddressSchema, 'body'), updateAddressClientInfoController)

// SECTION Delete
// ANCHOR Public Delete
// ANCHOR Private Delete
UserRouter.delete('/delete-client/:userId', privateRoute, adminRoute, validateSquema(userIdSchema, 'params'), deleteClientController)
UserRouter.delete('/delete-user-address/:idAddress', privateRoute, validateSquema(addressIdSchema, 'params'), deleteUserAddressController)
UserRouter.delete('/delete-client-address/:idAddress/:idUser', privateRoute, adminRoute, validateSquema(deleteClientAddressSchema, 'params'), deleteAddressClientController)

export default UserRouter
