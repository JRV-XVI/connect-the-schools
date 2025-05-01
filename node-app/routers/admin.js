const express = require('express');
const model = require('../models/admin.js');
const admin = express.Router();
const { obtenerUbicacionesEscuelas } = require('../models/escuela.js');
const { obtenerUbicacionesAliados } = require('../models/aliado.js');

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerIdAdmin = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
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
    try {
        const resultado = await model.crearAdmin(req.query);
        res.status(201).send(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener todos los administradores
admin.get('/admin', async (req, res, next) => {
    try {
        const resultado = await model.obtenerAdmin();
        res.status(200).send(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener un administrador por su ID
admin.get('/admin/:idPerfilAdmin', obtenerIdAdmin, (req, res) => {
    res.status(200).send(req.admin);
});

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

// Actualizar datos de administrador por ID
admin.put('/admin/:idPerfilAdmin', obtenerIdAdmin, async (req, res, next) => {
    try {
        const resultado = await model.actualizarAdmin(req.id, req.query);
        if (!resultado) {
            return res.status(400).json({ error: "No hay campos para actualizar" });
        }
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Eliminar un administrador por su ID
admin.delete('/admin/:idPerfilAdmin', obtenerIdAdmin, async (req, res, next) => {
    try {
        const resultado = await model.eliminarAdmin(req.id);
        res.status(200).json({
            mensaje: "Administrador eliminado correctamente",
            administrador: resultado
        });
    } catch (error) {
        next(error);
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
