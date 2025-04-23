import express from 'express'
import cookieParser from 'cookie-parser'
import UserRouter from './src/routes/user.routes.js'
import SessionRouter from './src/routes/session.routes.js'

const app = express()
app.use(express.json()) // This allow the destructuration of the body of the request
app.use(cookieParser())

// Custom Routes
app.use('/api/users', UserRouter)
app.use('/api/sessions/', SessionRouter)

export default app
