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


async function crearEscuela(data) {
    const {
        email,
        password,
        phone,
        schoolName,
        direction,
        educationalLevel,
        sector,
        numberStudents,
        nameDirector,
        phoneRepresentative,
        cct,
        userType
    } = data;

    const estadoCuenta = true; // Pendiente
    const fechaCreacion = new Date();

    // Insertar en Usuario
    const idUsuario = await db.query(`INSERT INTO Usuario (correo, contraseña, "tipoPerfil", "estadoCuenta", "fechaCreacion", telefono, nombre, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "idUsuario"`, [
        email,
        password,
        userType,
        estadoCuenta,
        fechaCreacion,
        phone,
        schoolName,
        direction
    ]);
    var id = idUsuario.rows[0].idUsuario;

    await db.query(`INSERT INTO "perfilEscuela" ("idUsuario", cct, "nivelEducativo", sector, "numeroEstudiantes", "nombreDirector", "telefonoDirector") VALUES ($1 , $2, $3, $4, $5, $6, $7)`, [
        id,
        cct,
        educationalLevel,
        sector,
        numberStudents,
        nameDirector,
        phoneRepresentative

    ]);

    return id;
}

const eliminarEscuelaPorId = async (cct) => {
    const resultado = await db.query('DELETE FROM "perfilEscuela" WHERE "cct" = $1 RETURNING *', [cct]);
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

module.exports = { obtenerEscuela, esceulaId, crearEscuela, eliminarEscuelaPorId, actualizarEscuela, obtenerUbicacionesAliados};
