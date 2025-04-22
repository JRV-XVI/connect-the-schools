/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('evaluacionEducativa', function(t) {
		t.increments('idEvaluacionesEducativas').unsigned().primary().notNullable();
		t.text('observacion').notNullable();
		t.text('cct')
			.notNullable()
			.references('cct')
			.inTable('perfilEscuela')
			.onDelete('CASCADE');
		t.date('fechaCreacion')
			.defaultTo(knex.fn.now())
			.notNullable();
		t.integer('datoAsistencia').notNullable();
		t.integer('estadoValidacion').notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('evaluacionEducativa');

};
