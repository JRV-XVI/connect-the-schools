const express = require('express');
const modelo = require('../models/usuarios.js')
const { query } = require('../db.js');
const usuario = express.Router();

// Ingresar a la plataforma 
usuario.post('/login', async (req, res, next) => {
	try {
		const { correo, contraseña } = req.body;

		// Verifica si el usuario existe
		const resultado = await modelo.validacionLogin({ correo, contraseña });
		if (resultado.length === 0) {
			return res.status(401).json({ error: 'Credenciales inválidas' });
		}

		// Devuelve los datos del usuario
		res.status(200).send(resultado);
	} catch (error) {
		console.error("Credenciales no validas:", error);
		res.status(400).json({ error: 'Credenciales no validas' });
	}
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
