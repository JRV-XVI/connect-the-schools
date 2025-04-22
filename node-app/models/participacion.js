const db = require('../db');

// Obtener todas las participaciones sin asignación a proyecto
const obtenerParticipacionesSinProyecto = async () => {
    const query = `
        SELECT pp.*, 
               pe."nivelEducativo", pe."nombreDirector",
               pa."razonSocial"
        FROM "participacionEnProyecto" pp
        JOIN "perfilEscuela" pe ON pe."cct" = pp."cct"
        JOIN "perfilAliado" pa ON pa."rfc" = pp."rfc"
        WHERE pp."idProyecto" IS NULL;
    `;
    const resultado = await db.query(query);
    return resultado.rows;
};

// Obtener participaciones por idProyecto
const obtenerParticipacionesPorProyecto = async (idProyecto) => {
    const query = `
        SELECT pp.*, 
               p."descripcion", p."fechaCreacion" as "fechaCreacionProyecto", p."validacionAdmin",
               pe."nivelEducativo", pe."nombreDirector",
               pa."razonSocial"
        FROM "participacionEnProyecto" pp
        JOIN "proyecto" p ON p."idProyecto" = pp."idProyecto"
        JOIN "perfilEscuela" pe ON pe."cct" = pp."cct"
        JOIN "perfilAliado" pa ON pa."rfc" = pp."rfc"
        WHERE pp."idProyecto" = $1;
    `;
    const resultado = await db.query(query, [idProyecto]);
    return resultado.rows;
};

// Obtener una participación por rfc y cct (vinculación)
const obtenerParticipacion = async (rfc, cct) => {
    const query = `
        SELECT pp.*,
               pe."nivelEducativo", pe."sector", pe."numeroEstudiantes",
               pe."nombreDirector", pe."telefonoDirector",
               pa."razonSocial", pa."telefono", pa."correoRepresentante",
               ue."nombre" as "nombreEscuela", ue."correo" as "correoEscuela",
               ua."nombre" as "nombreAliado", ua."correo" as "correoAliado"
        FROM "participacionEnProyecto" pp
        JOIN "perfilEscuela" pe ON pe."cct" = pp."cct"
        JOIN "usuario" ue ON ue."idUsuario" = pe."idUsuario"
        JOIN "perfilAliado" pa ON pa."rfc" = pp."rfc"
        JOIN "usuario" ua ON ua."idUsuario" = pa."idUsuario"
        WHERE pp."cct" = $1 AND pp."rfc" = $2;
    `;
    const resultado = await db.query(query, [cct, rfc]);
    return resultado.rows[0];
};

// Crear nueva participación
const crearParticipacion = async ({ idProyecto = null, cct, rfc, aceptacionAliado, aceptacionEscuela }) => {
    const query = `
        INSERT INTO "participacionEnProyecto" ("idProyecto", "cct", "rfc", "aceptacionAliado", "aceptacionEscuela")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const valores = [idProyecto, cct, rfc, aceptacionAliado, aceptacionEscuela];
    const resultado = await db.query(query, valores);
    return resultado.rows[0];
};

// Actualizar participación por cct y rfc
const actualizarParticipacion = async (rfc, cct, params) => {
    const campos = ['idProyecto', 'aceptacionAliado', 'aceptacionEscuela'];
    const updates = [];
    const values = [rfc, cct];
    let index = 3;

    campos.forEach(campo => {
        if (params[campo] !== undefined) {
            updates.push(`"${campo}" = $${index}`);
            values.push(params[campo]);
            index++;
        }
    });

    if (updates.length === 0) return null;

    const query = `
        UPDATE "participacionEnProyecto"
        SET ${updates.join(', ')}
        WHERE "rfc" = $1 AND "cct" = $2
        RETURNING *;
    `;

    const resultado = await db.query(query, values);
    return resultado.rows[0];
};

module.exports = {
    obtenerParticipacionesSinProyecto,
    obtenerParticipacionesPorProyecto,
    obtenerParticipacion,
    crearParticipacion,
    actualizarParticipacion
};

