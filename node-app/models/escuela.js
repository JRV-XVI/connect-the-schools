const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const obtenerEscuela = async () => {
    const resultado = await db.query('SELECT * FROM "perfilEscuela"');
    return resultado.rows;
}

const esceulaId = async (cct) => {
    const resultado = await db.query('SELECT * FROM "perfilEscuela" WHERE "cct" = $1', [cct]);
    return resultado.rows;
}

const crearEscuela = async (params) => {
    const resultado = await db.query('INSERT INTO "perfilEscuela" (cct, "idUsuario", "nivelEducativo", sector, "numeroEstudiantes", "nombreDirector", "telefonoDirector") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [
            params.cct,
            params.idUsuario,
            params.nivelEducativo,
            params.sector,
            params.numeroEstudiantes,
            params.nombreDirector,
            params.telefonoDirector
        ]);
    return resultado.rows[0];
}

const eliminarEscuelaPorId = async (cct) => {
    const resultado = await db.query('DELETE FROM "perfilEscuela" WHERE "cct" = $1 RETURNING *', [cct]);
    return resultado.rows[0];
}

module.exports = { obtenerEscuela, esceulaId, crearEscuela, eliminarEscuelaPorId };
