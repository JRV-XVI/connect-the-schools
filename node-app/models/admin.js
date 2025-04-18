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

module.exports = { obtenerAdmin, adminId, crearAdmin, eliminarAdminPorId };
