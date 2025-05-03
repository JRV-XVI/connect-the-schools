const express = require('express');
const model = require('../models/mensaje.js');
const mensaje = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const validarId = (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0) {
            const error = new Error("El formato del ID no es válido");
            error.status = 400;
            return next(error);
        }

        req.id = id;
        next();
    } catch (error) {
        next(error);
    }
};

const obtenerMensajesPorMensajeria = async (req, res, next) => {
    try {
        const resultado = await model.mensajePorMensajeria(req.id);

        if (resultado.length === 0) {
            const error = new Error(`No se encontraron mensajes para la mensajería con id ${req.id}`);
            error.status = 404;
            return next(error);
        }

        req.mensajes = resultado;
        next();
    } catch (error) {
        next(error);
    }
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Obtener todos los mensajes de una mensajería (proyecto) por su ID
mensaje.get('/mensajeria/:id/mensajes', validarId, obtenerMensajesPorMensajeria, (req, res) => {
    res.status(200).json(req.mensajes);
});

// Crear un mensaje por un proyecto
mensaje.post('/mensajeria/:id/mensajes', async (req, res, next) => {
    try {
        const datos = {
            idMensajeria: req.params.id,  // Usar el ID de la URL (idMensajeria)
            idUsuario: req.body.idUsuario,
            contenido: req.body.contenido,
        };

        const resultado = await model.crearMensaje(datos);
        res.status(201).json(resultado);
    } catch (error) {
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

mensaje.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    const estado = err.status || 500;
    res.status(estado).json({
        error: err.message || "Ocurrió un error al procesar la solicitud"
    });
});

module.exports = mensaje;
