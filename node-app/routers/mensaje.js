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

const validarCamposObligatorios = (req, res, next) => {
    try {
        const { contenido, idUsuario, idMensajeria } = req.query;
        const camposFaltantes = [];

        if (!contenido) camposFaltantes.push('contenido');
        if (!idUsuario) camposFaltantes.push('idUsuario');
        if (!idMensajeria) camposFaltantes.push('idMensajeria');

        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const obtenerMensajePorId = async (req, res, next) => {
    try {
        const resultado = await model.mensajePorId(req.id);

        if (resultado.length === 0) {
            const error = new Error(`Mensaje con id ${req.id} no encontrado`);
            error.status = 404;
            return next(error);
        }

        req.mensaje = resultado[0];
        next();
    } catch (error) {
        next(error);
    }
};

const obtenerMensajesPorUsuario = async (req, res, next) => {
    try {
        const resultado = await model.mensajePorUsuario(req.idUsuario);

        if (resultado.length === 0) {
            const error = new Error(`No se encontraron mensajes para el usuario con id ${req.idUsuario}`);
            error.status = 404;
            return next(error);
        }

        req.mensajes = resultado;
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

// Obtener todos los mensajes
mensaje.get('/mensaje', async (req, res, next) => {
    try {
        const resultado = await model.obtenerMensaje();
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener un mensaje por su ID
mensaje.get('/mensaje/:id', validarId, obtenerMensajePorId, (req, res) => {
    res.status(200).json(req.mensaje);
});

// Obtener todos los mensajes de un usuario por su ID
mensaje.get('/usuario/:idUsuario/mensajes', validarIdUsuario, obtenerMensajesPorUsuario, (req, res) => {
    res.status(200).json(req.mensajes);
});

// Obtener todos los mensajes de una mensajería (proyecto) por su ID
mensaje.get('/mensajeria/:id/mensajes', validarId, obtenerMensajesPorMensajeria, (req, res) => {
    res.status(200).json(req.mensajes);
});

// Crear un mensaje
mensaje.post('/mensaje', validarCamposObligatorios, async (req, res, next) => {
    try {
        const datos = {
            ...req.query,
            fechaCreacion: new Date().toISOString()
        };

        const resultado = await model.crearMensaje(datos);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Eliminar un mensaje por su ID
mensaje.delete('/mensaje/:id', validarId, async (req, res, next) => {
    try {
        const resultado = await model.eliminarMensajePorId(req.id);

        if (!resultado) {
            const error = new Error(`Mensaje con id ${req.id} no encontrado`);
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            mensaje: `Mensaje con id ${req.id} eliminado correctamente`,
            datos: resultado
        });
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
