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

// Obtener mensajerías de un proyecto
mensajeria.get(
    '/proyecto/:idProyecto/mensajeria',
    validarIdProyecto,
    obtenerMensajeriaPorProyecto,
    (req, res) => {
        res.status(200).json(req.mensajerias);
    }
);

// Obtener una mensajería por su ID
mensajeria.get(
    '/mensajeria/:id',
    validarId,
    obtenerMensajeriaPorId,
    (req, res) => {
        res.status(200).json(req.mensajeria);
    }
);

// Crear una mensajería (pasando idProyecto en query)
mensajeria.post(
    '/mensajeria',
    validarCamposObligatorios,
    async (req, res, next) => {
        try {
            const datos = {
                idProyecto: Number(req.query.idProyecto),
                ...req.body,
                fechaCreacion: new Date().toISOString()
            };
            const resultado = await model.crearMensajeria(datos);
            res.status(201).json(resultado);
        } catch (error) {
            next(error);
        }
    }
);

// Crear una mensajería dentro de un proyecto (idProyecto en URL)
mensajeria.post(
    '/proyecto/:idProyecto/mensajeria',
    validarIdProyecto,
    async (req, res, next) => {
        try {
            const datos = {
                idProyecto: req.idProyecto,
                ...req.body,
                fechaCreacion: new Date().toISOString()
            };
            const resultado = await model.crearMensajeria(datos);
            res.status(201).json(resultado);
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar mensajerías de un proyecto
mensajeria.delete(
    '/proyecto/:idProyecto/mensajeria',
    validarIdProyecto,
    async (req, res, next) => {
        try {
            const resultado = await model.eliminarMensajeriaPorProyecto(req.idProyecto);
            if (!resultado || resultado.length === 0) {
                const error = new Error(`Mensajería con id de proyecto ${req.idProyecto} no encontrada`);
                error.status = 404;
                return next(error);
            }
            res.status(200).json({
                mensaje: `Mensajería con id de proyecto ${req.idProyecto} eliminada correctamente`,
                mensajerias: resultado
            });
        } catch (error) {
            next(error);
        }
    }
);

// Manejador genérico de errores
mensajeria.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    const estado = err.status || 500;
    res.status(estado).json({
        error: err.message || "Ocurrió un error al procesar la solicitud"
    });
});

module.exports = mensajeria;
