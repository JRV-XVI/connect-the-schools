const express = require('express');
const model = require('../models/admin.js');
const admin = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerIdAdmin = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.adminId(id);

    if (resultado === 0) {
        const error = new Error(`Administrador con id ${req.params.id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.admin = resultado[0];
    req.id = id;
    next();
};

const eliminarAdmin = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.eliminarAdminPorId(id);
      
    if (resultado === 0) {
        const error = new Error(`Administrador con id ${id} no encontrado`);
        error.status = 404;
        return next(error);
    }
    req.adminEliminado = resultado;
    next();
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Obtener todos los administradores
admin.get('/admin', async (req, res, next) => {
    const resultado = await model.obtenerAdmin();
    res.send(resultado);
});

// Obtener un administrador por su ID
admin.get('/admin/:id', obtenerIdAdmin, (req, res, next) => {
    res.send(req.admin);
});

// Crear un administrador
admin.post('/admin', async (req, res, next) => {
    const resultado = await model.crearAdmin(req.query);
    res.send(resultado);
});

// Eliminar un administrador por su ID
admin.delete('/admin/:id', eliminarAdmin, (req, res) => {
    res.status(200).json({ 
        mensaje: "Administrador eliminado correctamente", 
        administrador: req.adminEliminado 
    });
});

module.exports = admin;