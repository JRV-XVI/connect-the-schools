const express = require('express');
const model = require('../models/usuarios.js')
const { query } = require('../db.js');
const usuario = express.Router();


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


// Obtener datos del usuario completo
usuario.get('/usuario', async (req, res, next) => {
	const resultado = await model.obtenerUsuarios();
	res.send(resultado);
});

// Crear usuario
usuario.post('/usuario', async (req, res, next) => {
	const resultado = await model.crearUsuario(req.query);
	console.log(resultado);
	res.send(resultado);
});

// Eliminar usuario
usuario.delete('/usuario', (req, res, next) => {

});

// Obtener correo
usuario.get('/usuario/correo/:id', obtenerCorreo, (req, res, next) => {
	res.send(req.usuario);
});

// Actualizar correo
usuario.put('/usuario/correo', (req, res, next) => {

});

// Obtener la contraseña
usuario.get('/usuario/contraseña', (req, res, next) => {

});

// Actualizar contraseña
usuario.put('/usuario/contraseña', (req, res, next) => {

});

module.exports = usuario;


