import * as nodeCron from 'node-cron'
import { sqDb } from '../config/db.config.js'
import TokenBlackList from '../models/tokenBlackList.model.js'
import TokenWhiteList from '../models/tokenWhiteList.model.js'
import handlerExtractUtcTimestamp from '../utils/extractUtcTimeStamp.js'
import { saveLogController } from '../controllers/logger.controller.js'
import { Op } from 'sequelize'

export const tokenBlackListCleaner = () => {
  try {
    // NOTE This will run every Friday at 3:00 AM (0 seconds, 0 minutes, 3 hours) one day of every 3 month
    nodeCron.schedule('0 0 3 1 */3 5', async () => {
      const now = await handlerExtractUtcTimestamp()

      sqDb.transaction(async () => {
        await TokenBlackList.destroy({ where: { createdAt: { [Op.lt]: now } } })
        await saveLogController('AUDIT', 'Cleaning black list', null, null)
      })
    })
  } catch (error) {
    console.log('tokenBlackListCleaner: ', error)
  }
}

export const tokenWhiteListCleaner = () => {
  try {
    // NOTE This will run every monday at 3:00 AM (0 seconds, 0 minutes, 3 hours) in every month
    nodeCron.schedule('0 0 3 * * 1', async () => {
      const now = await handlerExtractUtcTimestamp()

      sqDb.transaction(async () => {
        const allexpiredWhiteToken = await TokenWhiteList.findAll({ where: { expDate: { [Op.lt]: now } } })
        if (allexpiredWhiteToken.length <= 0) {
          console.log('All token in white list are ok')
          await saveLogController('AUDIT', 'Tried to clean the white list but it was empty', null, null)
          return
        }
        const tokenExpiredPormises = allexpiredWhiteToken.map(token => {
          const newId = crypto.randomUUID()
          return TokenBlackList.create({ id: newId, token: token.token, fk_id_user: token.fk_id_user, fk_id_type_token: token.fk_id_type_token })
        })

        await Promise.all(tokenExpiredPormises)
        await TokenWhiteList.destroy({ where: { expDate: { [Op.lt]: now } } })
        await saveLogController('AUDIT', 'Cleaning white list', null, null)
      })
    })
  } catch (error) {
    console.log('tokenWhiteListCleaner: ', error)
  }
}
