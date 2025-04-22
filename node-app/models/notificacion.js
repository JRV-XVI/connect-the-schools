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
        const { idUsuario, titulo, mensaje, fecha } = params;
        
        const query = `
            INSERT INTO notificaciones ("idUsuario", titulo, mensaje, fecha)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        
        const valores = [
            idUsuario, 
            titulo, 
            mensaje, 
            fecha || new Date().toISOString().split('T')[0]
        ];
        
        const resultado = await db.query(query, valores);
        return resultado.rows[0];
    } catch (error) {
        console.error('Error al crear notificación:', error);
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