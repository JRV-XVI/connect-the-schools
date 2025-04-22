/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('bitacoraSistema', function(t) {
		t.increments('idBitacora').unsigned().primary().notNullable();
		t.date('fechaAccion')
			.defaultTo(knex.fn.now())
			.notNullable();
		t.text('descripcion').notNullable();
		t.integer('idUsuario')
			.unsigned()
			.notNullable()
			.references('idUsuario')
			.inTable('usuario')
			.onDelete('CASCADE');
		t.integer('idAccion')
			.unsigned()
			.notNullable()
			.references('idAccion')
			.inTable('accionSistema')
			.onDelete('CASCADE');
		t.integer('idModulo')
			.unsigned()
			.notNullable()
			.references('idModulo')
			.inTable('moduloSistema')
			.onDelete('CASCADE');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('bitacoraSistema');

};
