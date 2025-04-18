const express = require('express');
const model = require('../models/mensaje');
const mensaje = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerMensajePorId = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.mensajePorId(id);
    if (resultado.length === 0) {
        const error = new Error(`Mensajes con el id ${req.params.id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.mensaje = resultado[0];
    req.id = id;
    next();
};

const obtenerMensajesPorUsuario = async (req, res, next) => {
    const id = Number(req.params.idUsuario);
    const resultado = await model.mensajePorUsuario(id);
    if (resultado.length === 0) {
        const error = new Error(`Mensajes con el idUsuario ${req.params.idUsuario} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.mensajes = resultado;
    next();
};


const eliminarMensajePorId = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.eliminarMensajePorId(id);
      
    if (!resultado || resultado.length === 0) {
        const error = new Error(`Mensaje con id ${id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.mensajeEliminado = resultado;
    next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Obtener todos los mensajes
mensaje.get('/mensaje', async (req, res, next) => {
    const resultado = await model.obtenerMensaje();
    res.send(resultado);
});

// Un mensaje por su ID
mensaje.get('/mensaje/:id', obtenerMensajePorId, (req, res) => {
    res.send(req.mensaje);
});

// Todos los mensajes de un usuario por su ID
mensaje.get('/mensajes/usuario/:idUsuario', obtenerMensajesPorUsuario, (req, res) => {
    res.send(req.mensajes);
});

// Crear un mensaje
mensaje.post('/mensaje', async (req, res, next) => {
    const resultado = await model.crearMensaje(req.query);
    res.send(resultado);
});

// Eliminar un mensaje por su ID
mensaje.delete('/mensaje/:id', eliminarMensajePorId, (req, res) => {
    res.status(200).json({ 
        mensaje: "Mensaje eliminada correctamente", 
        mensaee: req.mensajeEliminado 
    });
});

module.exports = mensaje;