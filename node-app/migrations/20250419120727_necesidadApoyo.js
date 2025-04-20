/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('necesidadApoyo', function(tabla) {
        tabla.increments('idNecesidad')
            .unsigned()
            .primary();
        tabla.integer('idUsuario')
            .unsigned()
            .notNullable()
            .references('idUsuario')
            .inTable('usuario')
            .onDelete('CASCADE');
        tabla.integer('idCategoria'); // FALTA RELACIÒN FK CON CATEGORIA
        tabla.integer('idSubcategoria'); // FALTA RELACIÒN FK CON SUBCATEGORIA
        tabla.text('descripcion')
            .notNullable();
        tabla.text('prioridad')
            .notNullable();
        tabla.date('fechaCreacion')
            .defaultTo(knex.fn.now())
            .notNullable();
        tabla.integer('estadoValidacion')
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
