/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Eliminar registros existentes
  await knex('necesidadApoyo').del()
  
  // Generar fecha aleatoria en los últimos 30 días
  const randomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date;
  };

  // ===========================================================
  // NECESIDADES DE ESCUELAS (50)
  // ===========================================================
  const necesidades = [
    // Escuela 1 - Usuario 1 (10 necesidades)
    {
      idUsuario: 1,
      categoria: 'Infraestructura',
      subcategoria: 'Baños',
      descripcion: 'Necesitamos reparar 5 baños que tienen problemas de fontanería y renovar los sanitarios.',
      prioridad: '9',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Infraestructura',
      subcategoria: 'Conectividad',
      descripcion: 'Requerimos mejorar la conexión a internet para poder implementar clases digitales.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para niños/mesabancos',
      descripcion: 'Necesitamos 30 mesabancos nuevos para el aula de tercer grado.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Formación docente',
      subcategoria: 'Herramientas digitales para la educación',
      descripcion: 'Necesitamos capacitación para 12 docentes sobre uso de plataformas educativas digitales.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 1,
      categoria: 'Materiales',
      subcategoria: 'Didácticos',
      descripcion: 'Requerimos materiales didácticos para enseñanza de matemáticas en primaria.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Inteligencia emocional',
      descripcion: 'Buscamos talleres de inteligencia emocional para nuestros estudiantes de 4to a 6to grado.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Personal de apoyo',
      subcategoria: 'Psicólogo',
      descripcion: 'Necesitamos un psicólogo que pueda atender a nuestros estudiantes al menos 2 días por semana.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 1,
      categoria: 'Alimentación',
      subcategoria: 'Desayunos',
      descripcion: 'Requerimos apoyo para programa de desayunos para 50 estudiantes en situación vulnerable.',
      prioridad: '9',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Mobiliario',
      subcategoria: 'Pizarrones',
      descripcion: 'Necesitamos 5 pizarrones nuevos para reemplazar los que están deteriorados.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 1,
      categoria: 'Formación a familias',
      subcategoria: 'Crianza positiva',
      descripcion: 'Buscamos talleres para padres sobre crianza positiva y manejo de conductas.',
      prioridad: '4',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },

    // Escuela 2 - Usuario 4 (8 necesidades)
    {
      idUsuario: 4,
      categoria: 'Infraestructura',
      subcategoria: 'Domos y patios',
      descripcion: 'Necesitamos instalar un domo en el patio central para proteger a los estudiantes del sol y la lluvia.',
      prioridad: '9',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Materiales',
      subcategoria: 'Tecnológico',
      descripcion: 'Requerimos 15 tablets para implementar aulas digitales en la secundaria.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Formación docente',
      subcategoria: 'Educación inclusiva',
      descripcion: 'Buscamos capacitación para nuestros 20 docentes sobre estrategias de educación inclusiva.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Personal de apoyo',
      subcategoria: 'Maestro para clases de idiomas',
      descripcion: 'Necesitamos un maestro de inglés que pueda apoyar 10 horas semanales.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Materiales',
      subcategoria: 'De educación física',
      descripcion: 'Requerimos balones, redes y material deportivo para las clases de educación física.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Infraestructura',
      subcategoria: 'Seguridad',
      descripcion: 'Necesitamos reforzar la seguridad perimetral con rejas más altas y puertas de seguridad.',
      prioridad: '9',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Proyecto de vida/Expectativas a futuro',
      descripcion: 'Buscamos talleres de orientación vocacional para estudiantes de tercer grado de secundaria.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Mobiliario',
      subcategoria: 'Sillas',
      descripcion: 'Necesitamos 60 sillas para el auditorio escolar.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },

    // Escuela 3 - Usuario 5 (7 necesidades)
    {
      idUsuario: 5,
      categoria: 'Infraestructura',
      subcategoria: 'Muros, techos o pisos',
      descripcion: 'Necesitamos reparar goteras en 3 aulas que se inundan cuando llueve.',
      prioridad: '9',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Materiales',
      subcategoria: 'Literarios',
      descripcion: 'Requerimos libros técnicos actualizados para nuestra biblioteca especializada.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 5,
      categoria: 'Personal de apoyo',
      subcategoria: 'Persona para apoyo administrativo',
      descripcion: 'Necesitamos apoyo para gestión administrativa y digitalización de archivos, 20 horas semanales.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Formación docente',
      subcategoria: 'Metodologías activas',
      descripcion: 'Buscamos capacitación en metodologías activas y aprendizaje basado en proyectos.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Computación',
      descripcion: 'Requerimos cursos de programación básica para estudiantes de preparatoria.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 5,
      categoria: 'Infraestructura',
      subcategoria: 'Pintura',
      descripcion: 'Necesitamos pintar el exterior del edificio escolar, son aproximadamente 500m² de superficie.',
      prioridad: '4',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Transporte',
      subcategoria: 'Transporte',
      descripcion: 'Buscamos apoyo para transporte escolar para 30 estudiantes que viven en comunidades alejadas.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },

    // Escuela 4 - Usuario 8 (13 necesidades)
    {
      idUsuario: 1,
      categoria: 'Infraestructura',
      subcategoria: 'Adecuaciones para personas con discapacidad',
      descripcion: 'Necesitamos construir rampas de acceso en la entrada principal y baños adaptados.',
      prioridad: '9',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Mobiliario',
      subcategoria: 'Estantes, libreros o cajoneras',
      descripcion: 'Requerimos 10 libreros para organizar el material didáctico en las aulas.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Personal de apoyo',
      subcategoria: 'Maestro para clases de arte',
      descripcion: 'Necesitamos un maestro de arte para impartir clases 2 veces por semana.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Formación docente',
      subcategoria: 'Disciplina positiva',
      descripcion: 'Buscamos taller sobre disciplina positiva para todo nuestro personal docente.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 4,
      categoria: 'Infraestructura',
      subcategoria: 'Agua',
      descripcion: 'Necesitamos reparar el sistema de cisternas y bombas para garantizar agua en toda la escuela.',
      prioridad: '9',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 5,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Arte',
      descripcion: 'Requerimos talleres de arte y expresión plástica para estudiantes de todos los grados.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Formación a familias',
      subcategoria: 'Comunicación efectiva con escuela',
      descripcion: 'Buscamos talleres para mejorar la comunicación entre familias y escuela.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Personal de apoyo',
      subcategoria: 'Terapeuta de lenguaje o comunicación',
      descripcion: 'Necesitamos un terapeuta de lenguaje que apoye a 15 estudiantes con dificultades de comunicación.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 1,
      categoria: 'Jurídico',
      subcategoria: 'Apoyo en gestión de escrituras',
      descripcion: 'Requerimos asesoría legal para regularizar la situación del terreno escolar.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Infraestructura',
      subcategoria: 'Luz',
      descripcion: 'Necesitamos renovar la instalación eléctrica de 6 aulas y la dirección.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Alimentación',
      subcategoria: 'Fórmula',
      descripcion: 'Requerimos complemento alimenticio para programa de nutrición escolar.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Transporte',
      subcategoria: 'Arreglo de camino',
      descripcion: 'Necesitamos apoyo para reparar el camino de acceso a la escuela que se daña en temporada de lluvias.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 5,
      categoria: 'Infraestructura',
      subcategoria: 'Árboles',
      descripcion: 'Buscamos apoyo para plantar 20 árboles y crear áreas verdes en el patio escolar.',
      prioridad: '4',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },

    // Más necesidades distribuidas
    {
      idUsuario: 1,
      categoria: 'Formación docente',
      subcategoria: 'Nueva Escuela Mexicana',
      descripcion: 'Necesitamos capacitación sobre los lineamientos de la Nueva Escuela Mexicana.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Formación a familias',
      subcategoria: 'Atención para hijos con BAP',
      descripcion: 'Requerimos talleres para padres con hijos que presentan barreras para el aprendizaje.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Personal de apoyo',
      subcategoria: 'Psicopedagogo o especialista en BAP',
      descripcion: 'Necesitamos un psicopedagogo que pueda evaluar y dar seguimiento a estudiantes con NEE.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para docentes',
      descripcion: 'Requerimos 10 escritorios para maestros en condiciones óptimas.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Música',
      descripcion: 'Buscamos talleres de música y canto para estudiantes interesados.',
      prioridad: '5',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 5,
      categoria: 'Formación a familias',
      subcategoria: 'Inteligencia emocional',
      descripcion: 'Necesitamos talleres para padres sobre manejo emocional y resolución de conflictos.',
      prioridad: '6',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 5,
      categoria: 'Formación docente',
      subcategoria: 'Neuroeducación',
      descripcion: 'Requerimos capacitación sobre neuroeducación aplicada en el aula.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 1,
      categoria: 'Infraestructura',
      subcategoria: 'Cocina',
      descripcion: 'Necesitamos adecuar el espacio de cocina para el programa de alimentación escolar.',
      prioridad: '8',
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 4,
      categoria: 'Mobiliario',
      subcategoria: 'Comedores',
      descripcion: 'Requerimos mesas y bancas para el comedor escolar, capacidad para 50 estudiantes.',
      prioridad: '7',
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    }
  ];

  // ===========================================================
  // APOYOS DE ALIADOS (50)
  // ===========================================================
  const apoyos = [
    // Aliado 1 - Usuario 2 (15 apoyos)
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Baños',
      descripcion: 'Ofrecemos renovación completa de instalaciones sanitarias para escuelas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Muros, techos o pisos',
      descripcion: 'Brindamos servicio de reparación de techos y control de goteras.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Pintura',
      descripcion: 'Proporcionamos material y mano de obra para pintar instalaciones escolares.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Domos y patios',
      descripcion: 'Instalamos domos de policarbonato para cubrir patios y áreas comunes.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Adecuaciones para personas con discapacidad',
      descripcion: 'Construimos rampas y adecuaciones para garantizar accesibilidad.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para niños/mesabancos',
      descripcion: 'Fabricamos mobiliario escolar durable y de calidad.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Mobiliario',
      subcategoria: 'Pizarrones',
      descripcion: 'Donamos pizarrones blancos y tradicionales para aulas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 2,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Arte',
      descripcion: 'Ofrecemos talleres de expresión artística para estudiantes.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Formación docente',
      subcategoria: 'Liderazgo y habilidades directivas',
      descripcion: 'Brindamos capacitación en liderazgo para personal directivo escolar.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Seguridad',
      descripcion: 'Instalamos sistemas de seguridad perimetral para escuelas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Ventanas y puertas',
      descripcion: 'Reparamos y reemplazamos ventanas y puertas deterioradas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Formación a familias',
      subcategoria: 'Comunicación efectiva con escuela',
      descripcion: 'Ofrecemos talleres para mejorar la comunicación entre padres y escuela.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 2,
      categoria: 'Personal de apoyo',
      subcategoria: 'Persona para apoyo administrativo',
      descripcion: 'Proporcionamos personal capacitado para apoyo administrativo temporal.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Árboles',
      descripcion: 'Donamos árboles y apoyamos en la creación de áreas verdes escolares.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 2,
      categoria: 'Jurídico',
      subcategoria: 'Apoyo en gestión de escrituras',
      descripcion: 'Brindamos asesoría legal para regularización de predios escolares.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    
    // Aliado 2 - Usuario 6 (18 apoyos)
    {
      idUsuario: 6,
      categoria: 'Materiales',
      subcategoria: 'Tecnológico',
      descripcion: 'Donamos equipos de cómputo reacondicionados para uso educativo.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación docente',
      subcategoria: 'Herramientas digitales para la educación',
      descripcion: 'Ofrecemos capacitación en uso de herramientas digitales educativas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Computación',
      descripcion: 'Brindamos talleres de programación y robótica para estudiantes.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 6,
      categoria: 'Infraestructura',
      subcategoria: 'Conectividad',
      descripcion: 'Instalamos y configuramos redes WiFi para centros educativos.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Materiales',
      subcategoria: 'Didácticos',
      descripcion: 'Donamos material educativo digital y recursos interactivos.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación docente',
      subcategoria: 'Metodologías activas',
      descripcion: 'Capacitamos en metodologías educativas innovadoras con tecnología.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación a familias',
      subcategoria: 'Nueva Escuela Mexicana',
      descripcion: 'Ofrecemos talleres para familias sobre el modelo educativo actual.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 6,
      categoria: 'Personal de apoyo',
      subcategoria: 'Maestro para clases de idiomas',
      descripcion: 'Proporcionamos instructores para enseñanza de inglés con tecnología.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Proyecto de vida/Expectativas a futuro',
      descripcion: 'Realizamos talleres vocacionales orientados a carreras tecnológicas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Materiales',
      subcategoria: 'Literarios',
      descripcion: 'Donamos bibliotecas digitales y acceso a plataformas educativas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 6,
      categoria: 'Formación docente',
      subcategoria: 'Evaluación',
      descripcion: 'Capacitamos en sistemas digitales de evaluación y seguimiento.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Mobiliario',
      subcategoria: 'Estantes, libreros o cajoneras',
      descripcion: 'Donamos mobiliario para laboratorios de cómputo escolares.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Lectoescritura',
      descripcion: 'Ofrecemos programas digitales de apoyo para la lectoescritura.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 6,
      categoria: 'Formación a familias',
      subcategoria: 'Inteligencia emocional',
      descripcion: 'Realizamos talleres para padres sobre manejo emocional digital.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación docente',
      subcategoria: 'Comunidades de aprendizaje',
      descripcion: 'Facilitamos la creación de redes docentes virtuales colaborativas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Personal de apoyo',
      subcategoria: 'Psicopedagogo o especialista en BAP',
      descripcion: 'Ofrecemos consultores en tecnologías de apoyo para estudiantes con NEE.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 6,
      categoria: 'Formación docente',
      subcategoria: 'Participación infantil',
      descripcion: 'Capacitamos en estrategias digitales para fomentar la participación.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 6,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Convivencia escolar/Cultura de paz/Valores',
      descripcion: 'Realizamos talleres sobre ciudadanía digital y prevención del ciberacoso.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },

    // Aliado 3 - Usuario 7 (17 apoyos)
    {
      idUsuario: 7,
      categoria: 'Formación docente',
      subcategoria: 'Educación inclusiva',
      descripcion: 'Ofrecemos talleres sobre estrategias para la inclusión educativa.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación a familias',
      subcategoria: 'Crianza positiva',
      descripcion: 'Brindamos talleres para padres sobre crianza positiva y desarrollo infantil.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Materiales',
      subcategoria: 'Didácticos',
      descripcion: 'Donamos materiales didácticos para escuelas en zonas vulnerables.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 7,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Inteligencia emocional',
      descripcion: 'Desarrollamos programas de inteligencia emocional para estudiantes.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Alimentación',
      subcategoria: 'Desayunos',
      descripcion: 'Implementamos programas de apoyo alimentario para escuelas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Personal de apoyo',
      subcategoria: 'Psicólogo',
      descripcion: 'Ofrecemos atención psicológica para comunidades educativas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 7,
      categoria: 'Formación docente',
      subcategoria: 'Convivencia escolar/Cultura de paz/Valores',
      descripcion: 'Capacitamos en mediación escolar y resolución pacífica de conflictos.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Materiales',
      subcategoria: 'Literarios',
      descripcion: 'Donamos acervos de libros para bibliotecas escolares.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Lectoescritura',
      descripcion: 'Desarrollamos programas de fomento a la lectura y escritura.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 7,
      categoria: 'Formación a familias',
      subcategoria: 'Enseñanza de lectura y matemáticas',
      descripcion: 'Ofrecemos talleres para familias sobre apoyo educativo en el hogar.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Personal de apoyo',
      subcategoria: 'Terapeuta de lenguaje o comunicación',
      descripcion: 'Proporcionamos especialistas en lenguaje para apoyo a estudiantes.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación docente',
      subcategoria: 'Enseñanza de lectura y matemáticas',
      descripcion: 'Capacitamos en metodologías innovadoras para enseñanza de lectura.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 7,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para niños/mesabancos',
      descripcion: 'Donamos mobiliario escolar para aulas de educación básica.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Alimentación saludable',
      descripcion: 'Implementamos talleres de nutrición y alimentación saludable.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación a familias',
      subcategoria: 'Derechos y obligaciones de los padres',
      descripcion: 'Ofrecemos orientación sobre derechos educativos y participación.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 2
    },
    {
      idUsuario: 7,
      categoria: 'Transporte',
      subcategoria: 'Transporte',
      descripcion: 'Proporcionamos servicio de transporte para actividades educativas.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    },
    {
      idUsuario: 7,
      categoria: 'Formación docente',
      subcategoria: 'Inteligencia emocional',
      descripcion: 'Capacitamos en estrategias para el desarrollo socioemocional en el aula.',
      prioridad: null,
      fechaCreacion: randomDate(),
      estadoValidacion: 3
    }
  ];

  // Insertar necesidades y apoyos
  await knex('necesidadApoyo').insert([...necesidades, ...apoyos]);
  
  console.log(`Seed completado: Se insertaron ${necesidades.length} necesidades escolares y ${apoyos.length} ofertas de apoyo`);
};