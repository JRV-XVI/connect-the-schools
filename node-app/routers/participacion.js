const express = require('express');
const model = require('../models/participacion.js');
const participacion = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerParticipacion = async (req, res, next) => {
    const { rfc, cct } = req.params;
    const resultado = await model.obtenerParticipacionPorRfcCct(rfc, cct);
    if (!resultado) {
        const error = new Error(`No se encontró la participación en proyecto con los parámetros especificados`);
        error.status = 404;
        return next(error);
    }
    req.participacion = resultado;
    next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Crear participación en proyecto
participacion.post('/participacion/:cct/:rfc', async (req, res, next) => {
    try {
        const { cct, rfc } = req.params;
        const { idProyecto, aceptacionAliado, aceptacionEscuela } = req.body;

        if (aceptacionAliado === undefined || aceptacionEscuela === undefined) {
            return res.status(400).json({ error: "Faltan campos obligatorios para la participación" });
        }

        const resultado = await model.crearParticipacion({ idProyecto, cct, rfc, aceptacionAliado, aceptacionEscuela });
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener participaciones por proyecto
participacion.get('/proyecto/:idProyecto/participacion', async (req, res, next) => {
    try {
        const idProyecto = Number(req.params.idProyecto);
        if (isNaN(idProyecto)) return res.status(400).json({ error: "El formato del id de proyecto no es válido" });

        const resultado = await model.obtenerParticipacionesPorProyecto(idProyecto);
        if (resultado.length === 0) return res.status(404).json({ error: `No se encontraron participaciones para el proyecto con id ${idProyecto}` });

        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener participaciones con idProyecto NULL
participacion.get('/participacion', async (req, res, next) => {
    try {
        const resultado = await model.obtenerParticipacionesSinProyecto();
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener participación por RFC y CCT
participacion.get('/participacion/:rfc/:cct', obtenerParticipacion, (req, res) => {
    res.status(200).json(req.participacion);
});

// Actualizar participación por RFC y CCT
participacion.put('/participacion/:rfc/:cct', obtenerParticipacion, async (req, res, next) => {
    try {
        const { rfc, cct } = req.params;
        const resultado = await model.actualizarParticipacion(rfc, cct, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = participacion;

