/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('mensajeria', function(tabla) {
		tabla.increments('idMensajeria')
			.unsigned()
			.primary();
		tabla.integer('idProyecto'); // FALTA REALACIÒN FK CON PROYECTO
		tabla.date('fechaCreacion')
			.defaultTo(knex.fn.now())
			.notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('mensajeria');
};
