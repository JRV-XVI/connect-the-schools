const express = require('express');
const admin = express.Router();
const { obtenerUbicacionesEscuelas } = require('../models/escuela.js');
const { obtenerUbicacionesAliados } = require('../models/aliado.js');

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

admin.get('/ubicaciones', async (req, res) => {
    try {
        const escuelas = await obtenerUbicacionesEscuelas();
        console.log('Escuelas:', escuelas); // Debug

        const aliados = await obtenerUbicacionesAliados();
        console.log('Aliados:', aliados); // Debug

        const ubicaciones = [
            ...escuelas.map((escuela) => ({ ...escuela, tipo: 'escuela' })),
            ...aliados.map((aliado) => ({ ...aliado, tipo: 'aliado' }))
        ];

        res.status(200).json(ubicaciones);
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error);
        res.status(500).json({ error: 'Error al obtener ubicaciones' });
    }
});

/**
 *
 *
 * ERRORES
 *
 * 
**/

admin.use((err, req, res, next) => {
    const estado = err.status || 500;
    res.status(estado).json({ error: err.message || "Ocurrió un error al procesar la solicitud" });
});

module.exports = admin;
