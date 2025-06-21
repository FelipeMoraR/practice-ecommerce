'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('address', {
    id: {
      type: Sequelize.STRING(36),
      primaryKey: true
    },
    street: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    numDpto: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    postalCode: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fk_id_commune: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'commune',
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
  // Eliminar la tabla 'addresses'
  await queryInterface.dropTable('address')
}
