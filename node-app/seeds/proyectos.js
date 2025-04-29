/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Eliminamos registros existentes
  await knex('mensajeria').del();
  await knex('participacionProyecto').del();
  await knex('proyecto').del();

  // 2. Obtener IDs de necesidades y apoyos para vincular
  const necesidadesAliados = await knex('necesidadApoyo')
    .whereIn('idUsuario', [2, 6, 7])
    .orderBy('idNecesidadApoyo');

  const necesidadesEscuelas = await knex('necesidadApoyo')
    .whereIn('idUsuario', [1, 4, 5])
    .orderBy('idNecesidadApoyo');

  // 3. Crear proyectos SOLO para participaciones donde ambas partes han aceptado
  const proyectos = [
    {
      descripcion: 'Remodelación del auditorio escolar en Preparatoria',
      validacionAdmin: true,
      fechaCreacion: knex.fn.now(),
      fechaFin: '2025-12-31'
    },
    {
      descripcion: 'Equipamiento tecnológico para aula de informática en Secundaria',
      validacionAdmin: true,
      fechaCreacion: knex.fn.now(),
      fechaFin: '2025-10-15'
    },
    {
      descripcion: 'Programa de formación docente en tecnologías educativas para Primaria',
      validacionAdmin: true,
      fechaCreacion: knex.fn.now(),
      fechaFin: '2025-08-20'
    }
  ];


  const proyectosInsertados = await knex('proyecto').insert(proyectos).returning('idProyecto');

  // 4. Crear participaciones en proyecto
  const participaciones = [
    // GRUPO 1: Participaciones con proyectos (ambas partes aceptaron)
    {
      idProyecto: proyectosInsertados[0].idProyecto,
      cct: "CCT67890F", // Preparatoria
      rfc: "RFC800207", // Empresa Constructora
      idNecesidad: necesidadesEscuelas[12].idNecesidadApoyo, // Auditorio
      idApoyo: necesidadesAliados[1].idNecesidadApoyo,       // Infraestructura
      observacion: 'Proyecto de remodelación del auditorio en marcha',
      aceptacionAliado: true,
      aceptacionEscuela: true
    },
    {
      idProyecto: proyectosInsertados[1].idProyecto,
      cct: "CCT12345E", // Escuela secundaria
      rfc: "RFC567890", // Tecnología Educativa
      idNecesidad: necesidadesEscuelas[6].idNecesidadApoyo, // Computadoras
      idApoyo: necesidadesAliados[5].idNecesidadApoyo,      // Computadoras
      observacion: 'Equipamiento tecnológico programado para instalación',
      aceptacionAliado: true,
      aceptacionEscuela: true
    },
    {
      idProyecto: proyectosInsertados[2].idProyecto,
      cct: "CCT00900D", // Escuela primaria
      rfc: "RFC567890", // Tecnología Educativa
      idNecesidad: necesidadesEscuelas[2].idNecesidadApoyo, // Formación docente
      idApoyo: necesidadesAliados[7].idNecesidadApoyo,      // Formación docente
      observacion: 'Programa de capacitación para 10 docentes iniciado',
      aceptacionAliado: true,
      aceptacionEscuela: true
    },

    // GRUPO 2: Participaciones donde SOLO el aliado ha aceptado (sin proyecto)
    {
      idProyecto: null, // Sin proyecto porque la escuela no ha aceptado
      cct: "CCT00900D", // Escuela primaria
      rfc: "RFC800207", // Empresa Constructora
      idNecesidad: necesidadesEscuelas[0].idNecesidadApoyo, // Baños
      idApoyo: necesidadesAliados[0].idNecesidadApoyo,      // Baños
      observacion: 'Pendiente confirmación de la escuela para iniciar obras',
      aceptacionAliado: true,
      aceptacionEscuela: true
    },
    {
      idProyecto: null, // Sin proyecto porque la escuela no ha aceptado
      cct: "CCT12345E", // Escuela secundaria
      rfc: "RFC800207", // Empresa Constructora
      idNecesidad: necesidadesEscuelas[8].idNecesidadApoyo, // Bardas perimetrales
      idApoyo: necesidadesAliados[2].idNecesidadApoyo,      // Bardas perimetrales
      observacion: 'Aliado disponible para iniciar, esperando respuesta de la escuela',
      aceptacionAliado: true,
      aceptacionEscuela: true
    },
    {
      idProyecto: null, // Sin proyecto porque la escuela no ha aceptado
      cct: "CCT00900D", // Escuela primaria
      rfc: "RFC800207", // Empresa Constructora
      idNecesidad: necesidadesEscuelas[1].idNecesidadApoyo, // Mesabancos
      idApoyo: necesidadesAliados[4].idNecesidadApoyo,      // Mesabancos
      observacion: 'Aliado esperando confirmación de la escuela',
      aceptacionAliado: true,
      aceptacionEscuela: true
    },

    // GRUPO 3: Participaciones donde ninguno ha aceptado aún
    {
      idProyecto: null,
      cct: "CCT00900D", // Escuela primaria
      rfc: "RFC123456", // Fundación Educativa
      idNecesidad: necesidadesEscuelas[3].idNecesidadApoyo, // Libros
      idApoyo: necesidadesAliados[10].idNecesidadApoyo,     // Libros
      observacion: 'En evaluación por ambas partes',
      aceptacionAliado: true,
      aceptacionEscuela: true
    },
    {
      idProyecto: null,
      cct: "CCT12345E", // Escuela secundaria
      rfc: "RFC567890", // Tecnología Educativa
      idNecesidad: necesidadesEscuelas[7].idNecesidadApoyo, // Inclusión educativa
      idApoyo: necesidadesAliados[11].idNecesidadApoyo,     // Inclusión educativa
      observacion: 'Se ha enviado invitación a la escuela',
      aceptacionAliado: true,
      aceptacionEscuela: true
    }
  ];

  // NUEVO: Crear etapas para cada proyecto
  // Proyecto 1: Todas las etapas completadas (100%)
  const etapasProyecto1 = [
    {
      idProyecto: proyectosInsertados[0].idProyecto,
      tituloEtapa: 'Planeación y diseño',
      descripcionEtapa: 'Elaboración de planos y diseño del auditorio renovado',
      estadoEntrega: true,
      orden: 1,
      archivo: Buffer.from('Archivo de planos y diseño', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[0].idProyecto,
      tituloEtapa: 'Demolición de estructuras existentes',
      descripcionEtapa: 'Remoción de butacas, tarima y acabados deteriorados',
      estadoEntrega: true,
      orden: 2,
      archivo: Buffer.from('Reportes de demolición', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[0].idProyecto,
      tituloEtapa: 'Construcción de nuevas estructuras',
      descripcionEtapa: 'Instalación de soportes, tarima y sistema acústico',
      estadoEntrega: true,
      orden: 3,
      archivo: Buffer.from('Documentación de construcción', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[0].idProyecto,
      tituloEtapa: 'Instalación de equipamiento',
      descripcionEtapa: 'Colocación de butacas, sistema de sonido e iluminación',
      estadoEntrega: true,
      orden: 4,
      archivo: Buffer.from('Reporte de instalación', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[0].idProyecto,
      tituloEtapa: 'Pruebas finales',
      descripcionEtapa: 'Verificación de acústica, iluminación y funcionalidad general',
      estadoEntrega: true,
      orden: 5,
      archivo: Buffer.from('Resultados de pruebas', 'utf8')
    }
  ];

  // Proyecto 2: Algunas etapas completadas (60%)
  const etapasProyecto2 = [
    {
      idProyecto: proyectosInsertados[1].idProyecto,
      tituloEtapa: 'Evaluación de necesidades tecnológicas',
      descripcionEtapa: 'Diagnóstico de equipos y software requeridos',
      estadoEntrega: true,
      orden: 1,
      archivo: Buffer.from('Reporte de evaluación', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[1].idProyecto,
      tituloEtapa: 'Adquisición de equipos',
      descripcionEtapa: 'Compra de computadoras, periféricos y accesorios',
      estadoEntrega: true,
      orden: 2,
      archivo: Buffer.from('Facturas de compra', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[1].idProyecto,
      tituloEtapa: 'Instalación de red y cableado',
      descripcionEtapa: 'Configuración de infraestructura de red y conectividad',
      estadoEntrega: true,
      orden: 3,
      archivo: Buffer.from('Diagrama de red implementada', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[1].idProyecto,
      tituloEtapa: 'Configuración de equipos',
      descripcionEtapa: 'Instalación de sistemas operativos y software educativo',
      estadoEntrega: false,
      orden: 4,
      archivo: Buffer.from('Pendiente', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[1].idProyecto,
      tituloEtapa: 'Capacitación a personal',
      descripcionEtapa: 'Talleres para docentes sobre uso del equipamiento',
      estadoEntrega: false,
      orden: 5,
      archivo: Buffer.from('Pendiente', 'utf8')
    }
  ];

  // Proyecto 3: Pocas etapas completadas (40%)
  const etapasProyecto3 = [
    {
      idProyecto: proyectosInsertados[2].idProyecto,
      tituloEtapa: 'Diseño del programa',
      descripcionEtapa: 'Desarrollo de contenidos y metodología de capacitación',
      estadoEntrega: true,
      orden: 1,
      archivo: Buffer.from('Programa formativo', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[2].idProyecto,
      tituloEtapa: 'Selección de materiales',
      descripcionEtapa: 'Definición de recursos didácticos y plataformas tecnológicas',
      estadoEntrega: true,
      orden: 2,
      archivo: Buffer.from('Catálogo de recursos', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[2].idProyecto,
      tituloEtapa: 'Capacitación de capacitadores',
      descripcionEtapa: 'Formación de instructores que impartirán los talleres',
      estadoEntrega: false,
      orden: 3,
      archivo: Buffer.from('Pendiente', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[2].idProyecto,
      tituloEtapa: 'Implementación de talleres',
      descripcionEtapa: 'Desarrollo de sesiones de capacitación para docentes',
      estadoEntrega: false,
      orden: 4,
      archivo: Buffer.from('Pendiente', 'utf8')
    },
    {
      idProyecto: proyectosInsertados[2].idProyecto,
      tituloEtapa: 'Evaluación y seguimiento',
      descripcionEtapa: 'Medición de resultados y acompañamiento continuo',
      estadoEntrega: false,
      orden: 5,
      archivo: Buffer.from('Pendiente', 'utf8')
    }
  ];

  // Insertar todas las etapas
  const todasLasEtapas = [...etapasProyecto1, ...etapasProyecto2, ...etapasProyecto3];
  await knex('proyectoEtapas').insert(todasLasEtapas);

  // Insertar todas las participaciones
  await knex('participacionProyecto').insert(participaciones);

  // Crear mensajerías SOLO para los proyectos existentes
  await knex('mensajeria').insert(
    proyectosInsertados.map(proyecto => ({ idProyecto: proyecto.idProyecto }))
  );

  console.log(`Se insertaron ${proyectosInsertados.length} proyectos, ${participaciones.length} participaciones, ${proyectosInsertados.length} mensajerías y ${todasLasEtapas.length} etapas de proyectos`);
};
