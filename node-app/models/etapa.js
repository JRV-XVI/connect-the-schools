const db = require('../db');

const subirArchivo = async (id, data) => {
    const query = 'UPDATE "proyectoEtapas" SET archivo = $2, "fechaEntrega" = $3, "estadoEntrega" = $4 WHERE "idEtapa" = $1 RETURNING *';
    const prompt = [
        id,
        data.archivo,
        new Date().toISOString(),
        true
    ]

    const resultado = await db.query(query, prompt);
    return resultado.rows;
};

const obtenerEtapa = async (id) => {
    const resultado = await db.query('SELECT * FROM "proyectoEtapas" WHERE "idEtapa" = $1', [id]);
    return resultado.rows;
};

module.exports = {
    subirArchivo,
    obtenerEtapa
}
