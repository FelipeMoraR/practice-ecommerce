'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('commune', [
    {
      name: 'Cerrillos',
      fk_id_region: 1
    },
    {
      name: 'Cerro Navia',
      fk_id_region: 1
    },
    {
      name: 'Conchalí',
      fk_id_region: 1
    },
    {
      name: 'El Bosque',
      fk_id_region: 1
    },
    {
      name: 'Estación Central',
      fk_id_region: 1
    },
    {
      name: 'Huechuraba',
      fk_id_region: 1
    },
    {
      name: 'Independencia',
      fk_id_region: 1
    },
    {
      name: 'La Cisterna',
      fk_id_region: 1
    },
    {
      name: 'La Florida',
      fk_id_region: 1
    },
    {
      name: 'La Granja',
      fk_id_region: 1
    },
    {
      name: 'La Pintana',
      fk_id_region: 1
    },
    {
      name: 'La Reina',
      fk_id_region: 1
    },
    {
      name: 'Las Condes',
      fk_id_region: 1
    },
    {
      name: 'Lo Barnechea',
      fk_id_region: 1
    },
    {
      name: 'Lo Espejo',
      fk_id_region: 1
    },
    {
      name: 'Lo Prado',
      fk_id_region: 1
    },
    {
      name: 'Macul',
      fk_id_region: 1
    },
    {
      name: 'Maipú',
      fk_id_region: 1
    },
    {
      name: 'Ñuñoa',
      fk_id_region: 1
    },
    {
      name: 'Pedro Aguirre Cerda',
      fk_id_region: 1
    },
    {
      name: 'Peñalolén',
      fk_id_region: 1
    },
    {
      name: 'Providencia',
      fk_id_region: 1
    },
    {
      name: 'Pudahuel',
      fk_id_region: 1
    },
    {
      name: 'Quilicura',
      fk_id_region: 1
    },
    {
      name: 'Quinta Normal',
      fk_id_region: 1
    },
    {
      name: 'Recoleta',
      fk_id_region: 1
    },
    {
      name: 'Renca',
      fk_id_region: 1
    },
    {
      name: 'San Joaquín',
      fk_id_region: 1
    },
    {
      name: 'San Miguel',
      fk_id_region: 1
    },
    {
      name: 'San Ramón',
      fk_id_region: 1
    },
    {
      name: 'Santiago',
      fk_id_region: 1
    },
    {
      name: 'Vitacura',
      fk_id_region: 1
    },
    {
      name: 'Colina',
      fk_id_region: 1
    },
    {
      name: 'Lampa',
      fk_id_region: 1
    },
    {
      name: 'Tiltil',
      fk_id_region: 1
    },
    {
      name: 'Pirque',
      fk_id_region: 1
    },
    {
      name: 'Puente Alto',
      fk_id_region: 1
    },
    {
      name: 'San José de Maipo',
      fk_id_region: 1
    },
    {
      name: 'Buin',
      fk_id_region: 1
    },
    {
      name: 'Calera de Tango',
      fk_id_region: 1
    },
    {
      name: 'Paine',
      fk_id_region: 1
    },
    {
      name: 'San Bernardo',
      fk_id_region: 1
    },
    {
      name: 'Alhué',
      fk_id_region: 1
    },
    {
      name: 'Curacaví',
      fk_id_region: 1
    },
    {
      name: 'María Pinto',
      fk_id_region: 1
    },
    {
      name: 'Melipilla',
      fk_id_region: 1
    },
    {
      name: 'San Pedro',
      fk_id_region: 1
    },
    {
      name: 'El Monte',
      fk_id_region: 1
    },
    {
      name: 'Isla de Maipo',
      fk_id_region: 1
    },
    {
      name: 'Padre Hurtado',
      fk_id_region: 1
    },
    {
      name: 'Peñaflor',
      fk_id_region: 1
    },
    {
      name: 'Talagante',
      fk_id_region: 1
    }
  ], {})
}
export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('commune', null, {})
}
