import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'

const TypeToken = sqDb.define('typetoken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  timestamps: true
})

export default TypeToken
