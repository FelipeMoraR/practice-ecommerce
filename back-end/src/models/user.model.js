import { DataTypes, Sequelize } from 'sequelize'
import { sqDb } from '../config/db.config.js'
import TypeUser from './typeUser.model.js'

const User = sqDb.define('user', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true
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
  },
  lastVerificationEmailSentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // NOTE this work without declaring it in one creation, instead of new Date(), new Date() new to be instanciated to work correctly
  },
  lastForgotPasswordSentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  lastUpdateBasicInfoUserByUser: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  lastUpdateUserByAdmin: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  fk_id_type_user: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true // NOTE this enables the automatic save of createAt and updateAt
})

TypeUser.hasMany(User, {
  foreignKey: 'fk_id_type_user',
  onDelete: 'RESTRICT'
})

User.belongsTo(TypeUser, {
  foreignKey: 'fk_id_type_user'
})

export default User
