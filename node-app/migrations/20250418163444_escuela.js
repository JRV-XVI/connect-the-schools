/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('perfilEscuela', function(tabla) {
        tabla.text('cct')
            .notNullable()
            .primary();
        tabla.integer('idUsuario')
            .unsigned()
            .notNullable()
            .references('idUsuario')
            .inTable('usuario')
            .onDelete('CASCADE');
        tabla.text('nivelEducativo')
            .notNullable();
        tabla.text('sector')
            .notNullable();
        tabla.integer('numeroEstudiantes')
            .unsigned()
            .notNullable();
        tabla.text('nombreDirector')
            .notNullable();
        tabla.text('telefonoDirector')
            .notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('perfilEscuela');
};