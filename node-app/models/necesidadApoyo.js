const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const verificarUsuarioExiste = async (idUsuario) => {
    const resultado = await db.query('SELECT 1 FROM "usuario" WHERE "idUsuario" = $1', [idUsuario]);
    return resultado.rowCount > 0;
};

const obtenerNecesidadApoyo = async () => {
    const resultado = await db.query('SELECT * FROM "necesidadApoyo"');
    return resultado.rows;
};

const necesidadApoyoPorId = async (id) => {
    console.log('[INFO] Consultando necesidad/apoyo con ID:', id);
    const resultado = await db.query(
        'SELECT * FROM "necesidadApoyo" WHERE "idNecesidadApoyo" = $1', // Corregido: "idNecesidadApoyo"
        [id]
    );
    return resultado.rows;
};

const crearNecesidadApoyo = async (params) => {
    const resultado = await db.query(
        'INSERT INTO "necesidadApoyo" ("idUsuario", "categoria", "subcategoria", "descripcion", "prioridad", "fechaCreacion", "estadoValidacion") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', // Comillas en columnas
        [
            params.idUsuario,
            params.categoria,
            params.subcategoria,
            params.descripcion,
            params.prioridad,
            params.fechaCreacion || new Date(),
            params.estadoValidacion || 0
        ]
    );
    return resultado.rows[0];
};

const eliminarNecesidadApoyo = async (id) => {
    const resultado = await db.query(
        'DELETE FROM "necesidadApoyo" WHERE "idNecesidadApoyo" = $1 RETURNING *', // Corregido: "idNecesidadApoyo"
        [id]
    );
    return resultado.rows;
};

const actualizarNecesidadApoyo = async (idNecesidadApoyo, params) => { // Corregido: idNecesidadApoyo
    const camposActualizables = ['descripcion', 'prioridad', 'estadoValidacion'];
    const updates = [];
    const values = [idNecesidadApoyo]; // Nombre corregido

    let paramIndex = 2;

    camposActualizables.forEach(campo => {
        if (params[campo] !== undefined) {
            updates.push(`"${campo}" = $${paramIndex}`);
            values.push(params[campo]);
            paramIndex++;
        }
    });

    if (updates.length === 0) return null;

    const query = `UPDATE "necesidadApoyo" SET ${updates.join(', ')} WHERE "idNecesidadApoyo" = $1 RETURNING *`; // Columna corregida
    const resultado = await db.query(query, values);
    return resultado.rows[0];
};

const necesidadApoyoPorUsuario = async (idUsuario) => { // Corregido: sin coma al final
    try {
        const query = 'SELECT * FROM "necesidadApoyo" WHERE "idUsuario" = $1';
        const resultado = await db.query(query, [idUsuario]);
        return resultado.rows;
    } catch (error) {
        throw error;
    }
}; // Corregido: cierre correcto

module.exports = { 
    obtenerNecesidadApoyo, 
    necesidadApoyoPorId, 
    necesidadApoyoPorUsuario, 
    crearNecesidadApoyo, 
    eliminarNecesidadApoyo, 
    actualizarNecesidadApoyo,
    verificarUsuarioExiste 
};