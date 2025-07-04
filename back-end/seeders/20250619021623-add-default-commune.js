'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('commune', [
    {
      name: 'CERRILLOS',
      fk_id_region: 1
    },
    {
      name: 'CERRO NAVIA',
      fk_id_region: 1
    },
    {
      name: 'CONCHALÍ',
      fk_id_region: 1
    },
    {
      name: 'EL BOSQUE',
      fk_id_region: 1
    },
    {
      name: 'ESTACIÓN CENTRAL',
      fk_id_region: 1
    },
    {
      name: 'HUECHURABA',
      fk_id_region: 1
    },
    {
      name: 'INDEPENDENCIA',
      fk_id_region: 1
    },
    {
      name: 'LA CISTERNA',
      fk_id_region: 1
    },
    {
      name: 'LA FLORIDA',
      fk_id_region: 1
    },
    {
      name: 'LA GRANJA',
      fk_id_region: 1
    },
    {
      name: 'LA PINTANA',
      fk_id_region: 1
    },
    {
      name: 'LA REINA',
      fk_id_region: 1
    },
    {
      name: 'LAS CONDES',
      fk_id_region: 1
    },
    {
      name: 'LO BARNECHEA',
      fk_id_region: 1
    },
    {
      name: 'LO ESPEJO',
      fk_id_region: 1
    },
    {
      name: 'LO PRADO',
      fk_id_region: 1
    },
    {
      name: 'MACUL',
      fk_id_region: 1
    },
    {
      name: 'MAIPÚ',
      fk_id_region: 1
    },
    {
      name: 'ÑUÑOA',
      fk_id_region: 1
    },
    {
      name: 'PEDRO AGUIRRE CERDA',
      fk_id_region: 1
    },
    {
      name: 'PEÑALOLÉN',
      fk_id_region: 1
    },
    {
      name: 'PROVIDENCIA',
      fk_id_region: 1
    },
    {
      name: 'PUDAHUEL',
      fk_id_region: 1
    },
    {
      name: 'QUILICURA',
      fk_id_region: 1
    },
    {
      name: 'QUINTA NORMAL',
      fk_id_region: 1
    },
    {
      name: 'RECOLETA',
      fk_id_region: 1
    },
    {
      name: 'RENCA',
      fk_id_region: 1
    },
    {
      name: 'SAN JOAQUÍN',
      fk_id_region: 1
    },
    {
      name: 'SAN MIGUEL',
      fk_id_region: 1
    },
    {
      name: 'SAN RAMÓN',
      fk_id_region: 1
    },
    {
      name: 'SANTIAGO',
      fk_id_region: 1
    },
    {
      name: 'VITACURA',
      fk_id_region: 1
    },
    {
      name: 'COLINA',
      fk_id_region: 1
    },
    {
      name: 'LAMPA',
      fk_id_region: 1
    },
    {
      name: 'TILTIL',
      fk_id_region: 1
    },
    {
      name: 'PIRQUE',
      fk_id_region: 1
    },
    {
      name: 'PUENTE ALTO',
      fk_id_region: 1
    },
    {
      name: 'SAN JOSÉ DE MAIPO',
      fk_id_region: 1
    },
    {
      name: 'BUIN',
      fk_id_region: 1
    },
    {
      name: 'CALERA DE TANGO',
      fk_id_region: 1
    },
    {
      name: 'PAINE',
      fk_id_region: 1
    },
    {
      name: 'SAN BERNARDO',
      fk_id_region: 1
    },
    {
      name: 'ALHUÉ',
      fk_id_region: 1
    },
    {
      name: 'CURACAVÍ',
      fk_id_region: 1
    },
    {
      name: 'MARÍA PINTO',
      fk_id_region: 1
    },
    {
      name: 'MELIPILLA',
      fk_id_region: 1
    },
    {
      name: 'SAN PEDRO',
      fk_id_region: 1
    },
    {
      name: 'EL MONTE',
      fk_id_region: 1
    },
    {
      name: 'ISLA DE MAIPO',
      fk_id_region: 1
    },
    {
      name: 'PADRE HURTADO',
      fk_id_region: 1
    },
    {
      name: 'PEÑAFLOR',
      fk_id_region: 1
    },
    {
      name: 'TALAGANTE',
      fk_id_region: 1
    }
  ], {})
}
export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('commune', null, {})
}
