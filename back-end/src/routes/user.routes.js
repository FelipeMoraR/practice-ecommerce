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
  deleteUserAddress
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
UserRouter.get('/get-all-client', privateRoute, adminRoute, validateSquema(getClientsSchema, 'query'), getAllClientsController)

// SECTION POST
// ANCHOR Public post
UserRouter.post('/login', validateSquema(loginSchema, 'body'), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema, 'body'), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/confirm-email', validateSquema(tokenSchema, 'body'), confirmEmailVerificationController)
UserRouter.post('/resend-email-verification', validateSquema(userIdSchema, 'body'), sendEmailVerificationController)
UserRouter.post('/send-email-forgot-password', validateSquema(emailSchema, 'body'), sendForgotPasswordEmailController)
UserRouter.post('/update-password', validateSquema(changePasswordSchema, 'body'), changePasswordController)

// ANCHOR Private post
UserRouter.post('/add-user-address', privateRoute, validateSquema(addAddressUserSchema, 'body'), addUserAddressController)
UserRouter.patch('/update-user-address', privateRoute, validateSquema(updateAddressUserSchema, 'body'), updateUserAddressController)
UserRouter.post('/create-new-client', privateRoute, validateSquema(registerSchema, 'body'), adminRoute, createClientController)

// SECTION PATCH
// ANCHOR Public PATCH
// ANCHOR Private PATCH
UserRouter.patch('/update-user-phone', privateRoute, validateSquema(updatePhoneUserSchema, 'body'), updateUserPhoneController)

// SECTION Delete
// ANCHOR Public Delete
// ANCHOR Private Delete
UserRouter.delete('/delete-client/:userId', privateRoute, validateSquema(userIdSchema, 'params'), adminRoute, deleteClientController)
UserRouter.delete('/delete-user-address/:idAddress', privateRoute, validateSquema(addressIdSchema, 'params'), adminRoute, deleteUserAddress)

export default UserRouter
