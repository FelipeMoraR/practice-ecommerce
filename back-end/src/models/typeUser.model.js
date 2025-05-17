import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'

const TypeUser = sqDb.define('typeuser', {
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

export default TypeUser
