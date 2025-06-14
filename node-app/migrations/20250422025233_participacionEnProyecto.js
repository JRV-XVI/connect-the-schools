/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('participacionProyecto', function(t) {
		t.integer('idProyecto')
			.unsigned()
			.references('idProyecto')
			.inTable('proyecto')
			.onDelete('CASCADE');
		t.text('cct')
			.notNullable()
			.references('cct')
			.inTable('perfilEscuela')
			.onDelete('CASCADE');
		t.text('rfc')
			.notNullable()
			.references('rfc')
			.inTable('perfilAliado')
			.onDelete('CASCADE');
		t.integer('idNecesidad')
			.notNullable()
			.references('idNecesidadApoyo')
			.inTable('necesidadApoyo')
			.onDelete('CASCADE');
		t.integer('idApoyo')
			.notNullable()
			.references('idNecesidadApoyo')
			.inTable('necesidadApoyo')
			.onDelete('CASCADE');
		t.text('observacion')
			.notNullable()
		t.boolean('aceptacionAliado')
			.defaultTo(true)
			.notNullable();
		t.boolean('aceptacionEscuela')
			.defaultTo(true)
			.notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('participacionProyecto');

};
