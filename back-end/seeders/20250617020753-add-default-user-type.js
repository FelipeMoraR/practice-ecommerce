'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('typeuser', [
    {
      name: 'admin'
    },
    {
      name: 'client'
    }
  ], {})
}
export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('typeuser', null, {})
}
