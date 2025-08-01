import express from 'express'
import cookieParser from 'cookie-parser'
import UserRouter from './src/routes/user.routes.js'
import SessionRouter from './src/routes/session.routes.js'
import AddressRouter from './src/routes/address.router.js'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { tokenBlackListCleaner, tokenWhiteListCleaner } from './src/services/cron.service.js'
import { PORT } from './src/config/config.js'

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
app.use('/api/v1/address', AddressRouter)

// NOTE Global middleware when they send invalid JSON, this has to be in the end because this capture all the errors and dont interfer with the other validations
// ANCHOR This function have to have these 4 parameters because of this express recognize this function as an error-handling middleware, this is called only when errors exist.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).send({ status: 400, error: 'Invalid JSON' })

  console.error('Unhandled error: ', err)
  return res.status(500).send({ error: 'Internal server error' })
})

// NOTE Activating node-cron
tokenBlackListCleaner()
tokenWhiteListCleaner()

app.get('/', (_, res) => {
  const currentTimeUTC = new Date().toISOString()
  res.json({ currentTimeUTC })
})

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export { server, app }
