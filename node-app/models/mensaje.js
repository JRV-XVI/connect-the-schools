const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const obtenerMensaje = async () => {
    const resultado = await db.query('SELECT * FROM "Mensaje"');
    return resultado.rows;
}

const mensajePorId = async (id) => {
    const resultado = await db.query('SELECT * FROM "Mensaje" WHERE "idMensaje" = $1', [id]);
    return resultado.rows;
}

const mensajePorUsuario = async (id) => {
    const resultado = await db.query('SELECT * FROM "Mensaje" WHERE "idUsuario" = $1', [id]);
    return resultado.rows;
}

const mensajePorMensajeria = async (id) => {
    const resultado = await db.query('SELECT * FROM "Mensaje" WHERE "idMensajeria" = $1', [id]);
    return resultado.rows;
}

const crearMensaje = async (params) => {
    const resultado = await db.query('INSERT INTO "Mensaje" ("idMensajeria", "idUsuario", "contenido", "leido") VALUES ($1, $2, $3, $4) ORDER BY RETURNING *',
        [
            params.idMensajeria,
            params.idUsuario,
            params.contenido,
            params.leido || false
        ]);
    return resultado.rows[0];
}

const eliminarMensajePorId = async (idMensaje) => {
    const resultado = await db.query('DELETE FROM "Mensaje" WHERE "idMensaje" = $1 RETURNING *', [idMensaje]);
    return resultado.rows;
}

module.exports = {obtenerMensaje, mensajePorId, mensajePorUsuario, mensajePorMensajeria, crearMensaje, eliminarMensajePorId}