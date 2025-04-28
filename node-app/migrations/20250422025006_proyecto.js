/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('proyecto', function(t) {
		t.increments('idProyecto')
			.unsigned()
			.primary();
		t.boolean('validacionAdmin')
			.defaultTo(true)
			.notNullable();
		t.text('descripcion')
			.notNullable();
		t.date('fechaCreacion')
			.defaultTo(knex.fn.now())
			.notNullable();
		t.date('fechaFin')
			.notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('proyecto');
};
