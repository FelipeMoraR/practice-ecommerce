require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_USER_LOGGER,
    password: process.env.DB_PASSWORD_LOGGER,
    database: process.env.DB_DATABASE_LOGGER,
    host: process.env.DB_HOST_LOGGER,
    port: process.env.DB_PORT_LOGGER,
    dialect: 'mysql',
    timezone: process.env.DB_TIMEZONE_LOGGER
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: process.env.DB_TIMEZONE_LOGGER
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: process.env.DB_TIMEZONE_LOGGER
  }
}
