/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('proyectoEtapas', function(t) {
		t.increments('idEtapa')
			.unsigned()
			.primary();
		t.integer('idProyecto')
			.unsigned()
			.notNullable()
			.references('idProyecto')
			.inTable('proyecto')
			.onDelete('CASCADE');
		t.text('tituloEtapa').notNullable();
		t.text('descripcionEtapa').notNullable();
		t.boolean('estadoEntrega')
			.notNullable()
			.defaultTo(false)
		t.integer('orden')
			.notNullable()
			.unsigned();
		t.specificType('archivo', 'BYTEA')
		t.date('fechaEntrega')
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('proyectoEtapas');
};
