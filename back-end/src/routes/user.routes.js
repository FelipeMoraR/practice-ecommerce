import express from 'express'
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  protectedRoute
} from '../controllers/user.controller.js'
import { validateSquema } from '../middlewares/validation.middleware.js'
import { loginSchema, registerSchema } from '../squemas/user.squema.js'
const UserRouter = express.Router()

UserRouter.post('/login', validateSquema(loginSchema), loginUserController)
UserRouter.post('/register', validateSquema(registerSchema), registerUserController)
UserRouter.post('/logout', logoutUserController)
UserRouter.post('/protected', protectedRoute)

export default UserRouter
