const express = require('express');
const multer = require('multer');
const modelo = require('../models/proyectos.js');
const proyecto = express.Router();

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

// ---------------------------------------------- //
// ----------------- MIDDLEWARE ----------------- //
// ---------------------------------------------- //

// Middleware para verificar si existe un proyecto
const verificarProyectoExiste = async (req, res, next) => {
	try {
		const idProyecto = Number(req.params.idProyecto);

		if (isNaN(idProyecto) || idProyecto <= 0) {
			const error = new Error("El formato del id de proyecto no es válido");
			error.status = 400;
			return next(error);
		}

		const resultado = await modelo.infoProyecto(idProyecto);

		if (resultado.length === 0) {
			const error = new Error(`Proyecto con id ${idProyecto} no encontrado`);
			error.status = 404;
			return next(error);
		}

		req.proyecto = resultado[0];
		req.idProyecto = idProyecto;
		next();
	} catch (error) {
		next(error);
	}
};

// Middleware para verificar si existe una etapa
const verificarEtapaExiste = async (req, res, next) => {
	try {
		const idEtapa = Number(req.params.idEtapa);

		if (isNaN(idEtapa) || idEtapa <= 0) {
			const error = new Error("El formato del id de etapa no es válido");
			error.status = 400;
			return next(error);
		}

		const resultado = await modelo.infoEtapa(idEtapa);

		if (resultado.length === 0) {
			const error = new Error(`Etapa con id ${idEtapa} no encontrada`);
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

// Middleware para verificar si existe una entrega
const verificarEntregaExiste = async (req, res, next) => {
	try {
		const idEntrega = Number(req.params.idEntrega);

		if (isNaN(idEntrega) || idEntrega <= 0) {
			const error = new Error("El formato del id de entrega no es válido");
			error.status = 400;
			return next(error);
		}

		const resultado = await modelo.infoEntrega(idEntrega);

		if (resultado.length === 0) {
			const error = new Error(`Entrega con id ${idEntrega} no encontrada`);
			error.status = 404;
			return next(error);
		}

		req.entrega = resultado[0];
		req.idEntrega = idEntrega;
		next();
	} catch (error) {
		next(error);
	}
};

// Validar campos obligatorios para crear proyecto
const validarCamposProyecto = (req, res, next) => {
	try {
		const { descripcion } = req.query;

		if (!descripcion) {
			const error = new Error("Faltan los siguientes campos: descripcion");
			error.status = 400;
			return next(error);
		}

		next();
	} catch (error) {
		next(error);
	}
};

// Validar campos obligatorios para crear etapa
const validarCamposEtapa = (req, res, next) => {
	try {
		const { tituloEtapa, descripcionEtapa, orden } = req.query;
		const camposFaltantes = [];

		if (!tituloEtapa) camposFaltantes.push('tituloEtapa');
		if (!descripcionEtapa) camposFaltantes.push('descripcionEtapa');
		if (!orden) camposFaltantes.push('orden');

		if (camposFaltantes.length > 0) {
			const error = new Error(`Faltan los siguientes campos: ${camposFaltantes.join(', ')}`);
			error.status = 400;
			return next(error);
		}

		next();
	} catch (error) {
		next(error);
	}
};

// Validar campos obligatorios para crear entrega
const validarCamposEntrega = (req, res, next) => {
	try {
		const { tituloEntrega, descripcion, estadoEntrega } = req.query;
		const camposFaltantes = [];

		if (!tituloEntrega) camposFaltantes.push('tituloEntrega');
		if (!descripcion) camposFaltantes.push('descripcion');
		if (!estadoEntrega) camposFaltantes.push('estadoEntrega');

		if (camposFaltantes.length > 0) {
			const error = new Error(`Faltan los siguientes campos: ${camposFaltantes.join(', ')}`);
			error.status = 400;
			return next(error);
		}

		next();
	} catch (error) {
		next(error);
	}
};

// ------------------------------------------- //
// ------------ RUTAS DE PROYECTOS ----------- //
// ------------------------------------------- //

// Crear un nuevo proyecto
proyecto.post('/proyecto', validarCamposProyecto, async (req, res, next) => {
	try {
		// Añadir fecha actual si no se proporciona
		const params = {
			...req.query,
			fechaCreacion: new Date().toISOString().split('T')[0]
		};

		const resultado = await modelo.crearProyecto(params);
		const nuevoProyecto = await modelo.infoProyecto(resultado.insertId || 1); // Obtener el proyecto recién creado

		res.status(201).send(resultado);
	} catch (error) {
		next(error);
	}
});

// Obtener todos los proyectos
proyecto.get('/proyecto', async (req, res, next) => {
	try {
		const resultado = await modelo.obtenerProyectos();
		res.status(200).json(resultado);
	} catch (error) {
		next(error);
	}
});

// Obtener un proyecto por ID
proyecto.get('/proyecto/:idProyecto', verificarProyectoExiste, (req, res) => {
	res.status(200).json(req.proyecto);
});

// Actualizar un proyecto
proyecto.put('/proyecto/:idProyecto', verificarProyectoExiste, async (req, res, next) => {
	try {
		if (Object.keys(req.query).length === 0) {
			return res.status(400).json({
				error: "Los datos proporcionados para actualizar el proyecto no son válidos"
			});
		}

		const resultado = await modelo.actualizarProyecto(req.idProyecto, req.query);

		if (!resultado || resultado.affectedRows === 0) {
			return res.status(202).json({
				mensaje: "No se realizaron cambios en el proyecto",
				idProyecto: req.idProyecto
			});
		}

		// Obtener el proyecto actualizado
		const proyectoActualizado = await modelo.infoProyecto(req.idProyecto);

		res.status(200).json({
			...proyectoActualizado[0],
			mensaje: "Proyecto actualizado correctamente"
		});
	} catch (error) {
		next(error);
	}
});

// ------------------------------------------- //
// ------------ RUTAS DE ETAPAS -------------- //
// ------------------------------------------- //

// Crear una etapa en un proyecto
proyecto.post('/proyecto/:idProyecto/etapas', verificarProyectoExiste, validarCamposEtapa, async (req, res, next) => {
	try {
		const resultado = await modelo.crearProyectoEtapa(req.idProyecto, req.query);
		res.status(201).send(resultado);
	} catch (error) {
		next(error);
	}
});

// Obtener todas las etapas de un proyecto
proyecto.get('/proyecto/:idProyecto/etapas', verificarProyectoExiste, async (req, res, next) => {
	try {
		const resultado = await modelo.obtenerProyectoEtapas(req.idProyecto);
		res.status(200).json(resultado);
	} catch (error) {
		next(error);
	}
});

// ------------------------------------------- //
// ------------ RUTAS DE ENTREGAS ------------ //
// ------------------------------------------- //

// Crear una entrega en una etapa
proyecto.post('/proyecto/etapas/:idEtapa/entregas', verificarEtapaExiste, validarCamposEntrega, upload.single('archivo'), async (req, res, next) => {
	try {
		if (!req.file) {
			const error = new Error("Falta el archivo de entrega");
			error.status = 400;
			return next(error);
		}

		const params = {
			...req.query,
			fechaEntrega: req.query.fechaEntrega || new Date(),
			archivo: req.file.buffer
		};

		const resultado = await modelo.crearProyectoEntrega(req.idEtapa, params);
		const { archivo, ...restoResultado } = resultado[0]; // O resultado.rows[0] si es el retorno directo del query

		const respuesta = {
			...restoResultado,
			archivo: req.file.originalname,
		};

		res.status(201).json(respuesta);
	} catch (error) {
		next(error);
	}
});

// Obtener todas las entregas de una etapa
proyecto.get('/proyecto/etapas/:idEtapa/entregas', verificarEtapaExiste, async (req, res, next) => {
	try {
		const resultado = await modelo.obtenerProyectoEntrega(req.idEtapa);
		res.status(200).json(resultado);
	} catch (error) {
		next(error);
	}
});

// Obtener archivo de una entrega específica
proyecto.get('/proyecto/etapas/entregas/:idEntrega/archivo', verificarEntregaExiste, (req, res, next) => {
	try {
		// Si se solicita descarga directa
		if (req.query.download === 'true') {
			res.setHeader('Content-Type', 'application/octet-stream');
			res.setHeader('Content-Disposition', `attachment; filename="${req.entrega.tituloEntrega}.pdf"`);
			return res.send(req.entrega.archivo);
		}

		// Si se solicita solo información sobre el archivo
		const respuesta = {
			idEntrega: req.idEntrega,
			tipoContenido: "application/pdf",
			fechaSubida: req.entrega.fechaEntrega,
			urlDescargaDirecta: `/api/proyecto/etapas/entregas/${req.idEntrega}/archivo?download=true`
		};

		res.status(200).json(respuesta);
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

proyecto.use((err, req, res, next) => {
	const estado = err.status || 500;
	const mensaje = err.status ? err.message : "Ocurrió un error al procesar la solicitud";

	res.status(estado).json({ error: mensaje });
});

module.exports = proyecto;
