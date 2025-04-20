const express = require('express');
const modelo = require('../models/proyectos.js')
const multer = require('multer');
const { query } = require('../db.js');
const proyecto = express.Router();
const upload = multer(); // Usa memoria (buffer), no disco

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- // 

// PARA OBTENER EL ID Y OBJETO CORRESPONDIENTE
const obtenerProyecto = async (req, res, next) => {
	const idProyecto = Number(req.params.idProyecto);
	const resultado = await modelo.infoProyecto(idProyecto);
	if (resultado.length === 0) {
		const error = new Error(`Proyecto con id ${idProyecto} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.proyecto = resultado[0];
	req.idProyecto = idProyecto;
	next();
};

const obtenerEtapa = async (req, res, next) => {
	const idEtapa = Number(req.params.idEtapa);
	const resultado = await modelo.infoEtapa(idEtapa);
	if (resultado.length === 0) {
		const error = new Error(`Etapa con id ${idEtapa} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.etapa = resultado[0];
	req.idEtapa = idEtapa;
	next();
};

const obtenerEntrega = async (req, res, next) => {
	const idEntrega = Number(req.params.idEntrega);
	const resultado = await modelo.infoEntrega(idEntrega);
	if (resultado.length === 0) {
		const error = new Error(`Etapa con id ${idEntrega} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.entrega = resultado[0];
	req.idEntrega = idEntrega;
	next();
};

// PARA VALIDAR SI CONTIENE UN ID EN UNA TABLA
const validarProyecto = async (req, res, next) => {
	const resultado = await modelo.obtenerProyectoEtapas(req.idProyecto);
	if (resultado.length === 0) {
		const error = new Error(`No existe ninguna etapa relacionada con el proyecto con id ${req.idProyecto}`);
		error.status = 404;
		return next(error);
	}
	req.etapas = resultado;
	next();
};

const validarEtapa = async (req, res, next) => {
	const resultado = await modelo.obtenerProyectoEntrega(req.idEtapa);
	if (resultado.length === 0) {
		const error = new Error(`No existe ninguna etapa relacionada con el proyecto con id ${req.idProyecto}`);
		error.status = 404;
		return next(error);
	}
	req.entrega = resultado;
	next();
};

// COMRUEBA SI EXISTE TABLA QUE RELACIONEN A DOS IDs
const validarProyectoEtapa = async (req, res, next) => {
	const existe = await modelo.existeProyectoEtapa(req.idEtapa, req.idProyecto);
	if (!existe) {
		const error = new Error(`No existe la etapa ${idEtapa} para el proyecto ${idProyecto}`);
		error.status = 404;
		return next(error);
	}
	next();
};

const validarEtapaEntrega = async (req, res, next) => {
	const existe = await modelo.existe(req.idEtapa, req.idProyecto);
	if (!existe) {
		const error = new Error(`No existe la etapa ${idEtapa} para el proyecto ${idProyecto}`);
		error.status = 404;
		return next(error);
	}
	next();
};

// VERIFICA ARGUMENTOS SI SON LOS SOLIICITADOS
const validarArgumentosProyecto = (req, res, next) => {
	const argumentos = req.query;

	if (typeof argumentos !== 'object' || argumentos === null) {
		const error = new Error('Argumentos inválidos en la URL');
		error.status = 400;
		return next(error);
	}

	const campos = ['validacionAdmin', 'descripcion', 'fechaCreacion']

	const faltantes = campos.filter(campo => !(campo in argumentos));

	if (faltantes.length > 0) {
		const error = new Error(`Faltan los siguientes campos: ${faltantes.join(', ')}`);
		error.status = 400;
		return next(error);
	}
	next();
};

const validarArgumentosEtapas = (req, res, next) => {
	const argumentos = req.query;

	if (typeof argumentos !== 'object' || argumentos === null) {
		const error = new Error('Argumentos inválidos en la URL');
		error.status = 400;
		return next(error);
	}

	const campos = ['tituloEtapa', 'descripcionEtapa', 'orden']

	const faltantes = campos.filter(campo => !(campo in argumentos));

	if (faltantes.length > 0) {
		const error = new Error(`Faltan los siguientes campos: ${faltantes.join(', ')}`);
		error.status = 400;
		return next(error);
	}
	next();
};

const validarArgumentosEntregas = (req, res, next) => {
	const argumentos = req.body;

	if (typeof argumentos !== 'object' || argumentos === null) {
		const error = new Error('Argumentos inválidos en el body');
		error.status = 400;
		return next(error);
	}

	const campos = ['tituloEntrega', 'fechaEntrega', 'descripcion', 'estadoEntrega', 'observaciones'];

	const faltantes = campos.filter(campo => !(campo in argumentos));
	if (faltantes.length > 0) {
		const error = new Error(`Faltan los siguientes campos: ${faltantes.join(', ')}`);
		error.status = 400;
		return next(error);
	}

	// Validar si llegó un archivo
	if (!req.file || !req.file.buffer) {
		const error = new Error('Falta el archivo de entrega');
		error.status = 400;
		return next(error);
	}

	next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

/**
 *
 *
 * PROYECTO
 *
 * 
**/

// Obtener datos del proyecto completo
proyecto.get('/proyecto', async (req, res, next) => {
	const resultado = await modelo.obtenerProyectos();
	res.send(resultado);
});

// Crear proyecto
proyecto.post('/proyecto', validarArgumentosProyecto, async (req, res, next) => {
	const resultado = await modelo.crearProyecto(req.query);
	console.log(resultado);
	res.send(resultado);
});

// Obtener proyecto por id
proyecto.get('/proyecto/:idProyecto', obtenerProyecto, (req, res, next) => {
	res.send(req.proyecto);
});

// Actualizar proyecto
proyecto.put('/proyecto/:idProyecto', obtenerProyecto, async (req, res, next) => {
	const resultado = await modelo.actualizarProyecto(req.idProyecto, req.query);
	res.send(resultado);
});

// Eliminar proyecto
proyecto.delete('/proyecto/:idProyecto', obtenerProyecto, async (req, res, next) => {
	const resultado = await modelo.eliminarProyecto(req.idProyecto);
	res.send(resultado);
});

/**
 *
 *
 * ETAPAS
 *
 * 
**/

// Obtener todas las etapas de un proyecto especifico
proyecto.get('/proyecto/:idProyecto/etapas', obtenerProyecto, validarProyecto, async (req, res, next) => {
	res.send(req.etapas);
});

// Obtener una etapa especifica de un proyecto especifico
proyecto.get('/proyecto/:idProyecto/etapas/:idEtapa', obtenerProyecto, obtenerEtapa, validarProyectoEtapa, (req, res, next) => {
	res.send(req.etapa);
});

// Crear etapa en un proyecto
proyecto.post('/proyecto/:idProyecto/etapas', obtenerProyecto, validarArgumentosEtapas, async (req, res, next) => {
	const resultado = await modelo.crearProyectoEtapa(req.idProyecto, req.query);
	res.send(resultado);
});

/**
 *
 *
 * ENTREGAS
 *
 * 
**/

// Obtener todas las entrega de una etapa especifica
proyecto.get('/proyecto/etapas/:idEtapa/entregas', obtenerEtapa, validarEtapa, async (req, res, next) => {
	res.send(req.entrega);
});

// Obtener una entrega especifica de una etapa especifica
proyecto.get('/proyecto/entregas/:idEtapa/entregas/:idEntrega', obtenerEtapa, obtenerEntrega, validarEtapaEntrega, (req, res, next) => {
	res.send(req.entrega);
});

// Obtener archivo de entrega
proyecto.get('/proyecto/etapas/entregas/:idEntrega/archivo', obtenerEntrega, (req, res, next) => {
	const entrega = req.entrega;

	if (!entrega) {
		return res.status(404).send({ error: 'Entrega no encontrada' });
	}

	if (!entrega.archivo) {
		return res.status(404).send({ error: 'Archivo no encontrado' });
	}

	const archivo = entrega.archivo;

	// Cambia el tipo MIME según el tipo real
	res.setHeader('Content-Type', 'text/markdown'); // Por el momento se visualiza markdown porque hice una prueba
	res.setHeader('Content-Disposition', 'inline; filename="documento.md"');
	res.send(archivo);
});

// Crear entrega en un etapa
proyecto.post('/proyecto/etapas/:idEtapa/entregas', obtenerEtapa, upload.single('archivo'), validarArgumentosEntregas, async (req, res, next) => {
	const datos = {
		...req.body,
		archivo: req.file.buffer
	};
	const resultado = await modelo.crearProyectoEntrega(req.idEtapa, datos);
	res.send(resultado);
});

/**
 *
 *
 * ERRORES
 *
 * 
**/

proyecto.use((err, req, res, next) => {
	const estado = err.status || 500;
	res.status(estado).send({ error: err.message });
});

module.exports = proyecto;
