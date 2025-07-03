'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('logger', {
    id: {
      type: Sequelize.STRING(36),
      primaryKey: true,
      autoIncrement: false
    },
    level: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    message: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    ip_address: {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: null
    },
    user: {
      type: Sequelize.STRING(250),
      allowNull: true,
      defaultValue: null
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
  await queryInterface.dropTable('logger')
}
