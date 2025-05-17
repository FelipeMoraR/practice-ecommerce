import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'
import TypeToken from './typeToken.model.js'

const TokenBlackList = sqDb.define('tokenblacklist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fk_id_type_token: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
})

TypeToken.hasMany(TokenBlackList, {
  foreignKey: 'fk_id_type_token',
  onDelete: 'SET NULL'
})

TokenBlackList.belongsTo(TypeToken, {
  foreignKey: 'fk_id_type_token'
})

export default TokenBlackList
