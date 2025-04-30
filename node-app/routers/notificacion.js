const express = require('express');
const model = require('../models/notificacion.js');
const notificacion = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

/**
 * Valida el ID de usuario
 */
const validarIdUsuario = (req, res, next) => {
    try {
        const idUsuario = Number(req.params.idUsuario);

        if (isNaN(idUsuario) || idUsuario <= 0) {
            const error = new Error("El formato del ID de usuario no es válido");
            error.status = 400;
            return next(error);
        }

        req.idUsuario = idUsuario;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Verifica que el usuario exista
 */
const verificarUsuarioExiste = async (req, res, next) => {
    try {
        // Use req.idUsuario from validarIdUsuario middleware or from URL params
        // instead of trying to get it from req.body which is undefined for GET requests
        const idUsuario = req.idUsuario || Number(req.params.idUsuario);

        if (!idUsuario) {
            return res.status(400).json({
                error: "Se requiere un ID de usuario"
            });
        }

        const usuarioExiste = await model.verificarUsuarioExiste(idUsuario);

        if (!usuarioExiste) {
            return res.status(404).json({
                error: `No se encontró el usuario con id ${idUsuario}`
            });
        }

        req.idUsuario = idUsuario;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Valida los campos obligatorios para crear una notificación
 */
const validarCamposNotificacion = (req, res, next) => {
    try {
        const { titulo, mensaje, idUsuario } = req.body;
        const camposFaltantes = [];

        if (!titulo) camposFaltantes.push('titulo');
        if (!mensaje) camposFaltantes.push('mensaje');
        if (!idUsuario) camposFaltantes.push('idUsuario');

        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                error: `Faltan los siguientes campos: ${camposFaltantes.join(', ')}`
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //


notificacion.post('/notificacion', async (req, res, next) => {
    try {
        const resultado = await model.crearNotificacion(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

// ESTE ENDPOINT LO ESTOY USANDO// ESTE ENDPOINT LO ESTOY USANDO
/**
 * Crear una notificación
 * POST /api/notificacion/
 */
notificacion.post('/notificacion', validarCamposNotificacion, verificarUsuarioExiste, async (req, res, next) => {
    try {
        const resultado = await model.crearNotificacion(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * Obtener todas las notificaciones de un usuario
 * GET /api/usuario/:idUsuario/notificacion/
 */
notificacion.get('/usuario/:idUsuario/notificacion', validarIdUsuario, verificarUsuarioExiste, async (req, res, next) => {
    try {
        const notificaciones = await model.obtenerNotificacionesPorUsuario(req.idUsuario);

        if (notificaciones.length === 0) {
            return res.status(404).json({
                error: `No se encontraron notificaciones para el usuario con id ${req.idUsuario}`
            });
        }

        res.status(200).json(notificaciones);
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

notificacion.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    const estado = err.status || 500;
    res.status(estado).json({
        error: err.message || "Ocurrió un error al procesar la solicitud"
    });
});

module.exports = notificacion;
