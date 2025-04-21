const express = require('express');
const model = require('../models/escuela');
const escuela = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerIdEscuela = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.esceulaId(id);

    if (resultado === 0) {
        const error = new Error(`Escuela con id ${req.params.id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.escuela = resultado[0];
    req.id = id;
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

// Obtener todos las escuelas
escuela.get('/escuela', async (req, res, next) => {
    const resultado = await model.obtenerEscuela();
    res.send(resultado);
});

// Obtener una escuela por su ID
escuela.get('/escuela/:id', obtenerIdEscuela, (req, res, next) => {
    res.send(req.escuela);
});

// Crear una escuela
escuela.post('/escuela', async (req, res, next) => {
    const resultado = await model.crearEscuela(req.query);
    res.send(resultado);
});

// Eliminar una escuela por su ID
escuela.delete('/escuela/:id', eliminarEscuela, (req, res) => {
    res.status(200).json({ 
        mensaje: "Administrador eliminado correctamente", 
        administrador: req.escuelaEliminado 
    });
});

// Actualizar una escuela por su ID (CCT)
escuela.put('/escuela/:id', obtenerIdEscuela, async (req, res, next) => {
    try {
        const resultado = await model.actualizarEscuela(req.params.id, req.query);
        if (!resultado) {
            return res.status(400).json({ mensaje: "No hay campos para actualizar" });
        }
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = escuela;