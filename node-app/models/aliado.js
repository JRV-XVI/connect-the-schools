const db = require('../db');

// ------------------------------------------- //
// ----------------- ALIADO ------------------ //
// ------------------------------------------- //

const registroAliado = async () => {
	const resultado = await db.query('SELECT * FROM ');
};

const obtenerAliados = async () => {
	const resultado = await db.query('SELECT * FROM "perfilAliado"');
	return resultado.rows;
};

const infoAliado = async (id) => {
	const resultado = await db.query('SELECT * FROM "perfilAliado" WHERE rfc = $1', [id]);
	return resultado.rows;
};

async function crearAliado(data) {
	const {
		email,
		password,
		phone,
		allyName,
		userType,
		direction,
		rfc,
		socialReason,
		phoneRepresentative,
		emailRepresentative
	} = data;

	const estadoCuenta = true; // Pendiente
	const fechaCreacion = new Date();

	// Insertar en Usuario
	const idUsuario = await db.query(`INSERT INTO Usuario (correo, contraseña, "tipoPerfil", "estadoCuenta", "fechaCreacion", telefono, nombre, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "idUsuario"`, [
		email,
		password,
		userType,
		estadoCuenta,
		fechaCreacion,
		phone,
		allyName,
		direction
	]);
	var id = idUsuario.rows[0].idUsuario;

	await db.query(`INSERT INTO "perfilAliado" ("idUsuario", rfc, "razonSocial", telefono, "correoRepresentante") VALUES ($1 , $2, $3, $4, $5)`, [
		id,
		rfc,
		socialReason,
		phoneRepresentative,
		emailRepresentative,
	]);

	return id;
}

const necesidadesCompatibles = async (idUsuario) => {
	const resultado = await db.query(
		`SELECT 
			"necesidadApoyo"."idNecesidadApoyo",
			"necesidadApoyo"."idUsuario",
			"necesidadApoyo".categoria,
			"necesidadApoyo".subcategoria,
			"necesidadApoyo".descripcion,
			"necesidadApoyo".prioridad,
			"necesidadApoyo"."fechaCreacion",
			"necesidadApoyo"."estadoValidacion",
			"perfilEscuela".cct,
			"perfilEscuela"."nivelEducativo",
			"perfilEscuela"."nombreDirector",
			"perfilEscuela"."telefonoDirector",
			"perfilEscuela"."numeroEstudiantes",
			"perfilEscuela".sector
		FROM "necesidadApoyo"
		INNER JOIN "necesidadApoyo" AS apoyo
		  ON "necesidadApoyo".categoria = apoyo.categoria
		INNER JOIN "perfilEscuela"
		  ON "perfilEscuela"."idUsuario" = "necesidadApoyo"."idUsuario"
		WHERE apoyo."idUsuario" = $1
		  AND "necesidadApoyo".prioridad IS NOT NULL
		  AND "necesidadApoyo"."estadoValidacion" = 3
		  AND apoyo.prioridad IS NULL
		  AND apoyo."estadoValidacion" = 3`,
		[idUsuario]
	);

	return resultado.rows;
}
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


module.exports = { obtenerAliados, infoAliado, crearAliado, actualizarAliado, eliminarAliado, necesidadesCompatibles };

