import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'

const Region = sqDb.define('region', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(320),
    allowNull: false
  }
}, {
  timestamps: true
})

export default Region
