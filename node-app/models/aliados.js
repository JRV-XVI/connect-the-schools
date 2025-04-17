const db = require('../db');

const obtenerAliado = async () => {
	const resultado = await db.query('SELECT * FROM "perfilAliado"');
	return resultado.rows;
}

const aliadoId = async (id) => {
	const resultado = await db.query('SELECT * FROM "perfilAliado" WHERE cct = $1', [id]);
	return resultado.rows;
}

const crearAliado = async (params) => {
	const resultado = await db.query('INSERT INTO "perfilAliado" (cct, "idUsuario", "razonSocial", telefono, "correoRepresentante") VALUES ($1, $2, $3, $4, $5)',
		[
			params.cct,
			params.idUsuario,
			params.razonSocial,
			params.telefono,
			params.correoRepresentante
		]);
	return resultado.rows;
}

module.exports = { obtenerAliado, aliadoId, crearAliado };
