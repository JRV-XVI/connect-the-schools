const express = require('express');
const multer = require('multer');
const modelo = require('../models/proyectos.js');
const proyecto = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

// Middleware para verificar si existe un proyecto
const verificarProyectoExiste = async (req, res, next) => {
	try {
		const idProyecto = Number(req.params.idProyecto);

		if (isNaN(idProyecto) || idProyecto <= 0) {
			const error = new Error("El formato del id de proyecto no es válido");
			error.status = 400;
			return next(error);
		}

		const resultado = await modelo.infoProyecto(idProyecto);

		if (resultado.length === 0) {
			const error = new Error(`Proyecto con id ${idProyecto} no encontrado`);
			error.status = 404;
			return next(error);
		}

		req.proyecto = resultado[0];
		req.idProyecto = idProyecto;
		next();
	} catch (error) {
		next(error);
	}
};

// ------------------------------------------- //
// ------------ RUTAS DE PROYECTOS ----------- //
// ------------------------------------------- //


// Obtener todos los proyectos por idUsuario
proyecto.get('/proyecto/usuario/:idUsuario', async (req, res, next) => {
	try {
		const idUsuario = parseInt(req.params.idUsuario, 10);

		if (isNaN(idUsuario) || idUsuario <= 0) {
			return res.status(400).json({
				error: "El ID de usuario debe ser un número entero positivo"
			});
		}

		const resultado = await modelo.obtenerProyectosPorUsuario(idUsuario);
		res.status(200).json(resultado);
	} catch (error) {
		next(error);
	}
});

// ------------------------------------------- //
// ------------ RUTAS DE ETAPAS -------------- //
// ------------------------------------------- //


// Obtener todas las etapas de un proyecto
proyecto.get('/proyecto/:idProyecto/etapas', verificarProyectoExiste, async (req, res, next) => {
	try {
		const resultado = await modelo.obtenerProyectoEtapas(req.idProyecto);
		res.status(200).json(resultado);
	} catch (error) {
		next(error);
	}
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
	const mensaje = err.status ? err.message : "Ocurrió un error al procesar la solicitud";

	res.status(estado).json({ error: mensaje });
});

module.exports = proyecto;
