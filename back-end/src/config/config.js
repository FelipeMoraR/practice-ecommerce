import dotenv from 'dotenv'

dotenv.config()

export const { PORT, SALT_ROUNDS, JWT_SECRET, NODE_ENV } = process.env
