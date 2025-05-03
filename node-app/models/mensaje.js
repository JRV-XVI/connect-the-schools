const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const obtenerMensaje = async () => {
    const resultado = await db.query('SELECT * FROM "mensaje"');
    return resultado.rows;
}

const mensajePorId = async (id) => {
    const resultado = await db.query('SELECT * FROM "mensaje" WHERE "idMensaje" = $1', [id]);
    return resultado.rows;
}

const mensajePorUsuario = async (id) => {
    const resultado = await db.query('SELECT * FROM "mensaje" WHERE "idUsuario" = $1', [id]);
    return resultado.rows;
}

const mensajePorMensajeria = async (id) => {
    const resultado = await db.query(`
        SELECT m.*, u."tipoPerfil", u."nombre" as "nombreRemitente"
        FROM "mensaje" m
        JOIN "usuario" u ON m."idUsuario" = u."idUsuario"
        WHERE m."idMensajeria" = $1
        ORDER BY m."fechaEnvio" ASC
    `, [id]);
    return resultado.rows;
}

const crearMensaje = async (params) => {
    const resultado = await db.query('INSERT INTO "mensaje" ("idMensajeria", "idUsuario", "contenido", "leido") VALUES ($1, $2, $3, $4) RETURNING *',
        [
            params.idMensajeria,
            params.idUsuario,
            params.contenido,
            params.leido || false
        ]);
    return resultado.rows[0];
}

module.exports = { mensajePorMensajeria, crearMensaje }
