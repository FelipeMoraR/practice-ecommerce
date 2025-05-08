'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('commune', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(320),
      allowNull: false
    },
    fk_id_region: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'region',
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
  await queryInterface.dropTable('commune')
}
