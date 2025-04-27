/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Eliminar registros existentes
  await knex('necesidadApoyo').del()
  
  await knex('necesidadApoyo').insert([
    // ===============================================================
    // ESCUELA 1 (Usuario 1) - Escuela Test - Primaria
    // ===============================================================
    {
      idUsuario: 1,
      categoria: 'Infraestructura',
      subcategoria: 'Baños',
      descripcion: 'Reparación y remodelación de baños para alumnos.',
      prioridad: '9',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para niños/mesabancos',
      descripcion: 'Requerimos 30 mesabancos nuevos para el aula de primer grado.',
      prioridad: '7',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Formación docente',
      subcategoria: 'Uso de tecnología',
      descripcion: 'Capacitación para 10 docentes en uso de herramientas digitales educativas.',
      prioridad: '6',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Material didáctico',
      subcategoria: 'Libros',
      descripcion: 'Necesitamos libros para completar la biblioteca escolar.',
      prioridad: '5',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2
    },
    {
      idUsuario: 1,
      categoria: 'Alimentación',
      subcategoria: 'Desayunos',
      descripcion: 'Requerimos apoyo para programa de desayunos escolares.',
      prioridad: '8',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },

    // ===============================================================
    // ESCUELA 2 (Usuario 4) - Escuela Secundaria
    // ===============================================================
    {
      idUsuario: 4,
      categoria: 'Infraestructura',
      subcategoria: 'Laboratorio',
      descripcion: 'Equipamiento completo para laboratorio de ciencias.',
      prioridad: '9',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Tecnología',
      subcategoria: 'Computadoras',
      descripcion: 'Necesitamos 15 computadoras para sala de informática.',
      prioridad: '8',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Formación docente',
      subcategoria: 'Inclusión educativa',
      descripcion: 'Capacitación para personal sobre atención a estudiantes con necesidades especiales.',
      prioridad: '7',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Infraestructura',
      subcategoria: 'Canchas deportivas',
      descripcion: 'Remodelación de cancha de basquetbol y equipamiento deportivo.',
      prioridad: '6',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Seguridad',
      subcategoria: 'Bardas perimetrales',
      descripcion: 'Reparación del muro perimetral en la zona norte de la escuela.',
      prioridad: '9',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },

    // ===============================================================
    // ESCUELA 3 (Usuario 5) - Preparatoria Técnica
    // ===============================================================
    {
      idUsuario: 5,
      categoria: 'Talleres',
      subcategoria: 'Equipo para talleres',
      descripcion: 'Herramientas y materiales para taller de electricidad.',
      prioridad: '9',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Tecnología',
      subcategoria: 'Software especializado',
      descripcion: 'Licencias de software de diseño y modelado 3D para laboratorio de cómputo.',
      prioridad: '7',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Infraestructura',
      subcategoria: 'Auditorio',
      descripcion: 'Renovación del equipo de audio y video del auditorio escolar.',
      prioridad: '6',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2
    },
    {
      idUsuario: 5,
      categoria: 'Formación estudiantes',
      subcategoria: 'Orientación vocacional',
      descripcion: 'Programa de vinculación con empresas para prácticas profesionales.',
      prioridad: '8',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Material didáctico',
      subcategoria: 'Equipo laboratorio',
      descripcion: 'Microscopios y material para laboratorio de biología.',
      prioridad: '5',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },

    // ===============================================================
    // ALIADO 1 (Usuario 2) - Aliado Test - Empresa Constructora
    // ===============================================================
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Baños',
      descripcion: 'Ofrecemos servicios de remodelación y reparación de baños escolares.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Canchas deportivas',
      descripcion: 'Construcción y rehabilitación de espacios deportivos.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Seguridad',
      subcategoria: 'Bardas perimetrales',
      descripcion: 'Construcción y reparación de bardas y rejas perimetrales.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Formación estudiantes',
      subcategoria: 'Construcción',
      descripcion: 'Talleres de introducción a oficios de construcción para estudiantes.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2
    },
    {
      idUsuario: 2,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para niños/mesabancos',
      descripcion: 'Donación de mobiliario escolar fabricado con materiales reciclados.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },

    // ===============================================================
    // ALIADO 2 (Usuario 6) - Empresa Aliada - Tecnología Educativa
    // ===============================================================
    {
      idUsuario: 6,
      categoria: 'Tecnología',
      subcategoria: 'Computadoras',
      descripcion: 'Donación de equipos de cómputo reacondicionados para escuelas.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Tecnología',
      subcategoria: 'Software especializado',
      descripcion: 'Ofrecemos licencias educativas de software de modelado 3D y programación.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación docente',
      subcategoria: 'Uso de tecnología',
      descripcion: 'Talleres para maestros sobre integración de tecnología en el aula.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Infraestructura',
      subcategoria: 'Conectividad',
      descripcion: 'Instalación de infraestructura de red y conectividad a internet.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2
    },
    {
      idUsuario: 6,
      categoria: 'Formación estudiantes',
      subcategoria: 'Programación',
      descripcion: 'Cursos de introducción a la programación para estudiantes.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },

    // ===============================================================
    // ALIADO 3 (Usuario 7) - Fundación Educativa
    // ===============================================================
    {
      idUsuario: 7,
      categoria: 'Material didáctico',
      subcategoria: 'Libros',
      descripcion: 'Dotación de acervos bibliográficos para bibliotecas escolares.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación docente',
      subcategoria: 'Inclusión educativa',
      descripcion: 'Talleres sobre educación inclusiva y atención a la diversidad.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Alimentación',
      subcategoria: 'Desayunos',
      descripcion: 'Programa de apoyo alimentario para escuelas en zonas vulnerables.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación a familias',
      subcategoria: 'Crianza positiva',
      descripcion: 'Talleres para padres sobre desarrollo infantil y apoyo educativo.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2
    },
    {
      idUsuario: 7,
      categoria: 'Formación estudiantes',
      subcategoria: 'Orientación vocacional',
      descripcion: 'Programa de mentorías profesionales para estudiantes de preparatoria.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3
    }
  ]);
  
  console.log('Se insertaron datos de necesidades y apoyos para todas las escuelas y aliados');
};