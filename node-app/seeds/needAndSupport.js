/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('necesidadApoyo').del()
  await knex('necesidadApoyo').insert([
    // Necesidades del perfil ESCUELA (idUsuario: 1) - CON prioridad
    {
      idUsuario: 1,
      categoria: 'Formación docente',
      subcategoria: 'Alimentación saludable',
      descripcion: 'Necesitamos capacitación sobre alimentación saludable.',
      prioridad: '5',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },
    {
      idUsuario: 1,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Inteligencia emocional',
      descripcion: 'Taller para desarrollar inteligencia emocional en estudiantes.',
      prioridad: '3',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2,  // **Cambio realizado aquí**
    },
    {
      idUsuario: 1,
      categoria: 'Infraestructura',
      subcategoria: 'Baños',
      descripcion: 'Reparación de baños en la escuela.',
      prioridad: '7',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },
    {
      idUsuario: 1,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para niños/mesabancos',
      descripcion: 'Compra de mesas y mesabancos para alumnos.',
      prioridad: '2',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2,  // **Cambio realizado aquí**
    },
    {
      idUsuario: 1,
      categoria: 'Formación a familias',
      subcategoria: 'Crianza positiva',
      descripcion: 'Taller para padres sobre crianza positiva.',
      prioridad: '9',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },

    // Necesidades del perfil ALIADO (idUsuario: 2) - SIN prioridad
    {
      idUsuario: 2,
      categoria: 'Formación docente',
      subcategoria: 'Alimentación saludable',
      descripcion: 'Ofrecemos apoyo en talleres de alimentación saludable.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },
    {
      idUsuario: 2,
      categoria: 'Formación niñas y niños',
      subcategoria: 'Inteligencia emocional',
      descripcion: 'Ofrecemos talleres de inteligencia emocional.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },
    {
      idUsuario: 2,
      categoria: 'Infraestructura',
      subcategoria: 'Baños',
      descripcion: 'Ofrecemos servicio de reparación de baños.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },
    {
      idUsuario: 2,
      categoria: 'Mobiliario',
      subcategoria: 'Mesas para niños/mesabancos',
      descripcion: 'Ofrecemos donación de mesabancos.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 2,  // **Cambio realizado aquí**
    },
    {
      idUsuario: 2,
      categoria: 'Formación a familias',
      subcategoria: 'Crianza positiva',
      descripcion: 'Ofrecemos talleres de crianza positiva para padres.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },

    // Dos necesidades extra (puedes mover o quitar si quieres exactos 10)
    {
      idUsuario: 1,
      categoria: 'Alimentación',
      subcategoria: 'Desayunos',
      descripcion: 'Apoyo para brindar desayunos escolares.',
      prioridad: '6',
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    },
    {
      idUsuario: 2,
      categoria: 'Transporte',
      subcategoria: 'Transporte',
      descripcion: 'Ofrecemos transporte escolar gratuito.',
      prioridad: null,
      fechaCreacion: knex.fn.now(),
      estadoValidacion: 3,  // Sin cambios
    }
  ]);
};
