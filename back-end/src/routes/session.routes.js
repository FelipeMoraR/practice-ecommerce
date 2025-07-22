import express from 'express'
import {
  refreshAccessTokenController,
  validateAccessTokenController
} from '../controllers/session.controller.js'

const SessionRouter = express.Router()

SessionRouter.get('/refresh-access-token', refreshAccessTokenController)
SessionRouter.get('/validate-access-token', validateAccessTokenController)

export default SessionRouter
