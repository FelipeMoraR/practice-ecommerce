import { DataTypes, Sequelize } from 'sequelize'
import { sqDb } from '../config/db.config.js'

const User = sqDb.define('user', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(12),
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  lastVerificationEmailSentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // NOTE this work without declaring it in one creation, instead of new Date(), new Date() new to be instanciated to work correctly
  },
  lastForgotPasswordSentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: true // NOTE this enables the automatic save of createAt and updateAt
})

export default User
