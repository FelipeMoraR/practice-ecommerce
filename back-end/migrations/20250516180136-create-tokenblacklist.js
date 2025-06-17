'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('tokenblacklist', {
    id: {
      type: Sequelize.STRING(36),
      primaryKey: true,
      autoIncrement: false
    },
    token: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    fk_id_user: {
      type: Sequelize.STRING(36),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    fk_id_type_token: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'typetoken',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })
}
export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('tokenblacklist')
}
