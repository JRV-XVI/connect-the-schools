/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('proyectoEntregas', function(t) {
		t.increments('idEntrega')
			.unsigned()
			.primary()
		t.integer('idEtapa')
			.unsigned()
			.notNullable()
			.references('idEtapa')
			.inTable('proyectoEtapas')
			.onDelete('CASCADE')
		t.text('tituloEntrega').notNullable()
		t.date('fechaEntrega').notNullable()
		t.text('descripcion').notNullable()
		t.integer('estadoEntrega')
			.notNullable()
			.unsigned()
		t.specificType('archivo', 'BYTEA').notNullable()
		t.text('observaciones');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('proyectoEntregas');
};
