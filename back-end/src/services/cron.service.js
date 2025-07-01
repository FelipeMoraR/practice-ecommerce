import * as nodeCron from 'node-cron'
import { sqDb } from '../config/db.config.js'
import TokenBlackList from '../models/tokenBlackList.model.js'
import TokenWhiteList from '../models/tokenWhiteList.model.js'
import handlerExtractUtcTimestamp from '../utils/extractUtcTimeStamp.js'
import { Op } from 'sequelize'

export const tokenBlackListCleaner = () => {
  try {
    // NOTE This will run every Friday at 3:00 AM (0 seconds, 0 minutes, 3 hours) one day of every 3 month
    nodeCron.schedule('0 0 3 1 */3 5', async () => { // NOTE Every friday. But now is every fifteen seconds
      const now = await handlerExtractUtcTimestamp()

      sqDb.transaction(async () => {
        await TokenBlackList.destroy({ where: { createdAt: { [Op.lt]: now } } })
      })
    })
  } catch (error) {
    console.log('tokenBlackListCleaner: ', error)
  }
}

export const tokenWhiteListCleaner = () => {
  try {
    // NOTE This will run every Friday at 3:00 AM (0 seconds, 0 minutes, 3 hours)
    nodeCron.schedule('0 0 3 1 */3 5', async () => {
      const now = await handlerExtractUtcTimestamp()

      sqDb.transaction(async () => {
        const allexpiredWhiteToken = await TokenWhiteList.findAll({ where: { expDate: { [Op.lt]: now } } })
        if (allexpiredWhiteToken.length <= 0) {
          console.log('All token in white list are ok')
          return
        }
        allexpiredWhiteToken.forEach(async (token) => {
          console.log(token)
          const newId = crypto.randomUUID()
          await TokenBlackList.create({ id: newId, token: token.token, fk_id_user: token.fk_id_user, fk_id_type_token: token.fk_id_type_token })
        })

        await TokenWhiteList.destroy({ where: { expDate: { [Op.lt]: now } } })
      })
    })
  } catch (error) {
    console.log('tokenWhiteListCleaner: ', error)
  }
}
