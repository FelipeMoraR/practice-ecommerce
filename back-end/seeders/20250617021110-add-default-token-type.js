'use strict'

/** @type {import('sequelize-cli').Migration} */

export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('typetoken', [
    { name: 'forgot-password' },
    { name: 'refresh-session' }
  ], {})
}
export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('typetoken', null, {})
}
