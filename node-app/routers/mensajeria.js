const express = require('express');
const model = require('../models/mensajeria');
const mensajeria = express.Router();


// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerMensajeriaPorId = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.mensajeriaPorId(id);
    if (resultado.length === 0) {
        const error = new Error(`Mensajeria con el id ${req.params.id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.mensajeria = resultado[0];
    req.id = id;
    next();
};

const obtenerMensajeriaPorProyecto = async (req, res, next) => {
    const id = Number(req.params.idProyecto);
    const resultado = await model.mensajeriaPorProyecto(id);
    if (resultado.length === 0) {
        const error = new Error(`Mensajerias con el id proyecto ${req.params.idProyecto} no encontradas`);
        error.status = 404;
        return next(error);
    }
    req.mensajerias = resultado;
    next();
};

const eliminarMensajeriaPorProyecto = async (req, res, next) => {
    const id = Number(req.params.idProyecto);
    const resultado = await model.eliminarMensajeriaPorProyecto(id);
      
    if (resultado.length === 0) {
        const error = new Error(`Mensajeria con id proyecto ${id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.mensajeriaEliminado = resultado;
    next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Obtener todas las mensajerias
mensajeria.get('/mensajeria', async (req, res, next) => {
    const resultado = await model.obtenerMensajerias();
    res.send(resultado);
});

// Obtener mensajeria de un proyecto por su ID
mensajeria.get('/mensajeria/proyecto/:idProyecto', obtenerMensajeriaPorProyecto, (req, res) => {
    res.send(req.mensajerias);
});

// Obtener una mensajeria por su ID
mensajeria.get('/mensajeria/:id', obtenerMensajeriaPorId, (req, res) => {
    res.send(req.mensajeria);
});

// Crear una mensajeria ingresando ID de proyecto
mensajeria.post('/mensajeria', async (req, res, next) => {
    try {
        const resultado = await model.crearMensajeria(req.query);
        res.status(201).send(resultado);
    } catch (error) {
        next(error);
    }
});

// Eliminar una mensajeria por su ID de proyecto
mensajeria.delete('/mensajeria/proyecto/:idProyecto', eliminarMensajeriaPorProyecto, (req, res) => {
    res.status(200).json({ 
        mensaje: "Mensajería eliminada correctamente", 
        mensajeria: req.mensajeriaEliminado 
    });
});

module.exports = mensajeria;