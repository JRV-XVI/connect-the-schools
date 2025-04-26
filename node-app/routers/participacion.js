const express = require('express');
const modelo = require('../models/participacion.js');
const participacion = express.Router();

// Crear participación
participacion.post('/participacion/:cct/:rfc', async (req, res, next) => {
    try {
        const { cct, rfc } = req.params;
        const datos = req.query; // puede incluir o no: idProyecto, aceptacionAliado, aceptacionEscuela

        const resultado = await modelo.crearParticipacion(rfc, cct, datos);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

participacion.post('/participacion', async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
});

participacion.get('/participacion', async (req, res, next) => {
    try {
        const resultado = await modelo.obtenerParticipacionesSinProyecto();
        res.status(200).send(resultado);
    } catch (error) {
        if (error.status === 500 || !error.status) {
            return res.status(400).json({
                error: "Fallo al obtener la informacion"
            });
        }
        next(error);
    }
});

// Obtener la participacion de un proyecto
participacion.get('/proyecto/:idProyecto/participacion', async (req, res, next) => {
    const idProyecto = Number(req.params.idProyecto);
    if (isNaN(idProyecto)) {
        return res.status(400).json({ error: "El formato del id de proyecto no es válido" });
    }
    try {
        const resultado = await modelo.obtenerParticipacionesPorProyecto(idProyecto);
        if (resultado.length === 0) {
            return res.status(404).json({ error: `No se encontraron participaciones para el proyecto con id ${idProyecto}` });
        }
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

//// Participaciones sin proyecto asignado
//participacion.get('/participacion', async (req, res, next) => {
//    try {
//        const resultado = await modelo.obtenerParticipacionesSinProyecto();
//        res.json(resultado);
//    } catch (error) {
//        next(error);
//    }
//});

// Obtener participación por RFC y CCT
participacion.get('/participacion/:cct/:rfc', async (req, res, next) => {
    const { rfc, cct } = req.params;
    try {
        const resultado = await modelo.obtenerParticipacionPorEscuelaYAliado(rfc, cct);
        if (!resultado) {
            return res.status(404).json({ error: "No se encontró la participación en proyecto con los parámetros especificados" });
        }
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

// Consolidación por idProyecto
participacion.get('/proyecto/:idProyecto/participacion', async (req, res, next) => {
    const idProyecto = Number(req.params.idProyecto);
    try {
        const resultado = await modelo.obtenerParticipacionConsolidada(idProyecto);
        if (!resultado) {
            return res.status(404).json({ error: `No se encontró la participación en proyecto con id ${idProyecto}` });
        }
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

// Actualizar participación para validacion escuela
participacion.put('/participacion/:cct/:rfc', async (req, res, next) => {
    const { rfc, cct } = req.params;
    try {
        const resultado = await modelo.actualizarParticipacion(rfc, cct);
        if (!resultado) {
            return res.status(404).json({ error: `No se encontró la participación en proyecto con los datos especificados` });
        }
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

// Actualizar participación para id proyecto
participacion.put('/participacion/:cct/:rfc/:idProyecto', async (req, res, next) => {
    const { rfc, cct, idProyecto } = req.params;

    try {
        const resultado = await modelo.actualizarParticipacionConProyecto(rfc, cct, idProyecto);
        if (!resultado) {
            return res.status(404).json({ error: `No se encontró la participación en proyecto con los datos especificados` });
        }
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

// Middleware de errores
participacion.use((err, req, res, next) => {
    const estado = err.status || 500;
    res.status(estado).json({ error: err.message });
});

module.exports = participacion;

