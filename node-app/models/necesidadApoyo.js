const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

// LOS QUE SE USAN

const obtenerNecesidades = async (req, res, next) => {
    const necesidad = await db.query('SELECT * FROM "necesidadApoyo" WHERE prioridad IS NOT NULL')
    return necesidad.rows;
};

const obtenerApoyos = async (req, res, next) => {
    const apoyos = await db.query('SELECT * FROM "necesidadApoyo" WHERE prioridad IS NULL')
    return apoyos.rows;
};

// No se si se usan

const verificarUsuarioExiste = async (idUsuario) => {
    const resultado = await db.query('SELECT 1 FROM "usuario" WHERE "idUsuario" = $1', [idUsuario]);
    return resultado.rowCount > 0; // Devuelve true si el usuario existe, false si no
};

const obtenerNecesidadApoyo = async () => {
    const resultado = await db.query('SELECT * FROM "necesidadApoyo"');
    return resultado.rows;
}

const necesidadApoyoPorId = async (id) => {
    console.log('[INFO] Consultando necesidad/apoyo con ID:', id);
    const resultado = await db.query('SELECT * FROM "necesidadApoyo" WHERE "idNecesidadAPoyo" = $1', [id]);
    console.log('[INFO] Resultado de la consulta SQL:', resultado.rows);
    return resultado.rows;
};

const crearNecesidadApoyo = async (params) => {
    const resultado = await db.query('INSERT INTO "necesidadApoyo" ("idUsuario", "idCategoria", "idSubcategoria", descripcion, prioridad, "fechaCreacion", "estadoValidacion") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [
            params.idUsuario,
            params.idCategoria,
            params.idSubcategoria,
            params.descripcion,
            params.prioridad,
            params.fechaCreacion || new Date(),
            params.estadoValidacion || 0
        ]);
    return resultado.rows[0];
}

const eliminarNecesidadApoyo = async (id) => {
    const resultado = await db.query('DELETE FROM "necesidadApoyo" WHERE "idNecesidadAPoyo" = $1 RETURNING *', [id]);
    return resultado.rows;
}

const actualizarNecesidadApoyo = async (idNecesidadAPoyo, params) => {
    const camposActualizables = ['descripcion', 'prioridad', 'estadoValidacion'];
    const updates = [];
    const values = [idNecesidadAPoyo];

    let paramIndex = 2;

    camposActualizables.forEach(campo => {
        if (params[campo] !== undefined) {
            updates.push(`"${campo}" = $${paramIndex}`);
            values.push(params[campo]);
            paramIndex++;
        }
    });

    if (updates.length === 0) return null;

    const query = `UPDATE "necesidadApoyo" SET ${updates.join(', ')} WHERE "idNecesidadAPoyo" = $1 RETURNING *`;
    const resultado = await db.query(query, values);
    return resultado.rows[0];
}

const necesidadApoyoPorUsuario = async (idUsuario) => {
    const resultado = await db.query('SELECT * FROM "necesidadApoyo" WHERE "idUsuario" = $1', [idUsuario]);
    return resultado.rows;
};


module.exports = {
    obtenerNecesidadApoyo,
    necesidadApoyoPorId,
    necesidadApoyoPorUsuario,
    crearNecesidadApoyo,
    eliminarNecesidadApoyo,
    actualizarNecesidadApoyo,
    verificarUsuarioExiste,
    obtenerNecesidades,
    obtenerApoyos
}
