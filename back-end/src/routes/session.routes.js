import express from 'express'
import {
  refreshToken
} from '../controllers/session.controller.js'

const SessionRouter = express.Router()

SessionRouter.post('/refresh-token', refreshToken)

export default SessionRouter
