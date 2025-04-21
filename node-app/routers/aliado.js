const express = require('express');
const modelo = require('../models/aliado.js')
const { query } = require('../db.js');
const usuario = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- // 

const obtenerAliado = async (req, res, next) => {
	const rfc = req.params.rfc;
	const resultado = await modelo.infoAliado(rfc);
	if (resultado.length === 0) {
		const error = new Error(`Aliado con rfc ${req.params.rfc} no encontrado`);
		error.status = 404;
		return next(error);
	}
	req.aliado = resultado[0];
	req.rfc = rfc;
	next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Crear un nuevo aliado
usuario.post('/aliado', async (req, res, next) => {
	try {
	  const resultado = await modelo.crearAliado(req.query);
	  res.send(resultado);
	} catch (error) {
	  if (error.status === 500 || !error.status) {
		return res.status(400).json({
		  error: "Faltan los siguientes campos requeridos"
		});
	  }
	  next(error);
	}
  });

// Obtener todos los aliados
usuario.get('/aliado', async (req, res, next) => {
	const resultado = await modelo.obtenerAliados();
	res.send(resultado);
})

// Obtener un aliado en especifico
usuario.get('/aliado/:rfc', obtenerAliado, (req, res, next) => {
	res.send(req.aliado);
});

// Actualizar datos de aliado por RFC
usuario.put('/aliado/:rfc', obtenerAliado, async (req, res, next) => {
	try {
		const resultado = await modelo.actualizarAliado(req.rfc, req.query);
		if (!resultado) {
			return res.status(400).json({ mensaje: "No hay campos para actualizar" });
		}
		res.status(200).json(resultado);
	} catch (error) {
		next(error);
	}
});


// Eliminar un aliado
usuario.delete('/aliado/:rfc', async (req, res, next) => {
	try {
	  const resultado = await modelo.eliminarAliado(req.rfc);
	  res.send(resultado);
	} catch (error) {
	  // Si es un error 404 (no encontrado)
	  if (error.status === 404) {
		return res.status(404).json({
		  error: `Aliado con rfc ${req.params.rfc} no encontrado`
		});
	  }
	  // Para cualquier otro error
	  next(error);
	}
});

module.exports = usuario;