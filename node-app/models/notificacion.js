const db = require('../db');

/**
 * Obtiene todas las notificaciones de un usuario por su ID
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Array>} - Notificaciones del usuario
 */
const obtenerNotificacionesPorUsuario = async (idUsuario) => {
    try {
        const resultado = await db.query(
            'SELECT * FROM notificaciones WHERE "idUsuario" = $1 ORDER BY fecha DESC',
            [idUsuario]
        );
        return resultado.rows;
    } catch (error) {
        console.error(`Error al obtener notificaciones para usuario ${idUsuario}:`, error);
        throw new Error('Error al consultar la base de datos');
    }
};

/**
 * Crea una nueva notificación
 * @param {Object} params - Parámetros de la notificación
 * @returns {Promise<Object>} - Notificación creada
 */

const crearNotificacion = async (params) => {
    try {
        let { idUsuario, titulo, mensaje, rfc, cct } = params;

        if (cct) {
            const resultado = await db.query(`SELECT "idUsuario" FROM "perfilEscuela" WHERE "cct" = $1`, [cct]);
            if (resultado.rows.length === 0) {
                throw new Error('No se encontró escuela con ese CCT');
            }
            idUsuario = resultado.rows[0].idUsuario;
        } else if (rfc) {
            const resultado = await db.query(`SELECT "idUsuario" FROM "perfilAliado" WHERE "rfc" = $1`, [rfc]);
            if (resultado.rows.length === 0) {
                throw new Error('No se encontró aliado con ese RFC');
            }
            idUsuario = resultado.rows[0].idUsuario;
        }

        if (!idUsuario) {
            throw new Error('Falta idUsuario, RFC o CCT para crear la notificación');
        }

        const query = `
            INSERT INTO notificaciones ("idUsuario", titulo, mensaje)
            VALUES ($1, $2, $3)
            RETURNING *`;

        const valores = [
            idUsuario,
            titulo,
            mensaje,
        ];

        const resultadoInsert = await db.query(query, valores);
        return resultadoInsert.rows[0];
    } catch (error) {
        console.error('Error al crear notificación:', error.message);
        throw new Error('Error al insertar en la base de datos');
    }
};


/**
 * Verifica si un usuario existe
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<boolean>} - True si el usuario existe
 */
const verificarUsuarioExiste = async (idUsuario) => {
    try {
        const resultado = await db.query(
            'SELECT COUNT(*) FROM usuario WHERE "idUsuario" = $1',
            [idUsuario]
        );
        return parseInt(resultado.rows[0].count) > 0;
    } catch (error) {
        console.error(`Error al verificar usuario con id ${idUsuario}:`, error);
        throw new Error('Error al consultar la base de datos');
    }
};

module.exports = {
    obtenerNotificacionesPorUsuario,
    crearNotificacion,
    verificarUsuarioExiste
};
