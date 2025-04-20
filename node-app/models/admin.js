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

const actualizarEscuela = async (cct, params) => {
    // Construir query dinámicamente
    const camposActualizables = ['nivelEducativo', 'sector', 'numeroEstudiantes', 'nombreDirector', 'telefonoDirector'];
    const updates = [];
    const values = [cct]; // El primer parámetro es siempre el cct
    
    let paramIndex = 2; // Empezamos desde $2
    
    camposActualizables.forEach(campo => {
        if (params[campo] !== undefined) {
            updates.push(`"${campo}" = $${paramIndex}`);
            values.push(params[campo]);
            paramIndex++;
        }
    });
    
    // Si no hay campos para actualizar, retornar
    if (updates.length === 0) return null;
    
    const query = `UPDATE "perfilEscuela" SET ${updates.join(', ')} WHERE "cct" = $1 RETURNING *`;
    const resultado = await db.query(query, values);
    return resultado.rows[0];
}

module.exports = { obtenerAdmin, adminId, crearAdmin, eliminarAdminPorId, actualizarEscuela};
