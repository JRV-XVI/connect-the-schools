/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('usuario', function(t) {
		t.increments('idUsuario')
			.unsigned()
			.primary();
		t.text('correo')
			.notNullable();
		t.text('contraseña')
			.notNullable();
		t.boolean('estadoCuenta')
			.defaultTo(false)
			.notNullable();
		t.date('fechaCreacion')
			.defaultTo(knex.fn.now())
			.notNullable();
		t.text('telefono')
			.notNullable();
		t.text('nombre')
			.notNullable();
		t.integer('tipoPerfil').
			notNullable();
		t.text('calle')
			.notNullable();
		t.text('codigoPostal')
			.notNullable();
		t.text('ciudad')
			.notNullable();
		t.text('estado')
			.notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('usuario');
};
