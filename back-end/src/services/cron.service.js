import * as nodeCron from 'node-cron'
import { sqDb } from '../config/db.config.js'
import TokenBlackList from '../models/tokenBlackList.model.js'
import handlerExtractUtcTimestamp from '../utils/extractUtcTimeStamp.js'
import { Op } from 'sequelize'

export const testNodeCron = () => {
  nodeCron.schedule('* * * * *', () => {
    console.log('Testing cron, every minute i would say hello')
    console.log('Hello')
  })
}

export const tokenBlackListCleaner = () => {
  nodeCron.schedule('*/15 * * * * *', async () => { // NOTE Every friday. But now is every fifteen seconds
    const now = await handlerExtractUtcTimestamp()
    console.log('now => ', now)
    sqDb.transaction(async () => {
      console.log('Deleting...')
      const allToDelete = await TokenBlackList.findAll({ where: { createdAt: { [Op.lt]: now } } })
      console.log(allToDelete[0].dataValues.createdAt)
    })
  })
}
