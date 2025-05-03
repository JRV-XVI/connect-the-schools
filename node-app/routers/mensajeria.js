const express = require('express');
const model = require('../models/mensajeria.js');
const mensajeria = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const validarIdProyecto = (req, res, next) => {
    try {
        const idProyecto = Number(req.params.idProyecto);
        if (isNaN(idProyecto) || idProyecto <= 0) {
            const error = new Error("El formato del ID de proyecto no es válido");
            error.status = 400;
            return next(error);
        }
        req.idProyecto = idProyecto;
        next();
    } catch (error) {
        next(error);
    }
};

const obtenerMensajeriaPorProyecto = async (req, res, next) => {
    try {
        const resultado = await model.mensajeriaPorProyecto(req.idProyecto);
        if (resultado.length === 0) {
            const error = new Error(`Mensajerías con id de proyecto ${req.idProyecto} no encontradas`);
            error.status = 404;
            return next(error);
        }
        req.mensajerias = resultado;
        next();
    } catch (error) {
        next(error);
    }
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Obtener mensajerías de un proyecto
mensajeria.get(
    '/proyecto/:idProyecto/mensajeria',
    validarIdProyecto,
    obtenerMensajeriaPorProyecto,
    (req, res) => {
        res.status(200).json(req.mensajerias);
    }
);

// Manejador genérico de errores
mensajeria.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    const estado = err.status || 500;
    res.status(estado).json({
        error: err.message || "Ocurrió un error al procesar la solicitud"
    });
});

module.exports = mensajeria;
