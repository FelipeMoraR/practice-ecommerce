import { DataTypes } from 'sequelize'
import { sqDb } from '../config/db.config.js'
import Region from './region.model.js'

const Commune = sqDb.define('commune', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(320),
    allowNull: false
  },
  fk_id_region: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
})

// NOTE to many relation
Region.hasMany(Commune, {
  foreignKey: 'fk_id_region', // NOTE this is the bridge between the tables
  onDelete: 'cascade'
})

// NOTE 1 relation
Commune.belongsTo(Region, {
  foreignKey: 'fk_id_region'
})

export default Commune
