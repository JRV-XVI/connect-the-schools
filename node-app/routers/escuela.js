const express = require('express');
const model = require('../models/escuela.js');
const escuela = express.Router();
const { obtenerUbicacionesAliados } = require('../models/escuela.js');

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

escuela.post('/registro/escuela', async (req, res, next) => {
    try {
        const {
            correo: email,          // Match frontend field names
            contrasena: password,
            telefono: phone,
            nombre_escuela: schoolName,
            ciudad,
            estado,
            calle,
            postal,
            nivel_educativo: educationalLevel,
            sector,
            numero_estudiantes: numberStudents,
            nombre_director: nameDirector,
            telefono_director: phoneRepresentative,
            cct,
            tipo_usuario: userType
        } = req.body;

        await model.crearEscuela({
            email,
            password,
            phone,
            schoolName,
            ciudad,
            estado,
            calle,
            postal,
            educationalLevel,
            sector,
            numberStudents,
            nameDirector,
            phoneRepresentative,
            cct,
            userType
        });

        res.status(201).json({
            email,
            password,
            phone,
            schoolName,
            ciudad,
            estado,
            calle,
            postal,
            educationalLevel,
            sector,
            numberStudents,
            nameDirector,
            phoneRepresentative,
            cct,
            userType
        });
    } catch (error) {
        console.error("Error al registrar escuela:", error);
        res.status(400).json({ error: 'Error al registrar escuela' });
    }
});

// Obtener todas las escuelas con ubicaciones
escuela.get('/escuelas/ubicaciones', async (req, res, next) => {
    try {
        const ubicaciones = await model.obtenerUbicacionesEscuelas();
        res.status(200).json(ubicaciones);
    } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
        res.status(500).json({ error: 'Error al obtener ubicaciones de escuelas' });
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
