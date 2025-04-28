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

const crearVinculacion = async (data) => {
	// Datos deafault para crear la participacion
	const {
		rfc,
		cct,
		idNecesidad,
		idApoyo,
		observacion
	} = data;

	const idProyecto = null
	const aceptacionAliado = true;
	const aceptacionEscuela = false;

	const resultado = await db.query(`
		INSERT INTO "participacionProyecto" 
			("idProyecto", cct, rfc, "idNecesidad", "idApoyo", observacion, "aceptacionAliado", "aceptacionEscuela")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING *
	`, [idProyecto, cct, rfc, idNecesidad, idApoyo, observacion, aceptacionAliado, aceptacionEscuela]);

	return resultado.rows[0];


};

// Obtener todas las vinculaciones
const obtenerVinculaciones = async () => {
	const vinculaciones = await db.query(`
	SELECT 
	  pp.cct,
	  e."nivelEducativo",
	  e.sector,
	  e."numeroEstudiantes",
	  e."nombreDirector",
	  e."telefonoDirector",

	  pp.rfc,
	  a."razonSocial",
	  a.telefono,
	  a."correoRepresentante",

	  pp."idNecesidad",
	  n.categoria AS "necesidadCategoria",
	  n.subcategoria AS "necesidadSubcategoria",
	  n.descripcion AS "necesidadDescripcion",
	  n.prioridad AS "necesidadPrioridad",

	  pp."idApoyo",
	  ap.categoria AS "apoyoCategoria",
	  ap.subcategoria AS "apoyoSubcategoria",
	  ap.descripcion AS "apoyoDescripcion",

	  pp.observacion

	FROM "participacionProyecto" pp
	JOIN "perfilEscuela" e ON pp.cct = e.cct
	JOIN "perfilAliado" a ON pp.rfc = a.rfc
	JOIN "necesidadApoyo" n ON pp."idNecesidad" = n."idNecesidadApoyo"
	JOIN "necesidadApoyo" ap ON pp."idApoyo" = ap."idNecesidadApoyo"
	WHERE pp."aceptacionEscuela" IS TRUE
		AND pp."aceptacionAliado" IS TRUE
		AND pp."idProyecto" IS NULL
	`);
	return vinculaciones.rows;
};


const crearProyecto = async (data) => {
	const { descripcion, fechaFin, etapas } = data;

	const result = await db.query(`
	    INSERT INTO proyecto (descripcion, "fechaFin")
	    VALUES ($1, $2)
	    RETURNING "idProyecto"
	  `, [descripcion, fechaFin]);

	const idProyecto = result.rows[0].idProyecto;

	await db.query(`
		INSERT INTO mensajeria ("idProyecto") VALUES ($1)
	`, [idProyecto])

	for (let etapa of etapas) {
		const { tituloEtapa, descripcionEtapa, orden } = etapa;

		await db.query(`
	      INSERT INTO "proyectoEtapas" ("idProyecto", "tituloEtapa", "descripcionEtapa", "orden", "estadoEntrega")
	      VALUES ($1, $2, $3, $4, $5)
	    `, [
			idProyecto,
			tituloEtapa,
			descripcionEtapa,
			orden,
			false // estadoEntrega inicial
		]);
	}

	return { message: 'Proyecto y etapas creados correctamente' };
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
	obtenerParticipacionesSinProyecto,
	obtenerParticipacionPorEscuelaYAliado,
	obtenerParticipacionConsolidada,
	actualizarParticipacion,
	actualizarParticipacionConProyecto,
	crearVinculacion,
	obtenerVinculaciones,
	crearProyecto
};

