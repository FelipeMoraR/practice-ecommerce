import { DataTypes } from 'sequelize'
import { sqDbLogger } from '../config/db.config.js'

const Logger = sqDbLogger.define('logger', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  level: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null
  },
  user: {
    type: DataTypes.STRING(250),
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: true
})

export default Logger
