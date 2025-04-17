/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('usuario', function(t) {
		t.increments('idUsuario').unsigned().primary();
		t.text('correo').notNullable();
		t.text('contraseña').notNullable();
		t.boolean('estadoCuenta').notNullable();
		t.date('fechaCreacion').notNullable();
		t.text('telefono').notNullable();
		t.text('nombre').notNullable();
		t.text('direccion').notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('usuario');
};
