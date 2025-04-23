import express from 'express'
import {
  loginUserController,
  registerUser,
  logoutUser,
  protectedRoute
} from '../controllers/user.controller.js'

const UserRouter = express.Router()

UserRouter.post('/login', loginUserController)
UserRouter.post('/register', registerUser)
UserRouter.post('/logout', logoutUser)
UserRouter.post('/protected', protectedRoute)

export default UserRouter
