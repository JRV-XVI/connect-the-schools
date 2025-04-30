const express = require('express');
const modelo = require('../models/participacion.js');
const { param } = require('./proyecto.js');
const participacion = express.Router();

participacion.get('/vinculacion/:id', async (req, res, next) => {
    try {
        const resultado = await modelo.obtenerParticipacionesSinProyectoPorUsuario(req.params.id);
        res.status(200).send(resultado);
    } catch (error) {
        console.log("Error al realizar get en router: ", error)
        res.status(400).json({
            error: "Fallo al obtener las vinculaciones"
        })
    }
});

// Realizar una vinculacion de un aliado a una escuala
participacion.post('/vinculacion', async (req, res, next) => {
    try {
        // Match frontend field names
        const {
            rfc,
            cct,
            idNecesidad,
            idApoyo,
            observacion
        } = req.body;

        const resultado = await modelo.crearVinculacion({
            rfc,
            cct,
            idNecesidad,
            idApoyo,
            observacion
        });
        res.status(201).send(resultado);
    } catch (error) {
        if (error.status === 500 || !error.status) {
            console.error("Error al registrar la vinculacion:", error);
            return res.status(400).json({
                error: "Fallo en la creacion de vinculacion"
            });
        }
        next(error);
    }
});

participacion.delete('/vinculacion', async (req, res, next) => {
    try {
        // Get parameters from query string instead of body
        const {
            rfc,
            cct,
            idNecesidad,
            idApoyo,
        } = req.query;

        // Validate required parameters
        if (!rfc || !cct || !idNecesidad || !idApoyo) {
            console.error("Faltan parámetros requeridos:", { rfc, cct, idNecesidad, idApoyo });
            return res.status(400).json({
                error: "Faltan parámetros requeridos: rfc, cct, idNecesidad, idApoyo"
            });
        }

        const resultado = await modelo.eliminarVinculacion({
            rfc,
            cct,
            idNecesidad,
            idApoyo,
        });
        res.status(200).send(resultado);
    } catch (error) {
        console.error("Error al eliminar vinculacion:", error);
        res.status(400).json({
            error: "Fallo la eliminacion de vinculacion"
        });
    }
});

participacion.get('/vinculaciones', async (req, res, next) => {
    try {
        const vinculaciones = await modelo.obtenerVinculaciones();

        const resultado = vinculaciones.map((vinculacion) => {
            return {
                escuela: {
                    cct: vinculacion.cct,
                    nivelEducativo: vinculacion.nivelEducativo,
                    sector: vinculacion.sector,
                    numeroEstudiantes: vinculacion.numeroEstudiantes,
                    nombreDirector: vinculacion.nombreDirector,
                    telefonoDirector: vinculacion.telefonoDirector,
                },
                aliado: {
                    rfc: vinculacion.rfc,
                    razonSocial: vinculacion.razonSocial,
                    telefono: vinculacion.telefono,
                    correoRepresentante: vinculacion.correoRepresentante,
                },
                necesidad: {
                    idNecesidad: vinculacion.idNecesidad,
                    categoria: vinculacion.necesidadCategoria,
                    subcategoria: vinculacion.necesidadSubcategoria,
                    descripcion: vinculacion.necesidadDescripcion,
                    prioridad: vinculacion.necesidadPrioridad
                },
                apoyo: {
                    idApoyo: vinculacion.idApoyo,
                    categoria: vinculacion.apoyoCategoria,
                    subcategoria: vinculacion.apoyoSubcategoria,
                    descripcion: vinculacion.apoyoDescripcion,
                },
                observacion: vinculacion.observacion
            };
        });

        res.status(200).send(resultado);
    } catch (error) {
        if (error.status === 500 || !error.status) {
            console.error("Error al obtener las vinculaciones:", error);
            return res.status(400).json({
                error: "Fallo al obtener las vinculaciones"
            });
        }
        next(error);
    }
});

participacion.post('/vinculacion/aceptar', async (req, res, next) => {
    try {
        // Match frontend field names
        const { descripcion, fechaFin, etapas, rfc, cct, idApoyo, idNecesidad } = req.body;

        const resultado = await modelo.crearProyecto({
            descripcion,
            fechaFin,
            etapas,
            rfc,
            cct,
            idApoyo,
            idNecesidad
        });
        res.status(201).send(resultado);
    } catch (error) {
        if (error.status === 500 || !error.status) {
            console.error("Error al registrar registrar proyecto:", error);
            return res.status(400).json({
                error: "Fallo en la creacion de proyecto"
            });
        }
        next(error);
    }
});

// Middleware de errores
participacion.use((err, req, res, next) => {
    const estado = err.status || 500;
    res.status(estado).json({ error: err.message });
});

module.exports = participacion;

