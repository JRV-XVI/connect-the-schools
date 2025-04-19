const db = require('../db');

// Proyectos
// Obtener todos los proyectos
const obtenerProyectos = async () => {
	const resultado = await db.query('SELECT * FROM proyecto');
	return resultado.rows;
};

// Obtener un proyecto por id
const proyectoId = async (id) => {
	const resultado = await db.query('SELECT * FROM proyecto WHERE "idProyecto" = $1', [id]);
	return resultado.rows;
};

// Crear nuevo proyecto
const crearProyecto = async (params) => {
	const resultado = await db.query('INSERT INTO proyecto ("validacionAdmin", descripcion, "fechaCreacion") VALUES ($1, $2, $3)',
		[
			params.validacionAdmin,
			params.descripcion,
			params.fechaCreacion,
		]);
	return resultado.rows;
};

// Eliminar un proyecto
const eliminarProyecto = async (id) => {
	const resultado = await db.query('DELETE FROM proyecto WHERE "idProyecto" = $1', [id]);
	return {
		mensaje: `Proyecto con id de ${id} fue eliminado correctamente`
	};
};

// ProyectoEtapa
// Crear un proyecto etapa
const crearProyectoEtapa = async (params) => {
	const resultado = await db.query('INSERT INTO "proyectoEtapas" ("idProyecto", "tituloEtapa", "descripcionEtapa", orden) VALUES ($1, $2, $3, $4)',
		[
			params.idProyecto,
			params.tituloEtapa,
			params.descripcionEtapa,
			params.orden
		]);
	return resultado.rows;
};

// Eliminar una etapa del proyecto
const eliminarProyectoEtapa = async (id) => {
	const resultado = await db.query('DELETE FROM "proyectoEtapas" WHERE "idEtapa" = $1', [id]);
	return {
		mensaje: `Proyecto etapa con id de ${id} fue eliminado correctamente`
	};
};

// ProyectoEntrega
// Crear una entrega de proyecto
const crearProyectoEntrega = async () => {
	const resultado = await db.query('INSERT INTO "proyectoEntregas" ("idEtapa", "tituloEntrega", "fechaEntrega", descripcion, estadoEntrega, archivo, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7)',
		[
			params.idEtapa,
			params.tituloEntrega,
			params.fechaEntrega,
			params.descripcion,
			params.estadoEntrega,
			params.archivo,
			params.observaciones
		]);
	return resultado.rows;
};

// Eliminar una entrega de proyecto
const eliminarProyectoEntrega = async (id) => {
	const resultado = await db.query('DELETE FROM "proyectoEntregas" WHERE "idEntrega" = $1', [id]);
	return {
		mensaje: `Proyecto entrega con id de ${id} fue eliminado correctamente`
	};
};

module.exports = { obtenerProyectos, proyectoId, crearProyecto, eliminarProyecto, crearProyectoEtapa };
