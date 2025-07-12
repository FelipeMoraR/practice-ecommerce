import { Sequelize } from 'sequelize'
import { createNamespace } from 'cls-hooked'

const nameSpace = createNamespace(process.env.DB_NAMESPACE || 'test')
const nameSpaceLogger = createNamespace(process.env.DB_NAMESPACE_LOGGER || 'logger')

// TODO For what is useCLS for?
Sequelize.useCLS(nameSpace)
Sequelize.useCLS(nameSpaceLogger)

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

export const sqDbLogger = new Sequelize(
  process.env.DB_DATABASE_LOGGER,
  process.env.DB_USER_LOGGER,
  process.env.DB_PASSWORD_LOGGER,
  {
    host: process.env.DB_HOST_LOGGER,
    dialect: 'mysql',
    port: Number(process.env.DB_PORT_LOGGER) || 3306,
    timezone: process.env.DB_TIMEZONE_LOGGER || '+00:00',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT_LOGGER) || 10,
    pool: {
      max: Number(process.env.DB_POOL_MAX_LOGGER) || 5,
      min: Number(process.env.DB_POOL_MIN_LOGGER) || 0,
      acquire: Number(process.env.DB_POOL_ACQUIRE_LOGGER) || 30000, // NOTE Max time (in ms) where sequelize will try to conect to the pool before send an error.
      idle: Number(process.env.DB_POOL_IDLE_LOGGER) || 10000 // NOTE Max time (in ms) where the conection will be inactive before close it.
    },
    define: {
      freezeTableName: true
    }
  }
)

async function dbConnection () {
  try {
    await sqDb.authenticate()
    console.log('Database ecommerse connected. :)')
  } catch (error) {
    console.error('Error conecting the database: ', error)
  }
}

async function dbConnectionLogger () {
  try {
    await sqDbLogger.authenticate()
    console.log('Database Logger connected. :)')
  } catch (error) {
    console.error('Error conecting the database: ', error)
  }
}

await dbConnection()
await dbConnectionLogger()
