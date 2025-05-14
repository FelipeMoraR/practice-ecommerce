import { DataTypes } from 'sequelize'
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
  }
}, {
  timestamps: true // NOTE this enables the automatic save of createAt and updateAt
})

export default User
