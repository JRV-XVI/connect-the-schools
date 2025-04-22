export const proyectoDetallado = {
    proyecto: {
      id: 1,
      nombre: "Equipamiento de Aula de Cómputo",
      estado: "En ejecución",
      escuela: "Primaria Benito Juárez",
      fechaInicio: "2025-02-15",
      fechaFin: "2025-04-15",
      progreso: 65,
      inversion: 150000,
      beneficiados: 320,
      responsable: "Juan Pérez",
      tipoApoyo: "Material"
    },
    
    fases: [
      {
        nombre: "Fase 1: Diagnóstico y planificación",
        fechaInicio: "2025-02-15",
        fechaFin: "2025-02-28",
        estado: "Completado",
        entregables: [
          { nombre: "Inventario actual de equipos", estado: "completado" },
          { nombre: "Diagnóstico de necesidades", estado: "completado" },
          { nombre: "Plan de implementación", estado: "completado" }
        ]
      },
      {
        nombre: "Fase 2: Adquisición e instalación",
        fechaInicio: "2025-03-01",
        fechaFin: "2025-03-31",
        estado: "En progreso",
        progreso: 40,
        entregables: [
          { nombre: "Compra de equipos completada", estado: "completado" },
          { nombre: "Instalación de red en proceso", estado: "en progreso" },
          { nombre: "Configuración de equipos pendiente", estado: "pendiente" }
        ]
      },
      {
        nombre: "Fase 3: Capacitación y entrega",
        fechaInicio: "2025-04-01",
        fechaFin: "2025-04-15",
        estado: "Pendiente"
      }
    ],
    
    evidencias: [
      {
        titulo: "Diagnóstico inicial",
        descripcion: "Inventario de equipos existentes y evaluación de necesidades.",
        imagen: "https://via.placeholder.com/300x200?text=Inventario",
        fase: "1",
        fecha: "2025-02-20"
      },
      {
        titulo: "Comprobante de compra",
        descripcion: "Factura de adquisición de 15 equipos de cómputo.",
        imagen: "https://via.placeholder.com/300x200?text=Factura",
        fase: "2",
        fecha: "2025-03-05"
      },
      {
        titulo: "Instalación en proceso",
        descripcion: "Fotografías del proceso de instalación de equipos y cableado de red.",
        imagen: "https://via.placeholder.com/300x200?text=Instalación",
        fase: "2",
        fecha: "2025-03-08"
      }
    ],
    
    mensajes: [
      {
        remitente: "María González (Directora)",
        fecha: "2025-03-02",
        hora: "08:45",
        contenido: "Buenos días, quería confirmar la fecha programada para la instalación de los equipos. Necesitamos preparar el espacio y asegurar que haya personal disponible ese día.",
        esPropio: false
      },
      {
        remitente: "Juan Pérez",
        fecha: "2025-03-02",
        hora: "09:30",
        contenido: "¡Buenos días! La instalación está programada para el jueves 6 de marzo a las 9:00 AM. Llegaremos con un equipo de 3 técnicos y necesitaremos aproximadamente 6 horas para completar la instalación.",
        esPropio: true
      },
      {
        remitente: "María González (Directora)",
        fecha: "2025-03-02",
        hora: "10:15",
        contenido: "Perfecto, confirmo la fecha y hora. El encargado de tecnología estará presente durante toda la jornada para apoyarlos en lo que necesiten. ¿Requieren alguna preparación específica del aula?",
        esPropio: false
      },
      {
        remitente: "Juan Pérez",
        fecha: "2025-03-02",
        hora: "11:05",
        contenido: "Gracias por confirmar. Sería ideal si pudieran tener despejadas las mesas donde se instalarán los equipos y asegurar que las conexiones eléctricas estén accesibles. También necesitaremos acceso a la red de internet para configurar los equipos.",
        esPropio: true
      },
      {
        remitente: "María González (Directora)",
        fecha: "2025-03-02",
        hora: "11:30",
        contenido: "Entendido. Nos encargaremos de preparar todo según sus indicaciones. Gracias por su apoyo y coordinación.",
        esPropio: false
      }
    ],
    
    documentos: [
      {
        nombre: "Convenio de colaboración",
        tipo: "pdf",
        categoria: "Contrato",
        fase: "Planificación",
        autor: "Administrador",
        fecha: "2025-02-15",
        tamaño: "354 KB",
        url: "#"
      },
      {
        nombre: "Inventario de equipos",
        tipo: "excel",
        categoria: "Planificación",
        fase: "Fase 1",
        autor: "Juan Pérez",
        fecha: "2025-02-20",
        tamaño: "128 KB",
        url: "#"
      },
      {
        nombre: "Especificaciones técnicas",
        tipo: "word",
        categoria: "Técnico",
        fase: "Fase 1",
        autor: "Depto. Técnico",
        fecha: "2025-02-25",
        tamaño: "245 KB",
        url: "#"
      },
      {
        nombre: "Factura de compra",
        tipo: "pdf",
        categoria: "Financiero",
        fase: "Fase 2",
        autor: "Depto. Contabilidad",
        fecha: "2025-03-05",
        tamaño: "187 KB",
        url: "#"
      },
      {
        nombre: "Fotografías de instalación",
        tipo: "imagen",
        categoria: "Evidencias",
        fase: "Fase 2",
        autor: "Juan Pérez",
        fecha: "2025-03-08",
        tamaño: "3.2 MB",
        url: "#"
      }
    ]
  };