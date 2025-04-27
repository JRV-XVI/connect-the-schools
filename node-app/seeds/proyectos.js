/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Eliminamos registros existentes
  await knex('mensajeria').del();
  await knex('participacionProyecto').del();
  await knex('proyecto').del();

  // 1. Crear 3 proyectos
  const proyectos = await knex('proyecto').insert([
    {
      idProyecto: 1,
      descripcion: 'Remodelación de baños y mejora de infraestructura básica',
      validacionAdmin: true,
      fechaCreacion: knex.fn.now()
    },
    {
      idProyecto: 2,
      descripcion: 'Equipamiento tecnológico para aula de informática',
      validacionAdmin: true,
      fechaCreacion: knex.fn.now()
    },
    {
      idProyecto: 3,
      descripcion: 'Programa de formación docente en tecnologías educativas',
      validacionAdmin: true,
      fechaCreacion: knex.fn.now()
    }
  ]).returning('idProyecto');

  // 2. Obtener IDs de necesidades y apoyos para vincular
  const necesidadesAliados = await knex('necesidadApoyo')
    .whereIn('idUsuario', [2, 6, 7])
    .orderBy('idNecesidadApoyo');

  const necesidadesEscuelas = await knex('necesidadApoyo')
    .whereIn('idUsuario', [1, 4, 5])
    .orderBy('idNecesidadApoyo');

  // 3. Crear participaciones en proyecto
  const participaciones = [];

  // 2 donde solo el aliado ha aceptado
  participaciones.push({
    idProyecto: 1,
    cct: "CCT00900D", // Escuela primaria
    rfc: "RFC800207", // Empresa Constructora
    idNecesidad: necesidadesEscuelas[0].idNecesidadApoyo, // Baños
    idApoyo: necesidadesAliados[0].idNecesidadApoyo,      // Baños
    observacion: 'Pendiente confirmación de la escuela para iniciar obras',
    aceptacionAliado: true,
    aceptacionEscuela: false
  });

  participaciones.push({
    idProyecto: 1,
    cct: "CCT12345E", // Escuela secundaria
    rfc: "RFC800207", // Empresa Constructora
    idNecesidad: necesidadesEscuelas[8].idNecesidadApoyo, // Bardas perimetrales
    idApoyo: necesidadesAliados[2].idNecesidadApoyo,      // Bardas perimetrales
    observacion: 'Aliado disponible para iniciar, esperando respuesta de la escuela',
    aceptacionAliado: true,
    aceptacionEscuela: false
  });

  // 3 donde ambos (aliado y escuela) han aceptado - vinculados a proyectos
  participaciones.push({
    idProyecto: 1,
    cct: "CCT67890F", // Preparatoria
    rfc: "RFC800207", // Empresa Constructora
    idNecesidad: necesidadesEscuelas[12].idNecesidadApoyo, // Auditorio
    idApoyo: necesidadesAliados[1].idNecesidadApoyo,       // Canchas deportivas (similar a auditorio)
    observacion: 'Proyecto de remodelación del auditorio en marcha',
    aceptacionAliado: true,
    aceptacionEscuela: true
  });

  participaciones.push({
    idProyecto: 2,
    cct: "CCT12345E", // Escuela secundaria
    rfc: "RFC567890", // Tecnología Educativa
    idNecesidad: necesidadesEscuelas[6].idNecesidadApoyo, // Computadoras
    idApoyo: necesidadesAliados[5].idNecesidadApoyo,      // Computadoras
    observacion: 'Equipamiento tecnológico programado para instalación',
    aceptacionAliado: true,
    aceptacionEscuela: true
  });

  participaciones.push({
    idProyecto: 3,
    cct: "CCT00900D", // Escuela primaria
    rfc: "RFC567890", // Tecnología Educativa
    idNecesidad: necesidadesEscuelas[2].idNecesidadApoyo, // Formación docente
    idApoyo: necesidadesAliados[7].idNecesidadApoyo,      // Formación docente
    observacion: 'Programa de capacitación para 10 docentes iniciado',
    aceptacionAliado: true,
    aceptacionEscuela: true
  });

  // 6 participaciones adicionales con diferentes estados de aceptación
  participaciones.push({
    idProyecto: null, // Sin proyecto asignado aún
    cct: "CCT00900D", // Escuela primaria
    rfc: "RFC123456", // Fundación Educativa
    idNecesidad: necesidadesEscuelas[3].idNecesidadApoyo, // Libros
    idApoyo: necesidadesAliados[10].idNecesidadApoyo,     // Libros
    observacion: 'En evaluación por ambas partes',
    aceptacionAliado: false,
    aceptacionEscuela: false
  });

  participaciones.push({
    idProyecto: null,
    cct: "CCT00900D", // Escuela primaria
    rfc: "RFC123456", // Fundación Educativa
    idNecesidad: necesidadesEscuelas[4].idNecesidadApoyo, // Desayunos
    idApoyo: necesidadesAliados[12].idNecesidadApoyo,     // Desayunos
    observacion: 'Escuela interesada, esperando respuesta del aliado',
    aceptacionAliado: false,
    aceptacionEscuela: true
  });

  participaciones.push({
    idProyecto: null,
    cct: "CCT12345E", // Escuela secundaria
    rfc: "RFC123456", // Fundación Educativa
    idNecesidad: necesidadesEscuelas[7].idNecesidadApoyo, // Inclusión educativa
    idApoyo: necesidadesAliados[11].idNecesidadApoyo,     // Inclusión educativa
    observacion: 'Escuela ha confirmado interés',
    aceptacionAliado: false,
    aceptacionEscuela: true
  });

  participaciones.push({
    idProyecto: null,
    cct: "CCT67890F", // Preparatoria
    rfc: "RFC123456", // Fundación Educativa
    idNecesidad: necesidadesEscuelas[13].idNecesidadApoyo, // Orientación vocacional
    idApoyo: necesidadesAliados[14].idNecesidadApoyo,      // Orientación vocacional
    observacion: 'Programa de mentorías en evaluación',
    aceptacionAliado: false,
    aceptacionEscuela: true
  });

  participaciones.push({
    idProyecto: null,
    cct: "CCT67890F", // Preparatoria
    rfc: "RFC567890", // Tecnología Educativa
    idNecesidad: necesidadesEscuelas[11].idNecesidadApoyo, // Software especializado
    idApoyo: necesidadesAliados[6].idNecesidadApoyo,       // Software especializado
    observacion: 'Escuela evaluando propuesta de aliado',
    aceptacionAliado: false,
    aceptacionEscuela: true
  });

  participaciones.push({
    idProyecto: null,
    cct: "CCT00900D", // Escuela primaria
    rfc: "RFC800207", // Empresa Constructora
    idNecesidad: necesidadesEscuelas[1].idNecesidadApoyo, // Mesabancos
    idApoyo: necesidadesAliados[4].idNecesidadApoyo,      // Mesabancos
    observacion: 'Aliado esperando confirmación de la escuela',
    aceptacionAliado: true,
    aceptacionEscuela: false
  });

  // Insertar todas las participaciones
  await knex('participacionProyecto').insert(participaciones);

  // Crear mensajerías para los proyectos
  await knex('mensajeria').insert([
    { idProyecto: 1 },
    { idProyecto: 2 },
    { idProyecto: 3 }
  ]);

  console.log('Se insertaron 3 proyectos, 11 participaciones y 3 mensajerías');
};