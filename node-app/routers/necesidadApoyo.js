const express = require('express');
const model = require('../models/necesidadApoyo');
const necesidadApoyo = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerIdNecesidadApoyoPorId = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.necesidadApoyoPorId(id);

    if (resultado.length === 0) {
        const error = new Error(`Necesidad/Apoyo con id ${req.params.id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.necesidadApoyo = resultado[0];
    req.id = id;
    next();
};

const obtenerIdNecesidadApoyoPorUsuario = async (req, res, next) => {
    const id = Number(req.params.idUsuario);
    const resultado = await model.necesidadApoyoPorUsuario(id);

    if (resultado.length === 0) {
        const error = new Error(`Necesidad/Apoyo con id Usuario ${req.params.idUsuario} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.necesidadesApoyo = resultado;
    next();
};

const eliminarNecesidadApoyo = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.eliminarNecesidadApoyo(id);
      
    if (!resultado || resultado.length === 0) {
        const error = new Error(`NecesidadApoyo con id ${id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.necesidadApoyoEliminado = resultado;
    next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Obtener todas las necesidades/apoyo
necesidadApoyo.get('/necesidadApoyo', async (req, res, next) => {
    const resultado = await model.obtenerNecesidadApoyo();
    res.send(resultado);
});

// Obtener una necesidad/apoyo por su ID
necesidadApoyo.get('/necesidadApoyo/:id', obtenerIdNecesidadApoyoPorId, (req, res) => {
    res.send(req.necesidadApoyo);
});

// Obtener necesidades/apoyo por Usuario ID
necesidadApoyo.get('/necesidadApoyo/usuario/:idUsuario', obtenerIdNecesidadApoyoPorUsuario, (req, res) => {
    res.send(req.necesidadesApoyo);
});

// Crear una necesidad/apoyo
necesidadApoyo.post('/necesidadApoyo', async (req, res, next) => {
    const resultado = await model.crearNecesidadApoyo(req.query);
    res.send(resultado);
});

// Eliminar una necesidad/apoyo por su ID
necesidadApoyo.delete('/necesidadApoyo/:id', eliminarNecesidadApoyo, (req, res) => {
    res.status(200).json({ 
        mensaje: "Necesidad/Apoyo eliminado correctamente", 
        necesidadApoyo: req.necesidadApoyoEliminado 
    });
});

// Actualizar una necesidad/apoyo por su ID
necesidadApoyo.put('/necesidadApoyo/:id', obtenerIdNecesidadApoyoPorId, async (req, res, next) => {
    try {
        const resultado = await model.actualizarNecesidadApoyo(req.params.id, req.query);
        if (!resultado) {
            return res.status(400).json({ mensaje: "No hay campos para actualizar" });
        }
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = necesidadApoyo;