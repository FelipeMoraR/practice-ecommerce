import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'
import User from './user.model.js'
import TypeToken from './typeToken.model.js'

const TokenWhiteList = sqDb.define('tokenwhitelist', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    autoIncrement: false
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  id_device: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  expDate: {
    type: DataTypes.DATE,
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

User.hasMany(TokenWhiteList, {
  foreignKey: 'fk_id_user',
  onDelete: 'SET NULL'
})

TokenWhiteList.belongsTo(User, {
  foreignKey: 'fk_id_user'
})

TypeToken.hasMany(TokenWhiteList, {
  foreignKey: 'fk_id_type_token',
  onDelete: 'SET NULL'
})

TokenWhiteList.belongsTo(TypeToken, {
  foreignKey: 'fk_id_type_token'
})

export default TokenWhiteList
