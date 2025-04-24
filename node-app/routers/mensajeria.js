const express = require('express');
const model = require('../models/mensajeria.js');
const mensajeria = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const validarId = (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0) {
            const error = new Error("El formato del ID no es válido");
            error.status = 400;
            return next(error);
        }

        req.id = id;
        next();
    } catch (error) {
        next(error);
    }
};

const validarIdProyecto = (req, res, next) => {
    try {
        const idProyecto = Number(req.params.idProyecto);

        if (isNaN(idProyecto) || idProyecto <= 0) {
            const error = new Error("El formato del ID de proyecto no es válido");
            error.status = 400;
            return next(error);
        }

        req.idProyecto = idProyecto;
        next();
    } catch (error) {
        next(error);
    }
};

const validarCamposObligatorios = (req, res, next) => {
    try {
        const { idProyecto } = req.query;

        if (!idProyecto) {
            return res.status(400).json({
                error: "El campo 'idProyecto' es obligatorio para crear una mensajería"
            });
        }

        const idProyectoNum = Number(idProyecto);
        if (isNaN(idProyectoNum) || idProyectoNum <= 0) {
            return res.status(400).json({
                error: "El formato del ID de proyecto no es válido"
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const obtenerMensajeriaPorId = async (req, res, next) => {
    try {
        const resultado = await model.mensajeriaPorId(req.id);

        if (resultado.length === 0) {
            const error = new Error(`Mensajería con id ${req.id} no encontrada`);
            error.status = 404;
            return next(error);
        }

        req.mensajeria = resultado[0];
        next();
    } catch (error) {
        next(error);
    }
    const id = Number(req.params.idMensajeria);
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
    try {
        const resultado = await model.mensajeriaPorProyecto(req.idProyecto);

        if (resultado.length === 0) {
            const error = new Error(`Mensajerías con id de proyecto ${req.idProyecto} no encontradas`);
            error.status = 404;
            return next(error);
        }

        req.mensajerias = resultado;
        next();
    } catch (error) {
        next(error);
    const id = Number(req.params.idProyecto);
    const resultado = await model.mensajeriaPorProyecto(id);
    if (resultado.length === 0) {
        const error = new Error(`Mensajerias para el proyecto id ${req.params.idProyecto} no encontrada`);
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
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Obtener todas las mensajerías
mensajeria.get('/mensajeria', async (req, res, next) => {
    try {
        const resultado = await model.obtenerMensajerias();
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Obtener mensajería de un proyecto por su ID
mensajeria.get('/proyecto/:idProyecto/mensajeria', validarIdProyecto, obtenerMensajeriaPorProyecto, (req, res) => {
    res.status(200).json(req.mensajerias);
});
/* // Obtener mensajeria de un proyecto por su ID
mensajeria.get('/mensajeria/proyecto/:idProyecto', obtenerMensajeriaPorProyecto, (req, res) => {
    res.send(req.mensajerias);
}); */

// Obtener una mensajería por su ID
mensajeria.get('/mensajeria/:id', validarId, obtenerMensajeriaPorId, (req, res) => {
    res.status(200).json(req.mensajeria);
// Obtener una mensajeria por su ID
mensajeria.get('/mensajeria/:idMensajeria', obtenerMensajeriaPorId, (req, res) => {
    res.send(req.mensajeria);
});

// Crear una mensajería ingresando ID de proyecto
mensajeria.post('/mensajeria', validarCamposObligatorios, async (req, res, next) => {
// Crear una mensajeria por un proyecto
mensajeria.post('/proyecto/:idProyecto/mensajeria', obtenerMensajeriaPorId, async (req, res, next) => {
    try {
        const datos = {
            ...req.query,
            fechaCreacion: new Date().toISOString()
        };

        const resultado = await model.crearMensajeria(datos);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

// Eliminar una mensajería por su ID de proyecto
mensajeria.delete('/proyecto/:idProyecto/mensajeria', validarIdProyecto, async (req, res, next) => {
    try {
        const resultado = await model.eliminarMensajeriaPorProyecto(req.idProyecto);

        if (!resultado || resultado.length === 0) {
            const error = new Error(`Mensajería con id de proyecto ${req.idProyecto} no encontrada`);
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            mensaje: `Mensajería con id de proyecto ${req.idProyecto} eliminada correctamente`,
            mensajeria: resultado
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

mensajeria.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    const estado = err.status || 500;
    res.status(estado).json({
        error: err.message || "Ocurrió un error al procesar la solicitud"
    });
});

module.exports = mensajeria;
