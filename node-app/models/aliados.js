const db = require('../db');

const obtenerAliados = async () => {
	const resultado = await db.query('SELECT * FROM "perfilAliado"');
	return resultado.rows;
};

const aliadoId = async (id) => {
	const resultado = await db.query('SELECT * FROM "perfilAliado" WHERE rfc = $1', [id]);
	return resultado.rows;
};

const crearAliado = async (params) => {
	const resultado = await db.query('INSERT INTO "perfilAliado" (rfc, "idUsuario", "razonSocial", telefono, "correoRepresentante") VALUES ($1, $2, $3, $4, $5)',
		[
			params.rfc,
			params.idUsuario,
			params.razonSocial,
			params.telefono,
			params.correoRepresentante
		]);
	return resultado.rows;
};

const eliminarAliado = async (id) => {
	const resultado = await db.query('DELETE FROM "perfilAliado" WHERE "idUsuario" = $1', [id]);
	return {
		mensaje: `Aliado con rfc de ${id} fue eliminado correctamente`
	};
};

module.exports = { obtenerAliados, aliadoId, crearAliado, eliminarAliado };
