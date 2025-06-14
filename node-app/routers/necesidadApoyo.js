const express = require('express');
const model = require('../models/necesidadApoyo.js');
const necesidadApoyo = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

const obtenerNecesidadPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.idNecesidadApoyo);
        console.log('[INFO] ID recibido:', id);

        if (isNaN(id) || id <= 0) {
            const error = new Error("El formato del ID de necesidad/apoyo no es válido");
            error.status = 400;
            return next(error);
        }

        const resultado = await model.necesidadApoyoPorId(id);
        console.log('[INFO] Resultado de la consulta:', resultado);

        if (!resultado || resultado.length === 0) {
            const error = new Error(`Necesidad/Apoyo con id ${id} no encontrado`);
            error.status = 404;
            return next(error);
        }

        req.necesidadApoyo = resultado[0];
        req.idNecesidadApoyo = id;
        next();
    } catch (error) {
        next(error);
    }
};

const verificarUsuarioExiste = async (req, res, next) => {
    try {
        const idUsuario = Number(req.body?.idUsuario || req.params?.idUsuario);

        if (!idUsuario) {
            return res.status(400).json({
                error: "Se requiere un ID de usuario"
            });
        }

        const usuarioExiste = await model.verificarUsuarioExiste(idUsuario);

        if (!usuarioExiste) {
            return res.status(404).json({
                error: `No se encontró el usuario con id ${idUsuario}`
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const validarCamposObligatorios = (req, res, next) => {
    try {
        const { descripcion, prioridad, idCategoria, idSubcategoria, idUsuario } = req.body;
        const camposFaltantes = [];

        if (!descripcion) camposFaltantes.push('descripcion');
        if (!prioridad) camposFaltantes.push('prioridad');
        if (!idCategoria) camposFaltantes.push('idCategoria');
        if (!idSubcategoria) camposFaltantes.push('idSubcategoria');
        if (!idUsuario) camposFaltantes.push('idUsuario');


        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
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

necesidadApoyo.put('/necesidadApoyo/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const { estadoValidacion } = req.body;
        const data = { id, estadoValidacion }
        const necesidadApoyo = await model.cambiarEstadoValidacion(data);
        res.status(200).send(necesidadApoyo);
    } catch (error) {
        if (error.status === 500 || !error.status) {
            console.error("Error al registrar la vinculacion:", error);
            return res.status(400).json({
                error: "Fallo al momento de actualizar necesidad/apoyo"
            });
        }
        next(error);
    }
});

necesidadApoyo.get('/necesidades', async (req, res, next) => {
    try {
        const resultado = await model.obtenerNecesidades();
        res.status(200).send(resultado);
    } catch (error) {
        next(error);
    }
});

necesidadApoyo.get('/apoyos', async (req, res, next) => {
    try {
        const resultado = await model.obtenerApoyos();
        res.status(200).send(resultado);
    } catch (error) {
        next(error);
    }
});

// Crear necesidad/apoyo (ruta notificación según documentación)
necesidadApoyo.post('/necesidadApoyo', async (req, res, next) => {
    try {
        const resultado = await model.crearNecesidadApoyo(req.body);
        res.status(201).send(resultado);
    } catch (error) {
        console.error('[ERROR] Al crear necesidad de apoyo:', error);
        res.status(500).send({ error: 'Error al crear necesidad de apoyo' });
    }
});
;



// Obtener necesidades/apoyo por Usuario ID
necesidadApoyo.get('/necesidades-escuela/:idUsuario', async (req, res, next) => {
    try {
        const id = Number(req.params.idUsuario);
        console.log('[INFO] ID de usuario recibido:', id);

        const resultado = await model.necesidadApoyoPorUsuario(id);
        console.log('[INFO] Resultado de la consulta:', resultado);

        if (resultado.length === 0) {
            return res.status(404).json({
                error: `No se encontraron necesidades/apoyos para el usuario con id ${id}`
            });
        }

        res.status(200).send(resultado);
    } catch (error) {
        console.error('[ERROR] Error en el controlador:', error.message);
        next(error);
    }
});

// Obtener todas las necesidades/apoyo
necesidadApoyo.get('/necesidadApoyo', async (req, res, next) => {
    try {
        const resultado = await model.obtenerNecesidadApoyo();
        res.status(200).send(resultado);
    } catch (error) {
        next(error);
    }
});


// Eliminar una necesidad/apoyo por su ID
necesidadApoyo.delete('/necesidadApoyo/:idNecesidadApoyo', async (req, res, next) => {
    try {
        const id = Number(req.params.idNecesidadApoyo);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: "El formato del ID no es válido"
            });
        }

        const resultado = await model.eliminarNecesidadApoyo(id);

        if (!resultado) {
            return res.status(404).json({
                error: `Necesidad/Apoyo con id ${id} no encontrado`
            });
        }

        res.status(200).json({
            mensaje: `Necesidad/Apoyo con id ${id} eliminado correctamente`
        });
    } catch (error) {
        next(error);
    }
});

necesidadApoyo.get('/necesidadApoyo/:idNecesidadApoyo', async (req, res, next) => {
    try {
        const id = Number(req.params.idNecesidadApoyo);
        console.log('[INFO] ID recibido:', id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' });
        }

        const resultado = await model.necesidadApoyoPorId(id);
        console.log('[INFO] Resultado de la consulta:', resultado);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({ error: `No se encontró la necesidad de apoyo con ID ${id}` });
        }

        res.status(200).json(resultado[0]);
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

necesidadApoyo.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    const estado = err.status || 500;
    res.status(estado).json({
        error: err.message || "Ocurrió un error al procesar la solicitud"
    });
});

module.exports = necesidadApoyo;
