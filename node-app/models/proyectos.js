const db = require('../db');

// ------------------------------------------- //
// ----------------- PROYECTO ---------------- //
// ------------------------------------------- //

// Obtener un proyecto por id
const infoProyecto = async (id) => {
    const resultado = await db.query('SELECT * FROM proyecto WHERE "idProyecto" = $1', [id]);
    return resultado.rows;
};

// Obtener todos los proyecto por idUsuario de Aliado
const obtenerProyectosPorUsuario = async (idUsuario) => {
    // Primero determinar el tipo de usuario
    const usuarioResult = await db.query('SELECT "tipoPerfil" FROM "usuario" WHERE "idUsuario" = $1', [idUsuario]);

    if (usuarioResult.rows.length === 0) {
        return []; // Usuario no encontrado
    }

    const tipoPerfil = usuarioResult.rows[0].tipoPerfil;
    let proyectos = [];

    if (tipoPerfil === 2) { // Aliado
        const resultado = await db.query(`
            SELECT DISTINCT 
                p."idProyecto", 
                p."descripcion", 
                p."validacionAdmin", 
                p."fechaCreacion", 
                p."fechaFin",
                u."nombre" as "nombreEscuela",
                pe."numeroEstudiantes"
            FROM "proyecto" p 
            JOIN "participacionProyecto" pp ON p."idProyecto" = pp."idProyecto" 
            JOIN "perfilAliado" pa ON pp."rfc" = pa."rfc" 
            JOIN "perfilEscuela" pe ON pp."cct" = pe."cct"  -- Unir con perfil escuela
            JOIN "usuario" u ON pe."idUsuario" = u."idUsuario"  -- Unir con usuario para obtener nombre
            WHERE pa."idUsuario" = $1 
            ORDER BY p."fechaCreacion" DESC
        `, [idUsuario]);
        proyectos = resultado.rows;
    }
    else if (tipoPerfil === 1) { // Escuela
        const resultado = await db.query(`
            SELECT DISTINCT 
                p."idProyecto", 
                p."descripcion", 
                p."validacionAdmin", 
                p."fechaCreacion", 
                p."fechaFin",
                COALESCE(u."nombre", 'Aliado sin nombre') as "nombreAliado",
                pe."numeroEstudiantes"
            FROM "proyecto" p 
            JOIN "participacionProyecto" pp ON p."idProyecto" = pp."idProyecto" 
            JOIN "perfilEscuela" pe ON pp."cct" = pe."cct" 
            JOIN "perfilAliado" pa ON pp."rfc" = pa."rfc"
            LEFT JOIN "usuario" u ON pa."idUsuario" = u."idUsuario"
            WHERE pe."idUsuario" = $1 
            ORDER BY p."fechaCreacion" DESC
        `, [idUsuario]);
        proyectos = resultado.rows;
    }
    else if (tipoPerfil === 3) { // Admin
        // Administrador puede ver todos los proyectos
        const resultado = await db.query(`
            SELECT DISTINCT 
                p."idProyecto", 
                p."descripcion", 
                p."validacionAdmin", 
                p."fechaCreacion", 
                p."fechaFin",
                ue."nombre" as "nombreEscuela",
                ua."nombre" as "nombreAliado",
                pe."numeroEstudiantes",
                pp."cct",
                pp."rfc"
            FROM "proyecto" p 
            LEFT JOIN "participacionProyecto" pp ON p."idProyecto" = pp."idProyecto" 
            LEFT JOIN "perfilEscuela" pe ON pp."cct" = pe."cct"
            LEFT JOIN "perfilAliado" pa ON pp."rfc" = pa."rfc"
            LEFT JOIN "usuario" ue ON pe."idUsuario" = ue."idUsuario"
            LEFT JOIN "usuario" ua ON pa."idUsuario" = ua."idUsuario"
            ORDER BY p."fechaCreacion" DESC
        `);
        proyectos = resultado.rows;
    }
    // Calcular el progreso para cada proyecto
    for (let i = 0; i < proyectos.length; i++) {
        const progreso = await progresoProyectoEtapas(proyectos[i].idProyecto);
        proyectos[i].progreso = progreso.porcentaje;
        proyectos[i].etapasCompletadas = progreso.etapasCompletadas;
        proyectos[i].totalEtapas = progreso.totalEtapas;
    }

    return proyectos;
};

// Obtener porcentaje de progreso de etapas por idProyecto
const progresoProyectoEtapas = async (idProyecto) => {
    const resultado = await db.query(`
        SELECT 
            COUNT(*) as total_etapas,
            SUM(CASE WHEN "estadoEntrega" = true THEN 1 ELSE 0 END) as etapas_completadas
        FROM "proyectoEtapas"
        WHERE "idProyecto" = $1
    `, [idProyecto]);

    const { total_etapas, etapas_completadas } = resultado.rows[0];

    // Evitar división por cero
    if (parseInt(total_etapas) === 0) {
        return {
            totalEtapas: 0,
            etapasCompletadas: 0,
            porcentaje: 0
        };
    }

    const porcentaje = Math.round((parseInt(etapas_completadas) * 100) / parseInt(total_etapas));

    return {
        totalEtapas: parseInt(total_etapas),
        etapasCompletadas: parseInt(etapas_completadas),
        porcentaje: porcentaje
    };
};

// ------------------------------------------- //
// ----------------- ETAPAS ------------------ //
// ------------------------------------------- //

// Obtener las etapas de un proyecto
const obtenerProyectoEtapas = async (idProyecto) => {
    const resultado = await db.query('SELECT * FROM "proyectoEtapas" WHERE "idProyecto" = $1', [idProyecto]);
    return resultado.rows;
};

module.exports = { obtenerProyectoEtapas, obtenerProyectosPorUsuario, infoProyecto };
