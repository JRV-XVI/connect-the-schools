/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('evaluacionEncuesta', function(t) {
		t.increments('idEvaluacion').unsigned().primary().notNullable();
		t.text('descripcion').notNullable();
		t.integer('idEncuesta')
			.unsigned()
			.notNullable()
			.references('idEncuesta')
			.inTable('encuestaSalida')
			.onDelete('CASCADE');
		t.integer('cumplimientoCompromiso').notNullable();
		t.integer('calidadInteraccion').notNullable();
		t.integer('comunicacionProceso').notNullable();
		t.integer('evaluacionMPJ').notNullable();
		t.integer('estadoValidacion').notNullable();
		t.text('comentario');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('evaluacionEncuesta');

};
