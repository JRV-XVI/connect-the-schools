const express = require('express');
const modelo = require('../models/usuarios.js')
const { query } = require('../db.js');
const usuario = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- // 

const obtenerUsuario = async (req, res, next) => {
	const id = Number(req.params.id);
	const resultado = await modelo.infoUsuario(id);
	if (resultado.length === 0) {
		const error = new Error(`Usuario con id ${req.params.id} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.usuario = resultado[0];
	req.id = id;
	next();
};

const obtenerAliado = async (req, res, next) => {
	const id = req.params.id;
	const resultado = await modelo.infoAliado(id);
	if (resultado.length === 0) {
		const error = new Error(`Aliado con rfc ${req.params.id} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.aliado = resultado[0];
	req.id = id;
	next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

/**
 *
 *
 * USUARIO
 *
 * 
**/

// Obtener datos del usuario completo
usuario.get('/usuario', async (req, res, next) => {
	const resultado = await modelo.obtenerUsuarios();
	res.send(resultado);
});

// Crear usuario
usuario.post('/usuario', async (req, res, next) => {
	const resultado = await modelo.crearUsuario(req.query);
	console.log(resultado);
	res.send(resultado);
});

// Obtener datos de un usuario
usuario.get('/usuario/:id', obtenerUsuario, (req, res, next) => {
	res.send(req.usuario);
});

// Actualizar datos del usuario
usuario.put('/usuario/:id', obtenerUsuario, async (req, res, next) => {
	const resultado = await modelo.actualizarUsuario(req.id, req.query);
	res.send(resultado);
});

// Eliminar usuario
usuario.delete('/usuario/:id', obtenerUsuario, async (req, res, next) => {
	const resultado = await modelo.eliminarUsuario(req.id);
	res.send(resultado);
});

/**
 *
 *
 * ALIADO
 *
 * 
**/

// Obtener todos los aliados
usuario.get('/aliado', async (req, res, next) => {
	const resultado = await modelo.obtenerAliados();
	res.send(resultado);
})

// Obtener un aliado en especifico
usuario.get('/aliado/:id', obtenerAliado, (req, res, next) => {
	res.send(req.aliado);
});

// Crear un nuevo aliado
usuario.post('/aliado', async (req, res, next) => {
	const resultado = await modelo.crearAliado(req.query);
	res.send(resultado);
});

// Eliminar un aliado
usuario.delete('/aliado/:id', obtenerAliado, async (req, res, next) => {
	const resultado = await modelo.eliminarAliado(req.id);
	res.send(resultado);
});

/**
 *
 *
 * ERRORES
 *
 * 
**/

usuario.use((err, req, res, next) => {
	const estado = err.status || 500;
	res.status(estado).send({ error: err.message });
});

module.exports = usuario;
