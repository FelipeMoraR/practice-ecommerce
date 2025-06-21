import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'
import User from './user.model.js'
import Address from './address.model.js'

const UserAddress = sqDb.define('useraddress', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  fk_id_user: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  fk_id_address: {
    type: DataTypes.STRING(36),
    allowNull: true
  }
}, {
  timestamps: true
})

User.hasMany(UserAddress, {
  foreignKey: 'fk_id_user',
  onDelete: 'cascade'
})

UserAddress.belongsTo(User, {
  foreignKey: 'fk_id_user'
})

Address.hasMany(UserAddress, {
  foreignKey: 'fk_id_address',
  onDelete: 'cascade'
})

UserAddress.belongsTo(Address, {
  foreignKey: 'fk_id_address'
})

export default UserAddress
