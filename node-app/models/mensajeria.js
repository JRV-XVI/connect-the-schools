const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const obtenerMensajerias = async () => {
    const resultado = await db.query('SELECT * FROM "mensajeria"');
    return resultado.rows;
}

const mensajeriaPorId = async (id) => {
    const resultado = await db.query('SELECT * FROM "mensajeria" WHERE "idMensajeria" = $1', [id]);
    return resultado.rows;
}

const mensajeriaPorProyecto = async (id) => {
    const resultado = await db.query('SELECT * FROM "mensajeria" WHERE "idProyecto" = $1', [id]);
    return resultado.rows;
}

const crearMensajeria = async (params) => {
    const resultado = await db.query('INSERT INTO "mensajeria" ("idProyecto") VALUES ($1) RETURNING *',
        [params.idProyecto]);
    return resultado.rows[0];
}

const eliminarMensajeriaPorProyecto = async (idProyecto) => {
    const resultado = await db.query('DELETE FROM "mensajeria" WHERE "idProyecto" = $1 RETURNING *', [idProyecto]);
    return resultado.rows;
}

module.exports = { obtenerMensajerias, mensajeriaPorId, mensajeriaPorProyecto, crearMensajeria, eliminarMensajeriaPorProyecto }
