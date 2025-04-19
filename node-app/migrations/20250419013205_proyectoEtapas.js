/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('proyectoEtapas', function(t) {
		t.increments('idEtapa')
			.unsigned()
			.primary()
		t.integer('idProyecto')
			.unsigned()
			.notNullable()
			.references('idProyecto')
			.inTable('proyecto')
			.onDelete('CASCADE')
		t.text('tituloEtapa').notNullable()
		t.text('descripcionEtapa').notNullable()
		t.integer('orden')
			.notNullable()
			.unsigned()
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('proyectoEtapas');
};
