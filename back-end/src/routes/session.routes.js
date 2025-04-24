import express from 'express'
import {
  refreshTokenController,
  getSessionInfoController
} from '../controllers/session.controller.js'

const SessionRouter = express.Router()

SessionRouter.get('/refresh-token', refreshTokenController)
SessionRouter.get('/get-session-info', getSessionInfoController)

export default SessionRouter
