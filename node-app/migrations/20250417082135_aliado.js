/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('perfilAliado', function(t) {
		t.text('rfc')
			.notNullable()
			.primary();
		t.integer('idUsuario')
			.unsigned()
			.notNullable()
			.references('idUsuario')
			.inTable('usuario')
			.onDelete('CASCADE');
		t.text('razonSocial')
			.notNullable()
		t.integer('telefono')
			.unsigned()
			.notNullable();
		t.text('correoRepresentante')
			.notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('perfilAliado');
};
