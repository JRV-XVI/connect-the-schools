const db = require('../db');

// ------------------------------------------- //
// ----------------- PROYECTO ---------------- //
// ------------------------------------------- //

// Obtener todos los proyectos
const obtenerProyectos = async () => {
	const resultado = await db.query('SELECT * FROM proyecto');
	return resultado.rows;
};

// Obtener un proyecto por id
const infoProyecto = async (id) => {
	const resultado = await db.query('SELECT * FROM proyecto WHERE "idProyecto" = $1', [id]);
	return resultado.rows;
};

// Crear nuevo proyecto
const crearProyecto = async (params) => {
	const resultado = await db.query('INSERT INTO proyecto ("validacionAdmin", descripcion, "fechaCreacion") VALUES ($1, $2, $3) RETURNING *',
		[
			false,
			params.descripcion,
			new Date().toISOString(),
		]);
	return resultado.rows;
};

const actualizarProyecto = async (idProyecto, params) => {
	const camposActualizables = ['validacionAdmin', 'descripcion'];
	const disponibles = [];
	const valores = [idProyecto];

	let indiceParam = 2;
	camposActualizables.forEach(campo => {
		if (params[campo] !== undefined) {
			disponibles.push(`"${campo}" = $${indiceParam}`);
			valores.push(params[campo]);
			indiceParam++;
		}
	});

	if (disponibles.length === 0) return null;
	const query = `UPDATE proyecto SET ${disponibles.join(', ')} WHERE "idProyecto" = $1`;
	const resultado = await db.query(query, valores);
	return resultado.rows;
}

// ------------------------------------------- //
// ----------------- ETAPAS ------------------ //
// ------------------------------------------- //

// Obtener las etapas de un proyecto
const obtenerProyectoEtapas = async (idProyecto) => {
	const resultado = await db.query('SELECT * FROM "proyectoEtapas" WHERE "idProyecto" = $1', [idProyecto]);
	return resultado.rows;

};

// Obtener la informacion de una etapa
const infoEtapa = async (idEtapa) => {
	const resultado = await db.query('SELECT * FROM "proyectoEtapas" WHERE "idEtapa" = $1', [idEtapa]);
	return resultado.rows;
};

// Verifica si existe una etapa de un cierto proyecto
const existeProyectoEtapa = async (idEtapa, idProyecto) => {
	const resultado = await db.query('SELECT * FROM "proyectoEtapas" WHERE "idEtapa" = $1 AND "idProyecto" = $2', [idEtapa, idProyecto]);
	return resultado.rows.length > 0;
};

// Crear un proyecto etapa
const crearProyectoEtapa = async (idProyecto, params) => {
	const resultado = await db.query('INSERT INTO "proyectoEtapas" ("idProyecto", "tituloEtapa", "descripcionEtapa", orden) VALUES ($1, $2, $3, $4) RETURNING *',
		[
			idProyecto,
			params.tituloEtapa,
			params.descripcionEtapa,
			params.orden
		]);
	return resultado.rows;
};


// ------------------------------------------- //
// ----------------- ENTREGAS ---------------- //
// ------------------------------------------- //

// Crear una entrega de proyecto
const obtenerProyectoEntrega = async (idEtapa) => {
	const resultado = await db.query('SELECT * FROM "proyectoEntregas" WHERE "idEtapa" = $1', [idEtapa]);
	return resultado.rows;
};

// Obtener informacion de entrega
const infoEntrega = async (idEntrega) => {
	const resultado = await db.query('SELECT * FROM "proyectoEntregas" WHERE "idEntrega" = $1', [idEntrega]);
	return resultado.rows;
};

// Checar si existe entrega en etapa especifica
const existeEtapaEntrega = async (idEtapa, idEntega) => {
	const resultado = await db.query('SELECT * FROM "proyectoEntregas" WHERE "idEtapa" = $1 AND "idEntrega" = $2', [idEtapa, idEntrega]);
	return resultado.rows.length > 0;
};

// Crear una nueva entrega
const crearProyectoEntrega = async (idEtapa, params) => {
	const resultado = await db.query('INSERT INTO "proyectoEntregas" ("idEtapa", "tituloEntrega", "fechaEntrega", descripcion, "estadoEntrega", archivo, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
		[
			idEtapa,
			params.tituloEntrega,
			new Date().toISOString(),
			params.descripcion,
			params.estadoEntrega,
			params.archivo,
			params.observaciones
		]);
	return resultado.rows;
};

module.exports = { obtenerProyectos, infoProyecto, crearProyecto, actualizarProyecto, obtenerProyectoEtapas, existeProyectoEtapa, infoEtapa, crearProyectoEtapa, obtenerProyectoEntrega, infoEntrega, existeEtapaEntrega, crearProyectoEntrega };
