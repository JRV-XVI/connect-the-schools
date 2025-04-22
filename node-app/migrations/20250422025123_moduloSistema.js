/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('moduloSistema', function(tabla) {
		tabla.increments('idModulo')
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
	return knex.schema.dropTable('moduloSistema');
};
