'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('region', [
    {
      name: 'METROPOLITANA'
    }
  ], {})
}
export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('region', null, {})
}
