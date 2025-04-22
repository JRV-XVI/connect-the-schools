export const tabsNecesidades = [
    { id: 'activas', label: 'Necesidades Activas' },
    { id: 'atendidas', label: 'Necesidades Atendidas' },
    { id: 'pendientes', label: 'Borradores' }
  ];
  
  export const columnasNecesidades = {
    activas: [
      { field: 'categoria', header: 'Categoría' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'prioridad', header: 'Prioridad' },
      { field: 'fechaPublicacion', header: 'Fecha' },
      { field: 'cantidadRequerida', header: 'Cantidad' },
      { field: 'estado', header: 'Estado' },
      { field: 'acciones', header: 'Acciones' }
    ],
    atendidas: [
      { field: 'categoria', header: 'Categoría' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'atendidaPor', header: 'Atendida Por' },
      { field: 'fechaAtencion', header: 'Fecha Atención' },
      { field: 'estado', header: 'Estado' },
      { field: 'acciones', header: 'Acciones' }
    ],
    pendientes: [
      { field: 'categoria', header: 'Categoría' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'ultimaModificacion', header: 'Última Edición' },
      { field: 'acciones', header: 'Acciones' }
    ]
  };
  
  export const datosNecesidades = {
    activas: [
      {
        id: 1,
        categoria: 'Equipamiento Tecnológico',
        descripcion: 'Computadoras para laboratorio de secundaria',
        prioridad: 'Alta',
        fechaPublicacion: '05/04/2025',
        cantidadRequerida: '15 equipos',
        activo: true
      },
      {
        id: 2,
        categoria: 'Material Didáctico',
        descripcion: 'Material para laboratorio de ciencias',
        prioridad: 'Media',
        fechaPublicacion: '03/04/2025',
        cantidadRequerida: '10 kits',
        activo: true
      },
      {
        id: 3,
        categoria: 'Infraestructura',
        descripcion: 'Reparación de techos en aulas',
        prioridad: 'Alta',
        fechaPublicacion: '01/04/2025',
        cantidadRequerida: '2 aulas',
        activo: true
      }
    ],
    atendidas: [
      {
        id: 4,
        categoria: 'Material Deportivo',
        descripcion: 'Balones y equipamiento deportivo',
        atendidaPor: 'Fundación Deporte para Todos',
        fechaAtencion: '20/03/2025',
        activo: false
      },
      {
        id: 5,
        categoria: 'Capacitación Docente',
        descripcion: 'Taller de estrategias pedagógicas',
        atendidaPor: 'Instituto de Formación Docente',
        fechaAtencion: '15/03/2025',
        activo: false
      }
    ],
    pendientes: [
      {
        id: 6,
        categoria: 'Material Bibliográfico',
        descripcion: 'Libros para biblioteca escolar',
        ultimaModificacion: '10/04/2025'
      }
    ]
  };