import express from 'express'
import {
  refreshAccessTokenController,
  getSessionInfoController
} from '../controllers/session.controller.js'

const SessionRouter = express.Router()

SessionRouter.get('/refresh-access-token', refreshAccessTokenController)
SessionRouter.get('/get-session-info', getSessionInfoController)

export default SessionRouter
