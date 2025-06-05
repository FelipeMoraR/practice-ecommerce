import express from 'express'
import cookieParser from 'cookie-parser'
import UserRouter from './src/routes/user.routes.js'
import SessionRouter from './src/routes/session.routes.js'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const app = express()
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true // NOTE to work with the cookies
}

const limiter = {
  windowMs: Number(process.env.LIMITER_WINDOWMS) * 1000, // NOTE Time when the client can make petition
  max: Number(process.env.LIMITER_MAX), // NOTE Max of petitions per windowMs
  message: 'Too many petitions.',
  standardHeaders: true,
  legacyHeaders: false
}

app.use(express.json({ limit: process.env.SIZE_LIMIT })) // NOTE This allow the destructuration of the body of the request
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(rateLimit(limiter)) // ANCHOR this limiter is per IP
app.use(helmet()) // NOTE HTTP secured by adding the correct ones and hidding others

// Custom Routes
app.use('/api/v1/users', UserRouter)
app.use('/api/v1/sessions', SessionRouter)

// NOTE Global middleware when they send invalid JSON, this has to be in the end because this capture all the errors and dont interfer with the other validations
// ANCHOR This function have to have these 4 parameters because of this express recognize this function as an error-handling middleware, this is called only when errors exist.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).send({ status: 400, error: 'Invalid JSON' })

  console.error('Unhandled error: ', err)
  return res.status(500).send({ error: 'Internal server error' })
})

export default app
