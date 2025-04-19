const express = require('express');
const modelo = require('../models/usuarios.js')
const { query } = require('../db.js');
const usuario = express.Router();

const obtenerUsuario = async (req, res, next) => {
	const id = Number(req.params.id);
	const resultado = await modelo.usuarioId(id);
	if (resultado.length === 0) {
		const error = new Error(`Usuario con id ${req.params.id} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.usuario = resultado[0];
	req.id = id;
	next();
};

const validarArgumentos = (req, res, next) => {
	const argumentos = req.query;

	if (typeof argumentos !== 'object' || argumentos === null) {
		const error = new Error('Argumentos inválidos en la URL');
		error.status = 400;
		return next(error);
	}

	const campos = ['correo', 'contraseña', 'telefono', 'nombre', 'direccion'];

	const faltantes = campos.filter(campo => !(campo in argumentos));

	if (faltantes.length > 0) {
		const error = new Error(`Faltan los siguientes campos: ${faltantes.join(', ')}`);
		error.status = 400;
		return next(error);
	}

	next();
};

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
usuario.put('/usuario/:id', obtenerUsuario, validarArgumentos, async (req, res, next) => {
	const resultado = await modelo.actualizarUsuario(req.id, req.query);
	res.send(resultado);
});

// Eliminar usuario
usuario.delete('/usuario/:id', obtenerUsuario, async (req, res, next) => {
	const resultado = await modelo.eliminarUsuario(req.id);
	res.send(resultado);
});

usuario.use((err, req, res, next) => {
	const estado = err.status || 500;
	res.status(estado).send({ error: err.message });
});

module.exports = usuario;
