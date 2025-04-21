const express = require('express');
const model = require('../models/admin.js');
const admin = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerIdAdmin = async (req, res, next) => {
    const id = Number(req.params.id);
    const resultado = await model.adminId(id);

    if (resultado.length === 0) {
        return res.status(404).json({
            error: `Administrador con id ${id} no encontrado`
        });
    }
    req.admin = resultado[0];
    req.id = id;
    next();
};

const verificarUsuarioExiste = async (req, res, next) => {
    try {
        const idUsuario = Number(req.query.idUsuario);
        
        if (!idUsuario) {
            return res.status(400).json({
                error: "Se requiere un ID de usuario"
            });
        }
    
        const usuarioExiste = await model.verificarUsuarioExiste(idUsuario);
        
        if (!usuarioExiste) {
            return res.status(404).json({
                error: `No se encontró el usuario con el id ${idUsuario} especificado`
            });
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Crear un administrador
admin.post('/admin', verificarUsuarioExiste, async (req, res, next) => {
    const resultado = await model.crearAdmin(req.query);
    res.send(resultado);
});

// Obtener todos los administradores
admin.get('/admin', async (req, res, next) => {
    const resultado = await model.obtenerAdmin();
    res.send(resultado);
});

// Obtener un administrador por su ID
admin.get('/admin/:id', obtenerIdAdmin, (req, res, next) => {
    res.send(req.admin);
});

// Actualizar datos de aliado por RFC
admin.put('/admin/:id', obtenerIdAdmin, async (req, res, next) => {
    try {
        const resultado = await model.actualizarAdmin(req.id, req.query);
        if (!resultado) {
            return res.status(400).json({ mensaje: "No hay campos para actualizar" });
        }
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Eliminar un administrador por su ID
admin.delete('/admin/:id', obtenerIdAdmin, (req, res) => {
    res.status(200).json({ 
        mensaje: "Administrador eliminado correctamente", 
        administrador: req.adminEliminado 
    });
});



module.exports = admin;