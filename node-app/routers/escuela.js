const express = require('express');
const model = require('../models/escuela.js');
const escuela = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerIdEscuela = async (req, res, next) => {
    const cct = req.params.cct;
    try {
        const resultado = await model.obtenerIdEscuela(cct);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({
                error: `Escuela con cct '${cct}' no encontrada`
            });
        }

        req.escuela = resultado[0];
        next();
    } catch (error) {
        next(error);
    }
};

const eliminarEscuela = async (req, res, next) => {
    try {
        const cct = req.params.cct;
        const resultado = await model.obtenerIdEscuel(cct);

        if (resultado === 0) {
            const error = new Error(`Escuela con cct '${cct}' no encontrada`);
            error.status = 404;
            return next(error);
        }
        req.escuelaEliminada = resultado;
        next();
    } catch (error) {
        next(error);
    }
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Crear una escuela
escuela.post('/escuela', async (req, res, next) => {
    const resultado = await model.crearEscuela(req.query);
    res.send(resultado);
});

// Obtener todos las escuelas
escuela.get('/escuela', async (req, res, next) => {
    try {
        const resultado = await model.obtenerEscuela();
        res.status(200).send(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener una escuela por su ID
escuela.get('/escuela/:cct', obtenerIdEscuela, (req, res) => {
    res.status(200).send(req.escuela);
});

// Crear una escuela
escuela.post('/escuela', async (req, res, next) => {
    try {
        const resultado = await model.crearEscuela(req.query);
        res.status(201).send(resultado);
    } catch (error) {
        next(error);
    }
});

// Eliminar una escuela por su ID
escuela.delete('/escuela/:cct', eliminarEscuela, (req, res) => {
    res.status(200).json({
        mensaje: `Escuela con cct '${req.params.cct}' fue eliminada correctamente`
    });
});

// Actualizar una escuela por su CCT
escuela.put('/escuela/:cct', obtenerIdEscuela, async (req, res, next) => {
    try {
        // Verificar que al menos haya un campo para actualizar
        if (Object.keys(req.query).length === 0) {
            const error = new Error("Debe enviar al menos un campo válido para actualizar");
            error.status = 400;
            return next(error);
        }

        const resultado = await model.actualizarEscuela(req.params.cct, req.query);
        res.status(200).json(resultado);
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

escuela.use((err, req, res, next) => {
    const estado = err.status || 500;
    res.status(estado).json({ error: err.message || "Ocurrió un error al procesar la solicitud" });
});

module.exports = escuela;
