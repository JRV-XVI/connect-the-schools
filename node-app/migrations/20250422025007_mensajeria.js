/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('mensajeria', function(tabla) {
		tabla.increments('idMensajeria')
			.unsigned()
			.primary();
		tabla.integer('idProyecto')
			.unsigned()
			.notNullable()
			.references('idProyecto')
			.inTable('proyecto')
			.onDelete('CASCADE');
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
