import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'
import Commune from './commune.model.js'

const Address = sqDb.define('address', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  street: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numDpto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fk_id_commune: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
})

Commune.hasMany(Address, {
  foreignKey: 'fk_id_commune',
  onDelete: 'cascade'
})

Address.belongsTo(Commune, {
  foreignKey: 'fk_id_commune'
})

export default Address
