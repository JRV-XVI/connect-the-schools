const db = require('../db');

// ------------------------------------------- //
// ----------------- ALIADO ------------------ //
// ------------------------------------------- //

const obtenerAliados = async () => {
	const resultado = await db.query('SELECT * FROM "perfilAliado"');
	return resultado.rows;
};

const infoAliado = async (id) => {
	const resultado = await db.query('SELECT * FROM "perfilAliado" WHERE rfc = $1', [id]);
	return resultado.rows;
};

const crearAliado = async (params) => {
	const resultado = await db.query('INSERT INTO "perfilAliado" (rfc, "idUsuario", "razonSocial", telefono, "correoRepresentante") VALUES ($1, $2, $3, $4, $5) RETURNING *',
		[
			params.rfc,
			params.idUsuario,
			params.razonSocial,
			params.telefono,
			params.correoRepresentante
		]);
	return resultado.rows;
};

const actualizarAliado = async (rfc, params) => {
	// Construir query dinámicamente
	const camposActualizables = ['idUsuario', 'razonSocial', 'telefono', 'correoRepresentante'];
	const updates = [];
	const values = [rfc]; // El primer parámetro es siempre el rfc
	
	let paramIndex = 2; // Empezamos desde $2
	
	camposActualizables.forEach(campo => {
		if (params[campo] !== undefined) {
			updates.push(`"${campo}" = $${paramIndex}`);
			values.push(params[campo]);
			paramIndex++;
		}
	});
	
	// Si no hay campos para actualizar, retornar
	if (updates.length === 0) return null;
	
	const query = `UPDATE "perfilAliado" SET ${updates.join(', ')} WHERE "rfc" = $1 RETURNING *`;
	const resultado = await db.query(query, values);
	return resultado.rows[0];
}

const eliminarAliado = async (id) => {
	const resultado = await db.query('DELETE FROM "perfilAliado" WHERE rfc = $1', [id]);
	return {
		mensaje: `Aliado con rfc de ${id} fue eliminado correctamente`
	};
};


module.exports = {obtenerAliados, infoAliado, crearAliado, actualizarAliado, eliminarAliado };
