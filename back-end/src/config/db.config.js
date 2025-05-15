import { Sequelize } from 'sequelize'
import { createNamespace } from 'cls-hooked'

const nameSpace = createNamespace(process.env.DB_NAMESPACE || 'test')

Sequelize.useCLS(nameSpace)

export const sqDb = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    timezone: process.env.DB_TIMEZONE || '+00:00',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 5,
      min: Number(process.env.DB_POOL_MIN) || 0,
      acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000, // NOTE Max time (in ms) where sequelize will try to conect to the pool before send an error.
      idle: Number(process.env.DB_POOL_IDLE) || 10000 // NOTE Max time (in ms) where the conection will be inactive before close it.
    },
    define: {
      freezeTableName: true
    }
  }
)

async function testConnection () {
  try {
    await sqDb.authenticate()
    console.log('Database connected. :)')
  } catch (error) {
    console.error('Error conecting the database: ', error)
  }
}

testConnection()
