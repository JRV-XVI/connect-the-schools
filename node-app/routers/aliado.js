const express = require('express');
const modelo = require('../models/aliado.js')
const { query } = require('../db.js');
const usuario = express.Router();
const aliado = express.Router();
const db = require('../db.js');

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- // 

const obtenerAliado = async (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Mandar registro
aliado.post('/registro/aliado', async (req, res, next) => {
	try {
		// FIXED: Changed from req.query to req.body
		const {
			correo: email,          // Match frontend field names
			contrasena: password,
			telefono: phone,
			nombre_aliado: allyName,
			tipo_usuario: userType,
			direccion: direction,
			rfc,
			razon_social: socialReason,
			telefono_representante: phoneRepresentative,
			correo_representante: emailRepresentative
		} = req.body;

		await modelo.crearAliado({
			email,
			password,
			phone,
			allyName,
			userType,
			direction,
			rfc,
			socialReason,
			phoneRepresentative,
			emailRepresentative
		});

		res.status(201).json({
			email,
			phone,
			allyName,
			userType,
			direction,
			rfc,
			socialReason,
			phoneRepresentative,
			emailRepresentative
		});
	} catch (error) {
		console.error("Error al registrar aliado:", error);
		res.status(500).json({ error: 'Error al registrar aliado' });
	}
});

aliado.post('/lista/necesidad', async (req, res, next) => {
	try {
		const { idUsuario } = req.body;
		const resultado = await modelo.necesidadesCompatibles(idUsuario);
		res.status(200).send(resultado);
	} catch (error) {
		if (error.status === 500 || !error.status) {
			console.error("Error al obtener lista de necesidades", error);
			return res.status(400).json({
				error: "No se puedo obtener informacion"
			});
		}
		next(error);
	}
});

// Crear un nuevo aliado
aliado.post('/aliado', async (req, res, next) => {
	try {
		const resultado = await modelo.crearAliado(req.query);
		res.status(201).send(resultado);
	} catch (error) {
		if (error.status === 500 || !error.status) {
			return res.status(400).json({
				error: "Faltan campos"
			});
		}
		next(error);
	}
});

// POST para crear un apoyo
aliado.post('/apoyos-aliado', async (req, res) => {
	try {
		const { idUsuario, descripcion, categoria, subcategoria } = req.body;

		const query = `
		INSERT INTO "necesidadApoyo" 
		("idUsuario", "descripcion", "categoria", "subcategoria", "fechaCreacion", "prioridad", "estadoValidacion")
		VALUES ($1, $2, $3, $4, NOW(), NULL, 0) -- 🔥 Estado inicial 0 (por ejemplo "pendiente")
		RETURNING *;
	  `;

		const values = [idUsuario, descripcion, categoria, subcategoria];
		const { rows } = await db.query(query, values);

		res.status(201).json(rows[0]);
	} catch (error) {
		console.error('[ERROR] Al crear apoyo:', error);
		res.status(500).json({ error: error.message });
	}
});


// Obtener todos los aliados
usuario.get('/aliado', async (req, res, next) => {
	try {
		const resultado = await modelo.obtenerAliados();
		res.status(200).send(resultado);
	} catch (error) {
		next(error);
	}
});

// Obtener un aliado en especifico
usuario.get('/aliado/:rfc', obtenerAliado, (req, res) => {
	res.status(200).send(req.aliado);
});

// Actualizar datos de aliado por RFC
usuario.put('/aliado/:rfc', obtenerAliado, async (req, res, next) => {
	try {
		const resultado = await modelo.actualizarAliado(req.rfc, req.query);
		if (!resultado) {
			return res.status(400).json({ error: "No hay campos para actualizar" });
		}
		res.status(200).json(resultado);
	} catch (error) {
		next(error);
	}
});

aliado.get('/apoyos-aliado/:idUsuario', async (req, res) => {
	try {
		const { idUsuario } = req.params;
		const query = `
		SELECT 
		  "idNecesidadApoyo",
		  "descripcion",
		  "categoria",
		  "subcategoria",
		  "fechaCreacion"
		FROM "necesidadApoyo"
		WHERE "idUsuario" = $1
		AND "prioridad" IS NULL
	  `;
		const { rows } = await db.query(query, [idUsuario]);
		res.status(200).json(rows);
	} catch (error) {
		console.error('[ERROR] Al obtener apoyos:', error.message);
		res.status(500).json({ error: "Error al obtener apoyos" });
	}
});


// Eliminar un aliado
usuario.delete('/aliado/:rfc', async (req, res, next) => {
	try {
		const resultado = await modelo.eliminarAliado(req.params.rfc);
		res.status(200).json({
			mensaje: `Aliado con rfc ${req.params.rfc} fue eliminado correctamente`
		});
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

/**
 *
 *
 * ERRORES
 *
 *
**/

usuario.use((err, req, res, next) => {
	const estado = err.status || 500;
	res.status(estado).json({ error: err.message || "Ocurrió un error al procesar la solicitud" });
});

module.exports = aliado;
