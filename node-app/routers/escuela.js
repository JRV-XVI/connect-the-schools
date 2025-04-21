const express = require('express');
const model = require('../models/escuela');
const escuela = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerIdEscuela = async (req, res, next) => {
    const cct = req.params.cct;
    const resultado = await model.esceulaId(cct);

    if (resultado.length === 0) {
        const error = new Error(`Escuela con CCT ${cct} no encontrada`);
        error.status = 404;
        return next(error);
    }
    req.escuela = resultado[0];
    req.cct = cct;
    next();
};

const eliminarEscuela = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.eliminarEscuelaPorId(id);
      
    if (resultado === 0) {
        const error = new Error(`Escuela con id ${id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.escuelaEliminado = resultado;
    next();
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
    const resultado = await model.obtenerEscuela();
    res.send(resultado);
});

// Obtener una escuela por su ID
escuela.get('/escuela/:cct', obtenerIdEscuela, (req, res, next) => {
    res.send(req.escuela);
});

// Actualizar una escuela por su CCT
escuela.put('/escuela/:cct', obtenerIdEscuela, async (req, res, next) => {
    try {
        const resultado = await model.actualizarEscuela(req.cct, req.query); // Usar req.cct
        if (!resultado) {
            return res.status(400).json({ mensaje: "No hay campos para actualizar" });
        }
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Eliminar una escuela por su ID
escuela.delete('/escuela/:id', eliminarEscuela, (req, res) => {
    res.status(200).json({ 
        mensaje: "Administrador eliminado correctamente", 
        administrador: req.escuelaEliminado 
    });
});


module.exports = escuela;