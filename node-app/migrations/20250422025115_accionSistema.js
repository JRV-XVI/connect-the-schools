/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('accionSistema', function(tabla) {
		tabla.increments('idAccion')
			.notNullable()
			.unsigned()
			.primary();
		tabla.text('nombre').notNullable();
		tabla.text('descripcion').notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('accionSistema');
};
