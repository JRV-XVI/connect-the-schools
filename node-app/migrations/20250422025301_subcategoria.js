/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('subcategoria', function(tabla) {
		tabla.increments('idSubcategoria')
			.notNullable()
			.unsigned()
			.primary();
		tabla.integer('idCategoria')
			.unsigned()
			.notNullable()
			.references('idCategoria')
			.inTable('categoria')
			.onDelete('CASCADE');
		tabla.text('nombreSubcategoria').notNullable();
		tabla.text('descripcion').notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('subcategoria');
};
