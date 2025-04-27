const express = require('express');
const modelo = require('../models/participacion.js');
const participacion = express.Router();

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

// Middleware de errores
participacion.use((err, req, res, next) => {
    const estado = err.status || 500;
    res.status(estado).json({ error: err.message });
});

module.exports = participacion;

