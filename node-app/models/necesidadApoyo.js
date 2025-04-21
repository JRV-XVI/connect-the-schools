const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const obtenerNecesidadApoyo = async () => {
    const resultado = await db.query('SELECT * FROM "necesidadApoyo"');
    return resultado.rows;
}

const necesidadApoyoPorId = async (id) => {
    const resultado = await db.query('SELECT * FROM "necesidadApoyo" WHERE "idNecesidad" = $1', [id]);
    return resultado.rows;
}

const necesidadApoyoPorUsuario = async (id) => {
    const resultado = await db.query('SELECT * FROM "necesidadApoyo" WHERE "idUsuario" = $1', [id]);
    return resultado.rows;
}

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
    const resultado = await db.query('DELETE FROM "necesidadApoyo" WHERE "idNecesidad" = $1 RETURNING *', [id]);
    return resultado.rows;
}

const actualizarNecesidadApoyo = async (idNecesidad, params) => {
    const camposActualizables = ['descripcion', 'prioridad', 'estadoValidacion'];
    const updates = [];
    const values = [idNecesidad];
    
    let paramIndex = 2;
    
    camposActualizables.forEach(campo => {
        if (params[campo] !== undefined) {
            updates.push(`"${campo}" = $${paramIndex}`);
            values.push(params[campo]);
            paramIndex++;
        }
    });
    
    if (updates.length === 0) return null;
    
    const query = `UPDATE "necesidadApoyo" SET ${updates.join(', ')} WHERE "idNecesidad" = $1 RETURNING *`;
    const resultado = await db.query(query, values);
    return resultado.rows[0];
}


module.exports = {obtenerNecesidadApoyo, necesidadApoyoPorId, necesidadApoyoPorUsuario, crearNecesidadApoyo, eliminarNecesidadApoyo, actualizarNecesidadApoyo}