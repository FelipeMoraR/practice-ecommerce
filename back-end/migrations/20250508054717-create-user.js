'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('user', {
    id: {
      type: Sequelize.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING(250),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(12),
      allowNull: true
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    lastVerificationEmailSentAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    lastForgotPasswordSentAt: {
      type: Sequelize.DATE,
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
  await queryInterface.dropTable('user')
}
