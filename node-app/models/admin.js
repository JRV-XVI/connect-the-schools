const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const obtenerAdmin = async () => {
    const resultado = await db.query('SELECT * FROM "perfilAdmin"');
    return resultado.rows;
}

const adminId = async (id) => {
    const resultado = await db.query('SELECT * FROM "perfilAdmin" WHERE "idPerfilAdmin" = $1', [id]);
    return resultado.rows;
}

const crearAdmin = async (params) => {
    const resultado = await db.query('INSERT INTO "perfilAdmin" ("idUsuario", rol) VALUES ($1, $2) RETURNING *',
        [
            params.idUsuario,
            params.rol,
        ]);
    return resultado.rows[0];
}

const eliminarAdminPorId = async (idUsuario) => {
    const resultado = await db.query('DELETE FROM "perfilAdmin" WHERE "idPerfilAdmin" = $1 RETURNING *', [idUsuario]);
    return resultado.rows[0];
}

const actualizarAdmin = async (id, params) => {
    // Construir query dinámicamente
    const camposActualizables = ['idUsuario', 'rol'];
    const updates = [];
    const values = [id];
    
    let paramIndex = 2;
    
    camposActualizables.forEach(campo => {
        if (params[campo] !== undefined) {
            updates.push(`"${campo}" = $${paramIndex}`);
            values.push(params[campo]);
            paramIndex++;
        }
    });
    
    // Si no hay campos para actualizar, retornar
    if (updates.length === 0) return null;
    
    const query = `UPDATE "perfilAdmin" SET ${updates.join(', ')} WHERE "idPerfilAdmin" = $1 RETURNING *`;
    const resultado = await db.query(query, values);
    return resultado.rows[0];
}

const verificarUsuarioExiste = async (idUsuario) => {
    const resultado = await db.query('SELECT * FROM "usuario" WHERE "idUsuario" = $1', [idUsuario]);
    return resultado.rows.length > 0;
};

const obtenerUbicacionesAliados = async () => {
    const query = `
        SELECT 
            pa."idUsuario" AS id, 
            pa."razonSocial" AS nombre_aliado, 
            pa."latitud", 
            pa."longitud"
        FROM "perfilAliado" pa
        WHERE pa."latitud" IS NOT NULL AND pa."longitud" IS NOT NULL
    `;
    const { rows } = await db.query(query);
    return rows;
};

module.exports = { obtenerAdmin, adminId, crearAdmin, eliminarAdminPorId, actualizarAdmin, verificarUsuarioExiste, obtenerUbicacionesAliados};
