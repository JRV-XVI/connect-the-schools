/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('notificaciones', function(t) {
		t.increments('idNotificacion').unsigned().primary().notNullable();
		t.text('titulo').notNullable();
		t.text('mensaje').notNullable();
		t.integer('idUsuario')
			.unsigned()
			.notNullable()
			.references('idUsuario')
			.inTable('usuario')
			.onDelete('CASCADE');
		t.date('fecha')
			.defaultTo(knex.fn.now())
			.notNullable();

	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('notificaciones');

};
