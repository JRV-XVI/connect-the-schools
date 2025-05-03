const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

const mensajeriaPorProyecto = async (id) => {
    const resultado = await db.query('SELECT * FROM "mensajeria" WHERE "idProyecto" = $1', [id]);
    return resultado.rows;
}

module.exports = { mensajeriaPorProyecto }
