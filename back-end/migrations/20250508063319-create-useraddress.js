'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('useraddress', {
    id: {
      type: Sequelize.STRING(36),
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(60),
      allowNull: false
    },
    fk_id_user: {
      type: Sequelize.STRING(36),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    fk_id_address: {
      type: Sequelize.STRING(36),
      allowNull: true,
      references: {
        model: 'address',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })
}
export async function down (queryInterface, Sequelize) {
  // Eliminar la tabla 'useraddresses'
  await queryInterface.dropTable('useraddress')
}
