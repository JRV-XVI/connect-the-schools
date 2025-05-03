const db = require('../db');

// ------------------------------------------ //
// ----------------- QUERYS ----------------- //
// ------------------------------------------ //

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

const obtenerUbicacionesEscuelas = async () => {
    const query = `
        SELECT 
            u."idUsuario" AS id,
            u."nombre" AS nombre_escuela,
            u."calle",
            u."codigoPostal",
            u."ciudad",
            u."estado"
        FROM "usuario" u
        INNER JOIN "perfilEscuela" pe ON u."idUsuario" = pe."idUsuario"
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
        estado,
        ciudad,
        calle,
        postal,
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
    const idUsuario = await db.query(`INSERT INTO Usuario (correo, contraseña, "tipoPerfil", "estadoCuenta", "fechaCreacion", telefono, nombre, ciudad, estado, calle, "codigoPostal") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "idUsuario"`, [
        email,
        password,
        userType,
        estadoCuenta,
        fechaCreacion,
        phone,
        schoolName,
        ciudad,
        estado,
        calle,
        postal
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

module.exports = { crearEscuela, obtenerUbicacionesAliados, obtenerUbicacionesEscuelas };
