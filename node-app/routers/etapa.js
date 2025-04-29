const express = require('express');
const multer = require('multer');
const modelo = require('../models/etapa.js');
const etapa = express.Router();

// Configuración para cargar archivos
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB límite
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/zip'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('El formato del archivo no es aceptado'), false);
        }
    }
});

const validarEtapa = async (req, res, next) => {
    try {
        const idEtapa = Number(req.params.idEtapa);

        if (isNaN(idEtapa) || idEtapa <= 0) {
            const error = new Error("El formato del id de entrega no es válido");
            error.status = 400;
            return next(error);
        }
        const resultado = await modelo.obtenerEtapa(idEtapa);
        if (resultado.length === 0) {
            const error = new Error(`Entrega con id ${idEtapa} no encontrada`);
            error.status = 404;
            return next(error);
        }

        req.etapa = resultado[0];
        req.idEtapa = idEtapa;
        next();
    } catch (error) {
        next(error);
    }
};

// Obtener archivo de una entrega específica
etapa.get('/archivo/:idEtapa', validarEtapa, async (req, res, next) => {
    try {
        // Si se solicita descarga directa
        if (req.query.download === 'true') {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${req.etapa.tituloEtapa}.pdf"`);
            return res.send(req.entrega.archivo);
        }

        // Si se solicita solo información sobre el archivo
        const respuesta = {
            idEtapa: req.idEtapa,
            tipoContenido: "application/pdf",
            fechaSubida: req.etapa.fechaEntrega,
            urlDescargaDirecta: `/api/archivo/${req.idEtapa}?download=true`
        };

        res.status(200).json(respuesta);
    } catch (error) {
        next(error);
    }
});


// Crear una entrega en una etapa
etapa.put('/archivo/:idEtapa', validarEtapa, upload.single('archivo'), async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("Falta el archivo de entrega");
            error.status = 400;
            return next(error);
        }
        const data = { archivo: req.file.buffer };
        const resultado = await modelo.subirArchivo(req.idEtapa, data);
        const { archivo, ...resto } = resultado[0];
        const respuesta = {
            ...resto,
            archivo: req.file.originalname,
        };
        res.status(200).json(respuesta);
    } catch (error) {
        next(error);
    }
});

module.exports = etapa
