import { app } from '../app.js'
import supertest from 'supertest'
import { sqDb } from '../src/config/db.config.js'

export const api = supertest(app)
export const agent = supertest.agent(app)

export const cleaningTable = async (model) => {
  try {
    await sqDb.transaction(async () => {
      await model.destroy({ where: {} })
    })
  } catch (error) {
    console.log('cleaningTable: ', error)
  }
}

export const getAllDataOfTable = async (model) => {
  try {
    const result = await sqDb.transaction(async () => {
      const { count, rows } = await model.findAndCountAll({ where: {} })
      return { count, rows }
    })
    return result
  } catch (error) {
    console.log('cleaningTable: ', error)
    return { count: null, rows: null }
  }
}
