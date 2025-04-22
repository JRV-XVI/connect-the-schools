const express = require('express');
const model = require('../models/participacion.js');
const modeloE = require('../models/escuela.js');
const modeloA = require('../models/aliado.js');
const modeloP = require('../models/proyectos.js');
const participacion = express.Router();

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

// Verifica si existe una escuela
const verificarEscuelaExiste = async (req, res, next) => {
    try {
        const cct = req.params.cct;
        
        if (!cct) {
            return res.status(400).json({
                error: "Se requiere un CCT de escuela"
            });
        }
        
        const escuelaExiste = await modeloE.esceulaId(cct);
        
        if (!escuelaExiste) {
            return res.status(404).json({
                error: `No se encontró la escuela con CCT: ${cct}`
            });
        }
        
        req.cct = cct;
        next();
    } catch (error) {
        console.error('Error al verificar escuela:', error);
        next(error);
    }
};

// Verifica si existe un aliado
const verificarAliadoExiste = async (req, res, next) => {
    try {
        const rfc = req.params.rfc;
        
        if (!rfc) {
            return res.status(400).json({
                error: "Se requiere un RFC de aliado"
            });
        }
        
        const aliadoExiste = await modeloA.infoAliado(rfc);
        
        if (!aliadoExiste) {
            return res.status(404).json({
                error: `No se encontró el aliado con RFC: ${rfc}`
            });
        }
        
        req.rfc = rfc;
        next();
    } catch (error) {
        console.error('Error al verificar aliado:', error);
        next(error);
    }
};

// Verifica si un proyecto existe
const verificarProyectoExiste = async (req, res, next) => {
    try {
        if (req.body.idProyecto) {
            const idProyecto = Number(req.body.idProyecto);
            
            if (isNaN(idProyecto) || idProyecto <= 0) {
                return res.status(400).json({
                    error: "El formato del ID de proyecto no es válido"
                });
            }
            
            const proyectoExiste = await modeloP.infoProyecto(idProyecto);
            
            if (!proyectoExiste) {
                return res.status(404).json({
                    error: `No se encontró el proyecto con ID: ${idProyecto}`
                });
            }
            
            req.idProyecto = idProyecto;
        }
        next();
    } catch (error) {
        console.error('Error al verificar proyecto:', error);
        next(error);
    }
};

const obtenerParticipacion = async (req, res, next) => {
    try {
        // Importante: asegurarse de que los parámetros están en el orden correcto
        const { rfc, cct } = req.params;
        
        const resultado = await model.obtenerParticipacion(rfc, cct);
        
        if (!resultado) {
            return res.status(404).json({
                error: `No se encontró la participación en proyecto con RFC ${rfc} y CCT ${cct}`
            });
        }
        
        req.participacion = resultado;
        next();
    } catch (error) {
        console.error('Error al obtener participación:', error);
        next(error);
    }
};

// Validar campos para crear participación
const validarCamposParticipacion = (req, res, next) => {
    try {
        // Verificar si hay cuerpo JSON
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "El cuerpo de la solicitud no puede estar vacío"
            });
        }
        
        const { aceptacionEscuela, aceptacionAliado } = req.body;
        const camposFaltantes = [];
        
        if (aceptacionEscuela === undefined) camposFaltantes.push('aceptacionEscuela');
        if (aceptacionAliado === undefined) camposFaltantes.push('aceptacionAliado');
        
        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                error: `Faltan campos obligatorios para la participación: ${camposFaltantes.join(', ')}`
            });
        }
        
        next();
    } catch (error) {
        console.error('Error en validación de campos:', error);
        next(error);
    }
};

// ------------------------------------------- //
// ----------------- ROUTERS ----------------- //
// ------------------------------------------- //

// Crear participación en proyecto
participacion.post('/participacion/:cct/:rfc', 
    verificarEscuelaExiste, 
    verificarAliadoExiste, 
    validarCamposParticipacion,
    verificarProyectoExiste,
    async (req, res, next) => {
        try {
            const { cct, rfc } = req.params;
            const { idProyecto, aceptacionAliado, aceptacionEscuela } = req.body;

            const datos = {
                idProyecto: idProyecto || null,
                cct,
                rfc,
                aceptacionAliado,
                aceptacionEscuela,
                fechaCreacion: new Date().toISOString().split('T')[0]
            };

            const resultado = await model.crearParticipacion(datos);
            res.status(201).json(resultado);
        } catch (error) {
            console.error('Error al crear participación:', error);
            next(error);
        }
    }
);

