export const pendientesAdministrador = {
  titulo: "Validaciones Pendientes",
  items: [
    {
      titulo: "Validación de Proyectos",
      descripcion: "Proyectos pendientes de aprobación",
      cantidad: "10",
      color: "warning",
      tipo: "proyecto" // Agregar tipo para identificar la acción
    },
    {
      titulo: "Validación de Documentos",
      descripcion: "Documentos escolares para revisar",
      cantidad: "8",
      color: "danger",
      tipo: "documento" // Agregar tipo
    }
    // Puedes agregar más tipos según sea necesario
  ]
};

// Datos específicos de proyectos pendientes de validación
export const proyectosPendientes = {
  titulo: "Proyectos Pendientes de Validación",
  textoBoton: "Ver todos",
  badgeText: "10", 
  badgeColor: "warning",
  items: [
    {
      idProyecto: 1,
      nombreProyecto: "Implementación de laboratorio de ciencias",
      cct: "12ABC345",
      nombreEscuela: "Escuela Primaria Benito Juárez",
      rfc: "XAXX010101000",
      nombreAliado: "Fundación Educativa Nacional",
      idNecesidadApoyo: 2,
      necesidadApoyo: "Equipamiento de laboratorio",
      aceptacionAliado: true,
      aceptacionEscuela: false,
      observacion: "Pendiente de revisión final" // Este campo será de solo lectura
    },
    {
      idProyecto: 1,
      nombreProyecto: "Implementación de laboratorio de ciencias",
      cct: "12ABC345",
      nombreEscuela: "Escuela Primaria Benito Juárez",
      rfc: "XAXX010101000",
      nombreAliado: "Fundación Educativa Nacional",
      idNecesidadApoyo: 2,
      necesidadApoyo: "Equipamiento de laboratorio",
      aceptacionAliado: true,
      aceptacionEscuela: false,
      observacion: "Pendiente de revisión final" // Este campo será de solo lectura
    },
    
    // Más proyectos...
  ],
  apiUrl: "/api/v1"
};