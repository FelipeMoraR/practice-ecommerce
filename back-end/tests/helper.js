import { app } from '../app.js'
import supertest from 'supertest'
import { sqDb } from '../src/config/db.config.js'

export const api = supertest(app)

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
    await sqDb.transaction(async () => {
      const { count, rows } = await model.findAndCountAll()
      return { count, rows }
    })
  } catch (error) {
    console.log('cleaningTable: ', error)
    return { count: 0, rows: null }
  }
}
