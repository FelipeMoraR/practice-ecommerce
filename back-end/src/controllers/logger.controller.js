import { sqDbLogger } from '../config/db.config.js'
import * as nodeCron from 'node-cron'
import Logger from '../models/logger.model.js'
import handlerExtractUtcTimestamp from '../utils/extractUtcTimeStamp.js'
import { Op } from 'sequelize'

export const saveLogController = async (level, message, user = null, ip = null) => {
  try {
    if (typeof level !== 'string' || typeof message !== 'string') throw new Error('savelogController: Level and message has to be strings')
    if (level.trim() === '' || message.trim() === '') throw new Error('savelogController: Level and message cant be empty')
    const validLevels = ['ERROR', 'INFO', 'AUDIT', 'PERFORMACE', 'WARNING']
    const levelIsValid = validLevels.find(el => el === level)

    if (!levelIsValid) {
      console.log('Level invalid => ', level)
      throw new Error('savelogController: Level must be one of these => ERROR, INFO, AUDIT, PERFORMACE, WARNING')
    }

    await sqDbLogger.transaction(async () => {
      const randomId = crypto.randomUUID()
      await Logger.create({ id: randomId, level, message, user, ip_address: ip })
    })
  } catch (error) {
    console.log('saveLogController: ', error)
  }
}

export const loggerCleaner = () => {
  try {
    // NOTE This will run every Friday at 3:00 AM (0 seconds, 0 minutes, 3 hours) the first day of every 3 month
    nodeCron.schedule('0 0 3 1 */6 5', async () => {
      const now = await handlerExtractUtcTimestamp()

      sqDbLogger.transaction(async () => {
        await Logger.destroy({ where: { createdAt: { [Op.lt]: now } } })
      })
    })
  } catch (error) {
    console.log('tokenBlackListCleaner: ', error)
  }
}
