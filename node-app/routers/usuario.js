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

const validarUsuarioId = (req, res, next) => {
	const id = Number(req.params.id);
	// Verifica que sea un número y mayor que cero
	if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
		return res.status(400).json({
			error: "El parámetro 'idUsuario' debe ser un entero mayor que cero"
		});
	}
	// Si la validación pasa, continúa
	next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Crear usuario
usuario.post('/usuario', async (req, res, next) => {
	const resultado = await modelo.crearUsuario(req.query);
	console.log(resultado);
	res.send(resultado);
});

// Obtener todos los usuarios
usuario.get('/usuario', async (req, res, next) => {
	const resultado = await modelo.obtenerUsuarios();
	res.send(resultado);
});


// Obtener un usuario por id
usuario.get('/usuario/:id', validarUsuarioId, obtenerUsuario, (req, res, next) => {
	res.send(req.usuario);
});

// Actualizar datos de un usuario
usuario.put('/usuario/:id', validarUsuarioId, obtenerUsuario, async (req, res, next) => {
	try {
		const resultado = await modelo.actualizarUsuario(req.id, req.query);
		res.send(resultado);
	} catch (error) {
		// Estableces un código de error y un mensaje personalizado si no existen
		error.status = error.status || 500;
		error.message = error.message || 'Error actualizando el usuario';
		next(error);
	}
});

// Eliminar usuario
usuario.delete('/usuario/:id', validarUsuarioId, obtenerUsuario, async (req, res, next) => {
	const resultado = await modelo.eliminarUsuario(req.id);
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
