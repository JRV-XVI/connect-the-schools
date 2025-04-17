const express = require('express');
const model = require('../models/usuarios.js')
const { query } = require('../db.js');
const aliado = express.Router();

const obtenerCorreo = async (req, res, next) => {
	const id = Number(req.params.id);
	const resultado = await model.obtenerCorreo(id);
	if (resultado.length === 0) {
		const error = new Error(`Usuario con id ${req.params.id} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.usuario = resultado[0];
	req.id = id;
	next();
};

aliado.get('/aliado/:id', a

