const db = require('../db');


// Crear nueva participación en proyecto
const crearParticipacion = async (rfc, cct, datos = {}) => {
	// Datos deafault para crear la participacion
	const {
		idProyecto = null,
		aceptacionAliado = true,
		aceptacionEscuela = false
	} = datos;

	// Verifica existencia de la escuela
	const escuela = await db.query('SELECT * FROM "perfilEscuela" WHERE cct = $1', [cct]);
	if (escuela.rows.length === 0) {
		const error = new Error(`No se encontró la escuela con CCT: ${cct}`);
		error.status = 404;
		throw error;
	}

	// Verifica existencia del aliado
	const aliado = await db.query('SELECT * FROM "perfilAliado" WHERE rfc = $1', [rfc]);
	if (aliado.rows.length === 0) {
		const error = new Error(`No se encontró el aliado con RFC: ${rfc}`);
		error.status = 404;
		throw error;
	}

	const resultado = await db.query(`
		INSERT INTO "participacionProyecto" 
			("idProyecto", cct, rfc, "aceptacionAliado", "aceptacionEscuela")
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`, [idProyecto, cct, rfc, aceptacionAliado, aceptacionEscuela]);

	const participacion = resultado.rows[0];

	// Añadir campo virtual: fechaCreacion
	return {
		...participacion,
		fechaCreacion: new Date().toISOString() // o cualquier formato que estés usando
	};
};



// Obtener todas las participaciones por idProyecto
const obtenerParticipacionesPorProyecto = async (idProyecto) => {
	const resultado = await db.query(`
		SELECT p.*, 
			to_jsonb(proyecto.*) AS proyecto,
			to_jsonb(pe.*) AS escuela,
			to_jsonb(pa.*) AS aliado
		FROM "participacionProyecto" p
		LEFT JOIN proyecto ON proyecto."idProyecto" = p."idProyecto"
		LEFT JOIN "perfilEscuela" pe ON pe.cct = p.cct
		LEFT JOIN "perfilAliado" pa ON pa.rfc = p.rfc
		WHERE p."idProyecto" = $1
	`, [idProyecto]);
	return resultado.rows;
};

// Participaciones sin proyecto asignado
const obtenerParticipacionesSinProyecto = async () => {
	const resultado = await db.query(`
		SELECT p.*, 
			to_jsonb(pe.*) AS escuela,
			to_jsonb(pa.*) AS aliado
		FROM "participacionProyecto" p
		LEFT JOIN "perfilEscuela" pe ON pe.cct = p.cct
		LEFT JOIN "perfilAliado" pa ON pa.rfc = p.rfc
		WHERE p."idProyecto" IS NULL
	`);
	return resultado.rows.map(row => ({ ...row, estado: "Pendiente de asignación a proyecto" }));
};

// Participación por rfc y cct
const obtenerParticipacionPorEscuelaYAliado = async (rfc, cct) => {
	const resultado = await db.query(`
		SELECT p.*, 
			to_jsonb(pe.*) AS escuela,
			to_jsonb(pa.*) AS aliado
		FROM "participacionProyecto" p
		LEFT JOIN "perfilEscuela" pe ON pe.cct = p.cct
		LEFT JOIN "perfilAliado" pa ON pa.rfc = p.rfc
		WHERE p.rfc = $1 AND p.cct = $2
	`, [rfc, cct]);
	return resultado.rows[0];
};

// Participación por idProyecto
const obtenerParticipacionConsolidada = async (idProyecto) => {
	const resultado = await db.query(`
		SELECT p.*, 
			proyecto.descripcion, proyecto."fechaCreacion" AS "fechaProyecto", proyecto."validacionAdmin",
			pe.*, pa.*, 
			'Firmado por ambas partes' AS estado
		FROM "participacionProyecto" p
		LEFT JOIN proyecto ON p."idProyecto" = proyecto."idProyecto"
		LEFT JOIN "perfilEscuela" pe ON p.cct = pe.cct
		LEFT JOIN "perfilAliado" pa ON p.rfc = pa.rfc
		WHERE p."idProyecto" = $1
	`, [idProyecto]);
	return resultado.rows[0];
};

// Actualizar participación por cct y rfc
const actualizarParticipacion = async (rfc, cct) => {
	const resultado = await db.query(`
		UPDATE "participacionProyecto"
		SET "aceptacionEscuela" = $1
		WHERE rfc = $2 AND cct = $3
		RETURNING *`,
		[true, rfc, cct]
	);
	return resultado.rows[0];
};

// Actualizar participacion agregando idProyecto
const actualizarParticipacionConProyecto = async (rfc, cct, idProyecto) => {
	const resultado = await db.query(`
		UPDATE "participacionProyecto"
		SET "idProyecto" = $1
		WHERE rfc = $2 AND cct = $3
		RETURNING *`,
		[idProyecto, rfc, cct]
	);
	return resultado.rows[0];
};

module.exports = {
	crearParticipacion,
	obtenerParticipacionesPorProyecto,
	obtenerParticipacionesSinProyecto,
	obtenerParticipacionPorEscuelaYAliado,
	obtenerParticipacionConsolidada,
	actualizarParticipacion,
	actualizarParticipacionConProyecto
};

