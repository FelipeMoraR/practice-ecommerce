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

// Global middleware when they send invalid JSON, this has to be in the end because this capture all the errors and dont interfer with the other validations
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).send({ status: 400, error: 'Invalid JSON' })

  console.error('Unhandled error: ', err)
  return res.status(500).send({ error: 'Internal server error' })
})

export default app
