const express = require('express');
const model = require('../models/aliados.js')
const { query } = require('../db.js');
const aliado = express.Router();

const obtenerIdAliado = async (req, res, next) => {
	const id = Number(req.params.id);
	const resultado = await model.obtenerAliado(id);
	if (resultado.length === 0) {
		const error = new Error(`Aliado con cct ${req.params.id} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.aliado = resultado[0];
	req.id = id;
	next();
};

aliado.get('/aliado/:id', obtenerIdAliado, (req, res, next) => {
	res.send(req.aliado);
});

aliado.post('/aliado', async (req, res, next) => {
	const resultado = await model.crearAliado(req.query);
	res.send(resultado);
});

module.exports = aliado

