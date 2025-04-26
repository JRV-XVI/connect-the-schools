/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('necesidadApoyo', function(tabla) {
		tabla.increments('idNecesidadApoyo')
			.notNullable()
			.unsigned()
			.primary();
		tabla.integer('idUsuario')
			.unsigned()
			.notNullable()
			.references('idUsuario')
			.inTable('usuario')
			.onDelete('CASCADE');
		tabla.text('categoria').notNullable();
		tabla.text('subcategoria').notNullable();
		tabla.text('descripcion')
			.notNullable();
		tabla.text('prioridad')
			.notNullable();
		tabla.date('fechaCreacion')
			.defaultTo(knex.fn.now())
			.notNullable();
		tabla.integer('estadoValidacion')
			.notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('necesidadApoyo');
};
