export const tabsApoyos = [
    { id: 'activas', label: 'Ofertas Activas' },
    { id: 'inactivas', label: 'Ofertas Inactivas' },
    { id: 'borradores', label: 'Borradores' }
  ];
  
  export const columnasApoyos = {
    activas: [
      { field: 'categoria', header: 'Categoría' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'disponibilidad', header: 'Disponibilidad' },
      { field: 'cobertura', header: 'Cobertura' },
      { field: 'solicitudes', header: 'Solicitudes' },
      { field: 'estado', header: 'Estado' },
      { field: 'acciones', header: 'Acciones' }
    ],
    inactivas: [
      { field: 'categoria', header: 'Categoría' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'razonInactividad', header: 'Razón de inactividad' },
      { field: 'ultimaActualizacion', header: 'Última actualización' },
      { field: 'estado', header: 'Estado' },
      { field: 'acciones', header: 'Acciones' }
    ],
    borradores: [
      { field: 'categoria', header: 'Categoría' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'creacion', header: 'Fecha creación' },
      { field: 'acciones', header: 'Acciones' }
    ]
  };
  
  export const datosApoyos = {
    activas: [
      {
        id: 1,
        categoria: 'Equipamiento Tecnológico',
        descripcion: 'Computadoras de escritorio para aulas',
        disponibilidad: '15 unidades',
        cobertura: 'Zona Metropolitana',
        solicitudes: '2 pendientes',
        activo: true
      },
      {
        id: 2,
        categoria: 'Infraestructura',
        descripcion: 'Pintura y rehabilitación de espacios',
        disponibilidad: 'Por proyecto',
        cobertura: 'Todo Jalisco',
        solicitudes: '1 pendiente',
        activo: true
      },
      {
        id: 3,
        categoria: 'Material Deportivo',
        descripcion: 'Equipamiento para educación física',
        disponibilidad: '30 kits completos',
        cobertura: 'Todo Jalisco',
        solicitudes: '0 pendientes',
        activo: true
      }
    ],
    inactivas: [
      {
        id: 4,
        categoria: 'Material Bibliográfico',
        descripcion: 'Libros para biblioteca escolar',
        razonInactividad: 'Agotados temporalmente',
        ultimaActualizacion: '01/03/2025',
        activo: false
      }
    ],
    borradores: [
      {
        id: 5,
        categoria: 'Capacitación Docente',
        descripcion: 'Taller de estrategias pedagógicas digitales',
        creacion: '05/04/2025'
      }
    ]
  };