const express = require('express');
const modelo = require('../models/aliados.js')
const { query } = require('../db.js');
const aliado = express.Router();

const obtenerAliado = async (req, res, next) => {
	const id = req.params.id;
	const resultado = await modelo.aliadoId(id);
	if (resultado.length === 0) {
		const error = new Error(`Aliado con rfc ${req.params.id} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.aliado = resultado[0];
	req.id = id;
	next();
};

aliado.get('/aliado', async (req, res, next) => {
	const resultado = await modelo.obtenerAliados();
	res.send(resultado);
})

aliado.get('/aliado/:id', obtenerAliado, (req, res, next) => {
	res.send(req.aliado);
});

aliado.post('/aliado', async (req, res, next) => {
	const resultado = await modelo.crearAliado(req.query);
	res.send(resultado);
});

aliado.delete('/aliado/:id', obtenerAliado, async (req, res, next) => {
	const resultado = await modelo.eliminarAliado(req.id);
	res.send(resultado);
});

aliado.use((err, req, res, next) => {
	const estado = err.status || 500;
	res.status(estado).send({ error: err.message });
});

module.exports = aliado;
