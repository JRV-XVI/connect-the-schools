/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
  return knex.schema.createTable('necesidadApoyo', function(tabla) { // Cambiado a 'necesidadApoyo'
    tabla.increments('idNecesidadApoyo').primary();
    tabla.integer('idUsuario').unsigned().notNullable()
      .references('idUsuario').inTable('usuario').onDelete('CASCADE');
    tabla.text('categoria').notNullable();
    tabla.text('subcategoria').notNullable();
    tabla.text('descripcion').notNullable();
    tabla.text('prioridad');
    tabla.timestamp('fechaCreacion').defaultTo(knex.fn.now());
    tabla.integer('estadoValidacion')
      .notNullable()
      .defaultTo(2)
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('necesidadApoyo'); // Cambiado a 'necesidadApoyo'
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('necesidadApoyo');
};
