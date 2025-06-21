import { sqDb } from '../config/db.config.js'

const handlerExtractUtcTimestamp = async () => {
  const [result] = await sqDb.query('SELECT UTC_TIMESTAMP();') // NOTE With this i verify we are using the same time as sequelize configuration (Coordinated Universal Time)
  const now = result[0]['UTC_TIMESTAMP()']

  if (!now) throw new Error('Couldnt extract the time')

  return now
}

export default handlerExtractUtcTimestamp