// Obtener participaciones por proyecto
participacion.get('/proyecto/:idProyecto/participacion', async (req, res, next) => {
    try {
        const idProyecto = Number(req.params.idProyecto);
        
        if (isNaN(idProyecto) || idProyecto <= 0) {
            return res.status(400).json({ 
                error: "El formato del id de proyecto no es válido" 
            });
        }

        const proyectoExiste = await model.verificarProyectoExiste(idProyecto);
        
        if (!proyectoExiste) {
            return res.status(404).json({
                error: `No se encontró el proyecto con id: ${idProyecto}`
            });
        }

        const resultado = await model.obtenerParticipacionesPorProyecto(idProyecto);
        
        if (resultado.length === 0) {
            return res.status(404).json({ 
                error: `No se encontraron participaciones para el proyecto con id ${idProyecto}` 
            });
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener participaciones por proyecto:', error);
        next(error);
    }
});

// Obtener participaciones con idProyecto NULL
participacion.get('/participacion', async (req, res, next) => {
    try {
        const resultado = await model.obtenerParticipacionesSinProyecto();
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener participaciones sin proyecto:', error);
        next(error);
    }
});

// Obtener participación por RFC y CCT
participacion.get('/participacion/:rfc/:cct', 
    verificarAliadoExiste,
    verificarEscuelaExiste,
    async (req, res, next) => {
        try {
            const { rfc, cct } = req.params;
            const resultado = await model.obtenerParticipacionPorRfcCct(rfc, cct);
            
            if (!resultado) {
                return res.status(404).json({
                    error: `No se encontró la participación en proyecto con RFC ${rfc} y CCT ${cct}`
                });
            }
            
            // Agregar campo de estado según documentación
            let estado = "Pendiente de firma";
            
            if (resultado.aceptacionAliado && resultado.aceptacionEscuela) {
                estado = "Firmado por ambas partes";
            } else if (resultado.aceptacionAliado) {
                estado = "Firmado por aliado";
            } else if (resultado.aceptacionEscuela) {
                estado = "Firmado por escuela";
            }
            
            res.status(200).json({
                ...resultado,
                estado
            });
        } catch (error) {
            console.error('Error al obtener participación:', error);
            next(error);
        }
    }
);

// Actualizar participación por RFC y CCT
participacion.put('/participacion/:rfc/:cct', 
    verificarAliadoExiste,
    verificarEscuelaExiste,
    verificarProyectoExiste,
    async (req, res, next) => {
        try {
            const { rfc, cct } = req.params;
            
            // Verificar que la participación existe
            const participacionExiste = await model.obtenerParticipacionPorRfcCct(rfc, cct);
            
            if (!participacionExiste) {
                return res.status(404).json({
                    error: `No se encontró la participación en proyecto con RFC ${rfc} y CCT ${cct}`
                });
            }
            
            // Si se está actualizando la aceptación, agregar la fecha
            const fechaActual = new Date().toISOString().split('T')[0];
            const datos = {...req.body};
            
            if (datos.aceptacionEscuela !== undefined && 
                datos.aceptacionEscuela !== participacionExiste.aceptacionEscuela) {
                datos.fechaAceptacionEscuela = fechaActual;
            }
            
            if (datos.aceptacionAliado !== undefined && 
                datos.aceptacionAliado !== participacionExiste.aceptacionAliado) {
                datos.fechaAceptacionAliado = fechaActual;
            }
            
            const resultado = await model.actualizarParticipacion(rfc, cct, datos);
            res.status(200).json(resultado);
        } catch (error) {
            console.error('Error al actualizar participación:', error);
            next(error);
        }
    }
);

/**
 *
 *
 * ERRORES
 *
 * 
**/

// Middleware de manejo de errores generalizado
participacion.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    const estado = err.status || 500;
    res.status(estado).json({ 
        error: err.message || "Ocurrió un error al procesar la solicitud" 
    });
});

module.exports = participacion;