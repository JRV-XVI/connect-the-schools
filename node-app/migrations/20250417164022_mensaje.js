/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Mensaje', function(tabla) {
		tabla.increments('idMensaje')
            .unsigned()
            .primary();
        tabla.integer('idMensajeria')
            .unsigned()
            .notNullable()
            .references('idMensajeria')
            .inTable('Mensajeria')
            .onDelete('CASCADE');
        tabla.integer('idUsuario')
            .unsigned()
            .notNullable()
            .references('idUsuario')
            .inTable('usuario')
            .onDelete('CASCADE');
        tabla.date('fechaEnvio')
            .defaultTo(knex.fn.now())
            .notNullable();
        tabla.text('contenido')
            .notNullable();
        tabla.boolean('leido')
            .defaultTo(false)
            .notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
