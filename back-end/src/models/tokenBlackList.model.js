import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'
import TypeToken from './typeToken.model.js'
import User from './user.model.js'

const TokenBlackList = sqDb.define('tokenblacklist', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    autoIncrement: false
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fk_id_user: {
    type: DataTypes.STRING(36),
    allowNull: true
  },
  fk_id_type_token: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
})

User.hasMany(TokenBlackList, {
  foreignKey: 'fk_id_user',
  onDelete: 'SET NULL'
})

TokenBlackList.belongsTo(User, {
  foreignKey: 'fk_id_user'
})

TypeToken.hasMany(TokenBlackList, {
  foreignKey: 'fk_id_type_token',
  onDelete: 'SET NULL'
})

TokenBlackList.belongsTo(TypeToken, {
  foreignKey: 'fk_id_type_token'
})

export default TokenBlackList
