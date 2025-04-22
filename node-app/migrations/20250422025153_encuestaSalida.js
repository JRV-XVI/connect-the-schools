/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('encuestaSalida', function(t) {
		t.increments('idEncuesta').unsigned().primary().notNullable();
		t.date('fechaRespuesta')
			.defaultTo(knex.fn.now())
			.notNullable()
		t.text('descripcion').notNullable();
		t.integer('idUsuario')
			.unsigned()
			.notNullable()
			.references('idUsuario')
			.inTable('usuario')
			.onDelete('CASCADE');
		t.integer('idProyecto')
			.unsigned()
			.notNullable()
			.references('idProyecto')
			.inTable('proyecto')
			.onDelete('CASCADE');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('encuestaSalida');

};
