/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('perfilAdmin', function(tabla) {
        tabla.increments('idPerfilAdmin')
            .unsigned()
            .primary();
        tabla.integer('idUsuario')
            .unsigned()
            .notNullable()
            .references('idUsuario')
            .inTable('usuario')
            .onDelete('CASCADE');
        tabla.text('rol')
            .notNullable()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
