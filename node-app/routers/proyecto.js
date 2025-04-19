const express = require('express');
const modelo = require('../models/proyectos.js')
const { query } = require('../db.js');
const proyecto = express.Router();

const obtenerProyecto = async (req, res, next) => {
	const id = Number(req.params.id);
	const resultado = await modelo.proyectoId(id);
	if (resultado.length === 0) {
		const error = new Error(`Proyecto con id ${req.params.id} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.proyecto = resultado[0];
	req.id = id;
	next();
};

// Obtener datos del proyecto completo
proyecto.get('/proyecto', async (req, res, next) => {
	const resultado = await modelo.obtenerProyectos();
	res.send(resultado);
});

// Crear proyecto
proyecto.post('/proyecto', async (req, res, next) => {
	const resultado = await modelo.crearProyecto(req.query);
	console.log(resultado);
	res.send(resultado);
});

// Obtener proyecto por id
proyecto.get('/proyecto/:id', obtenerProyecto, (req, res, next) => {
	res.send(req.proyecto);
});

// Eliminar proyecto
proyecto.delete('/proyecto/:id', obtenerProyecto, async (req, res, next) => {
	const resultado = await modelo.eliminarProyecto(req.id);
	res.send(resultado);
});

proyecto.use((err, req, res, next) => {
	const estado = err.status || 500;
	res.status(estado).send({ error: err.message });
});

module.exports = proyecto;
