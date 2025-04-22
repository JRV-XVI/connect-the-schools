export const escuelasData = [
  {
    id: 1,
    nombre: "Esc. Prim. Vicente Guerrero",
    nivelEducativo: "Primaria",
    ubicacion: "Guadalajara, Jalisco",
    matricula: 320,
    turno: "Matutino y Vespertino",
    necesidades: [
      { id: "n1-1", nombre: "Rehabilitación de techos", color: "danger", descripcion: "Los techos del edificio principal necesitan reparación urgente debido a filtraciones y deterioro." },
      { id: "n1-2", nombre: "Material didáctico", color: "warning", descripcion: "Se requieren libros y material didáctico actualizado para las asignaturas de español y matemáticas." },
      { id: "n1-3", nombre: "Equipamiento deportivo", color: "info", descripcion: "La escuela necesita balones, redes y equipo básico para educación física." }
    ],
    compatibilidad: "total",
    director: "Mtro. Carlos Fuentes",
    telefono: "33-1234-5678",
    email: "vicente.guerrero@escuelas.edu.mx"
  },
  {
    id: 2,
    nombre: "Esc. Sec. Técnica #58",
    nivelEducativo: "Secundaria",
    ubicacion: "Zapopan, Jalisco",
    matricula: 485,
    turno: "Matutino",
    necesidades: [
      { id: "n2-1", nombre: "Equipos de cómputo", color: "danger", descripcion: "El laboratorio de cómputo requiere actualización urgente, se necesitan 20 computadoras." },
      { id: "n2-2", nombre: "Formación docente", color: "warning", descripcion: "Se necesita capacitación para profesores en nuevas tecnologías educativas." }
    ],
    compatibilidad: "total",
    director: "Dra. Margarita Valdez",
    telefono: "33-2345-6789", 
    email: "secundaria58@escuelas.edu.mx"
  },
  {
    id: 3,
    nombre: "Jardín de Niños 'Rosaura Zapata'",
    nivelEducativo: "Preescolar",
    ubicacion: "Tlaquepaque, Jalisco",
    matricula: 120,
    turno: "Matutino",
    necesidades: [
      { id: "n3-1", nombre: "Área de juegos", color: "danger", descripcion: "El área de juegos está deteriorada y requiere renovación para garantizar la seguridad de los niños." },
      { id: "n3-2", nombre: "Material didáctico", color: "warning", descripcion: "Se necesitan materiales Montessori y juegos educativos para estimulación temprana." }
    ],
    compatibilidad: "parcial",
    director: "Lic. Patricia Mendoza",
    telefono: "33-3456-7890",
    email: "rosaura.zapata@escuelas.edu.mx"
  },
  {
    id: 4,
    nombre: "Esc. Prim. Benito Juárez",
    nivelEducativo: "Primaria",
    ubicacion: "Tonalá, Jalisco",
    matricula: 250,
    turno: "Matutino",
    necesidades: [
      { id: "n4-1", nombre: "Biblioteca escolar", color: "warning", descripcion: "Se requiere equipar la biblioteca con libros actualizados y mobiliario adecuado." },
      { id: "n4-2", nombre: "Pintura de aulas", color: "success", descripcion: "Las aulas necesitan mantenimiento de pintura en paredes y techos." }
    ],
    compatibilidad: "total",
    director: "Mtro. Fernando Gutiérrez",
    telefono: "33-4567-8901",
    email: "benito.juarez@escuelas.edu.mx"
  },
  {
    id: 5,
    nombre: "Esc. Sec. General #15",
    nivelEducativo: "Secundaria",
    ubicacion: "Guadalajara, Jalisco",
    matricula: 530,
    turno: "Matutino y Vespertino",
    necesidades: [
      { id: "n5-1", nombre: "Laboratorio de ciencias", color: "danger", descripcion: "El laboratorio requiere equipamiento completo para prácticas de química, física y biología." },
      { id: "n5-2", nombre: "Equipo de cómputo", color: "primary", descripcion: "Se necesitan 15 computadoras para el taller de informática." },
      { id: "n5-3", nombre: "Material deportivo", color: "info", descripcion: "Equipamiento para las actividades extracurriculares de basquetbol y voleibol." }
    ],
    compatibilidad: "parcial",
    director: "Dr. Roberto Sánchez",
    telefono: "33-5678-9012",
    email: "secundaria15@escuelas.edu.mx"
  },
  {
    id: 6,
    nombre: "Jardín de Niños 'Gabriela Mistral'",
    nivelEducativo: "Preescolar",
    ubicacion: "Zapopan, Jalisco",
    matricula: 95,
    turno: "Matutino",
    necesidades: [
      { id: "n6-1", nombre: "Material didáctico", color: "warning", descripcion: "Material sensorial y educativo para el desarrollo de habilidades motoras finas." },
      { id: "n6-2", nombre: "Mobiliario infantil", color: "primary", descripcion: "Se requieren mesas y sillas adecuadas para niños de preescolar." }
    ],
    compatibilidad: "ninguna",
    director: "Mtra. Luisa Hernández",
    telefono: "33-6789-0123",
    email: "gabriela.mistral@escuelas.edu.mx"
  }
];

export const opcionesFiltros = {
  nivelesEducativos: [
    { nombre: "Primaria", valor: "primaria" },
    { nombre: "Secundaria", valor: "secundaria" },
    { nombre: "Preescolar", valor: "preescolar" }
  ],
  tiposNecesidad: [
    { nombre: "Infraestructura", valor: "infraestructura" },
    { nombre: "Equipamiento", valor: "equipamiento" },
    { nombre: "Formación Docente", valor: "formacion" },
    { nombre: "Materiales Didácticos", valor: "materiales" }
  ],
  municipios: [
    { nombre: "Guadalajara", valor: "guadalajara" },
    { nombre: "Zapopan", valor: "zapopan" },
    { nombre: "Tlaquepaque", valor: "tlaquepaque" },
    { nombre: "Tonalá", valor: "tonala" }
  ],
  nivelesUrgencia: [
    { nombre: "Alta", valor: "alta" },
    { nombre: "Media", valor: "media" },
    { nombre: "Baja", valor: "baja" }
  ]
};

// Datos de ejemplo para los apoyos disponibles del aliado
export const apoyosDisponiblesAliado = [
  { 
    id: 1, 
    titulo: "Donación de equipos de cómputo", 
    tipo: "Material", 
    descripcion: "Donación de 20 computadoras reacondicionadas con software educativo instalado",
    categoria: "Equipamiento"
  },
  { 
    id: 2, 
    titulo: "Taller de programación", 
    tipo: "Capacitación", 
    descripcion: "Taller de introducción a la programación para alumnos de primaria y secundaria",
    categoria: "Formación"
  },
  { 
    id: 3, 
    titulo: "Apoyo en infraestructura", 
    tipo: "Infraestructura", 
    descripcion: "Reparación y mejoramiento de instalaciones educativas",
    categoria: "Infraestructura"
  },
  { 
    id: 4, 
    titulo: "Donación de material deportivo", 
    tipo: "Material", 
    descripcion: "Equipamiento completo para actividades deportivas: balones, redes y uniformes",
    categoria: "Equipamiento"
  },
  { 
    id: 5, 
    titulo: "Renovación de biblioteca", 
    tipo: "Material", 
    descripcion: "Donación de libros y mobiliario para bibliotecas escolares",
    categoria: "Materiales Didácticos"
  }
];