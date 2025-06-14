import React, { useState, useEffect } from "react";
import { get, post, put, del } from '../api.js';
import axios from "axios"; // Add axios import
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Notificaciones from "../components/notificaciones.jsx";
import Proyecto from "../components/proyectos.jsx";
import Gestiones from "../components/gestiones.jsx";
import ProyectoDetallado from '../components/proyectoDetallado.jsx';
import { StatCardGroup } from "../components/cartas.jsx";
import { sidebarAdministrador } from "../data/barraLateral/barraLateralAdministrador.js";
import { navbarAdministrador } from "../data/barraNavegacion/barraNavegacionAdministrador.js";
import { proyectosAdministrador } from '../data/proyectos/proyectosAdministrador.js';
import Logo from "../assets/MPJ.png";
import MapaGoogle from "../components/mapaGoogle.jsx";
import { Modal, Button, Badge, Toast } from 'react-bootstrap';

const Administrador = ({userData, onLogout}) => {
  // Estado para controlar qué tipo de validación se está mostrando (proyecto, usuario, etc.)
  const [validacionActiva, setValidacionActiva] = useState(null);
  const usuario = userData || { nombre: "Administrador", foto: "" };
  const notificaciones = navbarAdministrador?.notificaciones || [];
  const menuItems = navbarAdministrador?.menuItems || [];
  
  // New state for API notifications
  const [notificacionesTodas, setNotificacionesTodas] = useState([]);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false);
  const [errorNotificaciones, setErrorNotificaciones] = useState(null);

  const [datosGestionNecesidades, setDatosGestionNecesidades] = useState({});
  const [datosGestionApoyos, setDatosGestionApoyos] = useState({});
  const [datosGestionVinculaciones, setDatosGestionVinculaciones] = useState({});

  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);

  // Estados para ProyectoDetallado
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [projectData, setProjectData] = useState({
    fases: [],
    evidencias: [],
    mensajes: [],
    documentos: []
  });
  // Añadir estos estados después de la declaración de projectData
  const [proyectos, setProyectos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [etapas, setEtapas] = useState([]);

  const handleLogout = () => {
    // Eliminar datos de localStorage
    localStorage.removeItem('userData');
    
    // Llamar a la función onLogout proporcionada por App.jsx
    if (onLogout) {
      onLogout();
    }
  };

  const [mostrarModalEtapas, setMostrarModalEtapas] = useState(false);
  const [vinculacionSeleccionada, setVinculacionSeleccionada] = useState(null);
  const [datosProyecto, setDatosProyecto] = useState({
    descripcion: "",
    fechaFin: "",
    rfc: "",        // RFC del aliado
    cct: "",        // CCT de la escuela
    idApoyo: null,  // ID del apoyo vinculado
    idNecesidad: null, // ID de la necesidad vinculada
    etapas: [
      { tituloEtapa: "", descripcionEtapa: "", orden: 1 }
    ]
  });

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success', // 'success', 'warning', 'danger', 'info'
    title: ''
  });

  // Agregar este estado después de los estados existentes
  const [proyectosActualizados, setProyectosActualizados] = useState(0);
  
  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success', title = '') => {
    setNotification({
      show: true,
      message,
      type,
      title: title || (type === 'success' ? 'Éxito' : 
                      type === 'warning' ? 'Advertencia' : 
                      type === 'danger' ? 'Error' : 'Información')
    });
  };
  
  useEffect(() => {
    const obtenerNotificaciones = async () => {
      // ID fijo para el administrador
      const adminId = 3; // Usar el ID fijo que sabemos que funciona
      
      console.log("Obteniendo notificaciones para administrador con ID:", adminId);
      setCargandoNotificaciones(true);
      setErrorNotificaciones(null);
      
      try {
        // Llamada directa y más simple a la API usando nuestro servicio centralizado
        const notificaciones = await get(`/usuario/${adminId}/notificacion`);
        console.log("Notificaciones recibidas:", notificaciones);
        
        if (Array.isArray(notificaciones)) {
          setNotificacionesTodas(notificaciones);
        } else {
          console.error("Las notificaciones no tienen el formato esperado:", notificaciones);
          setNotificacionesTodas([]);
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        setErrorNotificaciones("No se pudieron cargar las notificaciones");
        setNotificacionesTodas([]);
      } finally {
        setCargandoNotificaciones(false);
      }
    };
    
    obtenerNotificaciones();
  }, []); // Quitamos la dependencia usuario.id para evitar recargas innecesarias

  // Modificar la función fetchDatosNecesidades
  // Modificar la función fetchDatosNecesidades
  useEffect(() => {
    async function fetchDatosNecesidades() {
      try {
        const datos = await get("/necesidades");
        console.log("Datos necesidades:", datos);

        // Estructura correcta para necesidades (estructura plana, no anidada)
        const datosAdaptados = {
          titulo: "Necesidades Escolares",
          items: datos.map(item => ({
            titulo: item.categoria || "Sin categoría",
            descripcion: item.descripcion || "Sin descripción",
            categoria: item.categoria || "Sin categoría",
            subcategoria: item.subcategoria || "No especificada",
            estado: item.estadoValidacion === 1 ? "No aprobado" :
              item.estadoValidacion === 2 ? "Pendiente" : "Aprobada",
            cantidad: item.prioridad != null ? String(item.prioridad) : "0",
            color: "secondary",
            datosOriginales: item
          }))
        };

        setDatosGestionNecesidades(datosAdaptados);
      } catch (error) {
        console.error("Error al obtener datos de necesidades:", error);
      }
    }

    fetchDatosNecesidades();
  }, []);

  // De la misma forma, modificar fetchDatosApoyos
  useEffect(() => {
    async function fetchDatosApoyos() {
      try {
        const datos = await get("/apoyos");
        console.log("Datos apoyos:", datos);

        const datosAdaptados = {
          titulo: "Ofertas de Apoyo",
          items: datos.map(item => ({
            titulo: item.categoria || "Sin categoría",
            descripcion: item.descripcion || "Sin descripción",
            estado: item.estadoValidacion === 1 ? "No aprobado" : (item.estadoValidacion === 2 ? "Pendiente" : "Aprobada"),
            cantidad: item.prioridad != null ? String(item.prioridad) : "0",
            color: "secondary",
            // Agregar explícitamente estos campos
            categoria: item.categoria || "Sin categoría",
            subcategoria: item.subcategoria || "No especificada",
            datosOriginales: item
          }))
        };

        setDatosGestionApoyos(datosAdaptados);
      } catch (error) {
        console.error("Error al obtener datos de apoyos:", error);
      }
    }

    fetchDatosApoyos();
  }, []);


  // Vinculaciones
  useEffect(() => {
    async function fetchDatosVinculaciones() {
      try {
        const datos = await get("/vinculaciones");
        const datosAdaptados = {
          titulo: "Vinculaciones",
          items: datos.map(item => ({
            titulo: item.necesidad.categoria || "Sin categoría",
            descripcion: item.observacion || "Sin descripción",
            categoria: item.necesidad.subcategoria,
            cantidad: item.prioridad != null ? String(item.prioridad) : "0",
            color: "secondary",
            datosOriginales: item
          }))
        };
        setDatosGestionVinculaciones(datosAdaptados);
      } catch (error) {
        console.error("Error al obtener datos de vinculaciones:", error);
      }
    }

    fetchDatosVinculaciones();
  }, []); // Este useEffect también solo se ejecuta una vez al cargar el componente

  // Obtener todos los proyectos del sistema
  useEffect(() => {
    fetchProyectos();
  }, [proyectosActualizados]);

  //--------------------------//
  //---------PROYECTO---------//
  //--------------------------//

  // Función para obtener proyectos
  const fetchProyectos = async () => {
    try {
      // Paso 1: Obtener proyectos con el ID real del usuario
      const respuesta = await get(`/proyecto/usuario/${usuario.idUsuario}`);
      
      // Paso 2: Comprobar si hay proyectos y actualizar el estado
      if (respuesta && Array.isArray(respuesta)) {
        // Formateo de datos
        const proyectosFormateados = respuesta.map(proyecto => ({
          id: proyecto.idProyecto,
          nombre: proyecto.descripcion,
          fechaInicio: new Date(proyecto.fechaCreacion).toLocaleDateString(),
          fechaFin: proyecto.fechaFin ? new Date(proyecto.fechaFin).toLocaleDateString() : 'No definida',
          progreso: proyecto.progreso || 0,
          estado: proyecto.progreso === 100 ? 'Completado' : 'Pendiente',
          escuela: proyecto.nombreEscuela || 'Escuela asociada',
          aliado: proyecto.nombreAliado || 'Aliado asociado',
          estudiantes: proyecto.numeroEstudiantes || 0
        }));
        console.log("Proyectos normales: ", respuesta);
        setProyectos(proyectosFormateados);
        console.log("Proyectos formateados:", proyectosFormateados);
      } else {
        setProyectos([]);
        console.log("No se encontraron proyectos");
      }
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      setProyectos([]);
    }
  };

  //----------------------------------//
  //---------ETAPAS PROYECTO---------//
  //--------------------------------//

  const fetchEtapas = async (idProyecto) =>{
    try {
      const respuesta = await get(`/proyecto/${idProyecto}/etapas`);
      setEtapas(respuesta);
      console.log(`Etapas del proyecto ${idProyecto}`, respuesta)
    } catch (error) {
      console.log("Error al obtener las etapas:", error);
      setEtapas([]);
    }
  };

  //----------------------------//
  //---------MENSAJERIA---------//
  //----------------------------//

  // fetchMensajes modificado para administrador (solo visualización)
  const fetchMensajes = async (idProyecto) => {
    try {
      // Paso 1: Obtener la mensajería asociada al proyecto
      const mensajerias = await get(`/proyecto/${idProyecto}/mensajeria`);
      
      // Verificar si se encontraron mensajerías
      if (mensajerias && mensajerias.length > 0) {
        // Paso 2: Obtener los mensajes usando el idMensajeria
        const idMensajeria = mensajerias[0].idMensajeria;
        const respuestaMensajes = await get(`/mensajeria/${idMensajeria}/mensajes`);

        // Paso 3: Transformar los mensajes para el front - administrador solo visualiza
        const mensajesFormateados = respuestaMensajes.map(mensaje => {
          // Determinar el tipo de remitente según tipoPerfil
          let tipoRemitente = "Usuario";
          let nombreRemitente = "Usuario desconocido";
          
          // Asignar tipo según el campo tipoPerfil de la tabla usuario (si está disponible)
          if (mensaje.tipoPerfil === 1) {
            tipoRemitente = "Escuela";
            nombreRemitente = mensaje.nombreRemitente || selectedProject.escuela;
          } 
          else if (mensaje.tipoPerfil === 2) {
            tipoRemitente = "Aliado";
            nombreRemitente = mensaje.nombreRemitente || selectedProject.aliado;
          }
          else if (mensaje.tipoPerfil === 3) {
            tipoRemitente = "Administrador";
            nombreRemitente = mensaje.nombreRemitente || "Administrador";
          }
          
          return {
            // El administrador nunca tiene mensajes propios
            esPropio: false,
            // Usar el nombre del remitente de la respuesta o fallback
            remitente: nombreRemitente,
            tipoRemitente: tipoRemitente,
            hora: mensaje.fechaEnvio,
            contenido: mensaje.contenido
          };
        });

        setMensajes(mensajesFormateados);
      } else {
        setMensajes([]);
      }
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      setMensajes([]);
    }
  };

  // Añadir después de los useEffect existentes

  // Actualización periódica de mensajes
  useEffect(() => {
    if (selectedProject && showProjectDetail) {
      const interval = setInterval(() => {
        fetchMensajes(selectedProject.id);
      }, 10000); // Actualizar cada 10 segundos
      
      return () => clearInterval(interval);
    }
  }, [selectedProject, showProjectDetail]);

  const cartasAdministrador = [
    {
      title: "Necesidades pendientes",
      value: datosGestionNecesidades.items?.length || 0,
      icon: "fa-school",
      color: "success",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Apoyos pendientes",
      value: datosGestionApoyos.items?.length || 0,
      icon: "fa-handshake",
      color: "danger",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Proyectos Creados",
      value: proyectos.length || 0,
      icon: "fa-diagram-project",
      color: "primary",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Vinculaciones Pendientes",
      value: datosGestionVinculaciones.items?.length || 0,
      icon: "fa-clipboard-check",
      color: "warning",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    }
  ];

  // Obtenemos todos los proyectos y los limitamos a 3 para el dashboard
  const proyectosTodos = proyectosAdministrador?.proyectos || [];
  const proyectosItems = proyectosTodos.slice(0, 3);
  const proyectosTitulo = proyectosAdministrador?.titulo || "Proyectos Recientes";
  const proyectosTextoBoton = proyectosAdministrador?.textoBoton || "Ver todos";

  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoDetalle, setTipoDetalle] = useState(""); // Para identificar el tipo de detalle (necesidad, apoyo o vinculación)

  const handleVerDetalles = (item, tipo) => {
    console.log("Ver detalles:", tipo, item);

    // Only proceed if item is defined
    if (!item) {
      console.error(`No se pudo mostrar detalle de tipo ${tipo}: datos indefinidos`);
      return; // Don't show modal if data is undefined
    }

    setDetalleSeleccionado(item);
    setTipoDetalle(tipo);
    setMostrarModal(true);
  };

  const handleVerProyectos = () => {
    console.log("Ver todos los proyectos");
    setMostrarProyectoDetallado(false);
  };

  const handleVerDetallesProyecto = (proyecto) => {
    console.log("Ver detalles del proyecto:", proyecto.nombre);
    setSelectedProject(proyecto);
    setShowProjectDetail(true);
    
    // Obtener mensajes del proyecto
    console.log("Ver id del proyecto:", proyecto.id);

    fetchMensajes(proyecto.id);
    fetchEtapas(proyecto.id);
    
    setTimeout(() => {
      const seccionDetalles = document.getElementById('seccionProyectoDetallado');
      if (seccionDetalles) {
        seccionDetalles.scrollIntoView({ behavior: 'smooth' });
      }
    }, 10);
  };

  const handleActionProyecto = (proyecto) => {
    console.log("Acción en proyecto:", proyecto.nombre, "Estado:", proyecto.estado);
  };

  // Manejadores para ProyectoDetallado
  const handleGoBack = () => {
    setShowProjectDetail(false);
    setSelectedProject(null);
  };

  const handleExportReport = () => {
    console.log("Exportando reporte del proyecto:", selectedProject?.nombre);
  };

  const handleAddRecord = (record) => {
    console.log("Agregando registro al proyecto:", selectedProject?.nombre, record);
  };

  const handleUpdateProgress = () => {
    console.log("Actualizando progreso del proyecto:", selectedProject?.nombre);
  };

  const handleUploadEvidence = () => {
    console.log("Subiendo evidencia para el proyecto:", selectedProject?.nombre);
  };

  const handleSendMessage = () => {
    // Función vacía o con alerta
    alert("Los administradores solo pueden visualizar mensajes, no enviarlos.");
    return null;
  };

  const handleUploadDocument = () => {
  };

  const handleGenerateReport = () => {
    console.log("Generando reporte para el proyecto:", selectedProject?.nombre);
  };

  const handleSaveChanges = () => {
    console.log("Guardando cambios del proyecto:", selectedProject?.nombre);
  };

  const handleDownloadDocument = (documento) => {
    console.log("Descargando documento:", documento.nombre);
  };

  const handleViewDocument = (documento) => {
    console.log("Visualizando documento:", documento.nombre);
  }
  
  // Funciones para manejar las etapas (agregar después de tus otros manejadores)
  const handleAprobarVinculacion = (vinculacion) => {
    console.log("Aprobando vinculación:", vinculacion);
    setVinculacionSeleccionada(vinculacion);

    // Inicializar el formulario con datos y etapas predeterminadas según formato requerido
    setDatosProyecto({
      descripcion: "Proyecto de Vinculación 2025",
      fechaFin: "2025-12-31",
      // Extraer datos de la vinculación seleccionada
      rfc: vinculacion.aliado?.rfc || "",
      cct: vinculacion.escuela?.cct || "",
      idApoyo: vinculacion.apoyo?.idApoyo || null,           // Corregido
      idNecesidad: vinculacion.necesidad?.idNecesidad || null, // Corregido
      etapas: [
        { tituloEtapa: "Planeación", descripcionEtapa: "Definición de objetivos y recursos", orden: 1 },
        { tituloEtapa: "Ejecución", descripcionEtapa: "Implementación de actividades", orden: 2 },
        { tituloEtapa: "Evaluación", descripcionEtapa: "Análisis de resultados", orden: 3 }
      ]
    });

    setMostrarModalEtapas(true);
  };

  const handleRechazarVinculacion = async (vinculacion) => {
    console.log("Rechazando vinculación:", vinculacion);
  
    try {
      // Verificar que la vinculación contenga los datos necesarios
      if (!vinculacion || !vinculacion.aliado?.rfc || !vinculacion.escuela?.cct ||
        !vinculacion.necesidad?.idNecesidad || !vinculacion.apoyo?.idApoyo) {
        console.error("Error: vinculación no tiene los datos requeridos", vinculacion);
        showNotification("Error: La vinculación no contiene todos los datos necesarios", "danger", "Error de Validación");
        return;
      }
  
      const queryParams = new URLSearchParams({
        rfc: vinculacion.aliado.rfc,
        cct: vinculacion.escuela.cct,
        idNecesidad: vinculacion.necesidad.idNecesidad,
        idApoyo: vinculacion.apoyo.idApoyo
      }).toString();
      
      const resultado = await del(`/vinculacion?${queryParams}`);
  
      console.log("Respuesta del servidor:", resultado);
  
      // UPDATE STATE: Remove the vinculacion from the state
      setDatosGestionVinculaciones(prevState => {
        const updatedItems = prevState.items.filter(item => {
          // Check if this item corresponds to the rejected vinculacion
          if (item.datosOriginales && 
              item.datosOriginales.aliado?.rfc === vinculacion.aliado.rfc &&
              item.datosOriginales.escuela?.cct === vinculacion.escuela.cct &&
              item.datosOriginales.necesidad?.idNecesidad === vinculacion.necesidad.idNecesidad &&
              item.datosOriginales.apoyo?.idApoyo === vinculacion.apoyo.idApoyo) {
            return false; // Remove this item
          }
          return true; // Keep this item
        });
  
        return {
          ...prevState,
          items: updatedItems
        };
      });
  
      // Rest of the notification logic remains the same...
      const notificacionEscuela = {
        cct: vinculacion.escuela.cct,
        titulo: "Vinculación rechazada",
        mensaje: `La vinculación para "${vinculacion.necesidad.categoria}: ${vinculacion.necesidad.subcategoria}" ha sido rechazada por el administrador.`
      };
  
      const notificacionAliado = {
        rfc: vinculacion.aliado.rfc,
        titulo: "Vinculación rechazada",
        mensaje: `La vinculación para apoyar con "${vinculacion.apoyo.categoria}: ${vinculacion.apoyo.subcategoria}" ha sido rechazada por el administrador.`
      };
  
      try {
        await post("/notificacion", notificacionEscuela);
        console.log("Notificación enviada a la escuela");
  
        await post("/notificacion", notificacionAliado);
        console.log("Notificación enviada al aliado");
      } catch (errorNotificacion) {
        console.error("Error al enviar notificaciones:", errorNotificacion);
      }
  
      showNotification('Vinculación rechazada exitosamente y notificaciones enviadas', 'danger', 'Vinculación Rechazada');
  
    } catch (error) {
      console.error("Error al rechazar la vinculación:", error);
      showNotification(`Error al rechazar la vinculación: ${error.message || "Revisa la conexión con el servidor"}`, 'danger', 'Error');
    }
  };

  // Función para aprobar necesidades
  const handleAprobarNecesidad = async (necesidad) => {
    console.log("Aprobando necesidad:", necesidad);
    try {
      // Verifica si el ID existe y es válido
      if (!necesidad.idNecesidadApoyo) {
        console.error("Error: necesidad no tiene un ID válido", necesidad);
        showNotification("Error: La necesidad no tiene un ID válido", "danger", "Error de Validación");
        return;
      }
  
      const necesidadId = necesidad.idNecesidadApoyo;
  
      // Objeto de datos para enviar al backend
      const datosAprobacion = {
        id: necesidadId,
        estadoValidacion: 3 // Código de estado para "Aprobado"
      };
  
      console.log(`Enviando petición PUT a /necesidadApoyo/${necesidadId}`, datosAprobacion);
  
      // Llamada al endpoint para aprobar necesidad
      const respuesta = await put(`/necesidadApoyo/${necesidadId}`, datosAprobacion);
  
      console.log("Respuesta del servidor:", respuesta);
  
      // UPDATE STATE: Update the local state to reflect the change
      setDatosGestionNecesidades(prevState => {
        const updatedItems = prevState.items.map(item => {
          if (item.datosOriginales && item.datosOriginales.idNecesidadApoyo === necesidadId) {
            return {
              ...item,
              estado: "Aprobada",
              datosOriginales: {
                ...item.datosOriginales,
                estadoValidacion: 3
              }
            };
          }
          return item;
        });
  
        return {
          ...prevState,
          items: updatedItems
        };
      });
  
      // MODIFICADO: Enviar notificación usando el mismo patrón que funciona en enviarProyecto
      const idUsuario = necesidad.idUsuario || necesidad.usuario?.idUsuario;
  
      if (idUsuario) {
        const notificacionEscuela = {
          idUsuario: idUsuario,
          titulo: "¡Necesidad Aprobada!",
          mensaje: `Su necesidad "${necesidad.categoria}: ${necesidad.subcategoria}" ha sido aprobada y está lista para ser atendida.`
        };
  
        try {
          console.log("Enviando notificación a usuario con ID:", idUsuario);
          await post("/notificacion", notificacionEscuela);
          console.log("Notificación enviada sobre necesidad aprobada");
        } catch (errorNotificacion) {
          console.error("Error al enviar notificación:", errorNotificacion);
        }
      } else {
        console.warn("No se encontró idUsuario para enviar notificación de necesidad aprobada");
      }
  
      showNotification('Necesidad aprobada exitosamente', 'success', 'Necesidad Aprobada');
    } catch (error) {
      console.error("Error al aprobar la necesidad:", error);
      showNotification(`Error al aprobar la necesidad: ${error.message || "Revisa la conexión con el servidor"}`, 'danger', 'Error');
    }
  };

  const handleAprobarApoyo = async (apoyo) => {
    console.log("Aprobando apoyo:", apoyo);
    try {
      if (!apoyo.idNecesidadApoyo) {
        console.error("Error: apoyo no tiene un ID válido", apoyo);
        showNotification("Error: El apoyo no tiene un ID válido", "danger", "Error de Validación");
        return;
      }
  
      const apoyoId = apoyo.idNecesidadApoyo;
  
      // Objeto de datos para enviar al backend
      const datosAprobacion = {
        id: apoyoId,
        estadoValidacion: 3 // Código de estado para "Aprobado"
      };
  
      console.log(`Enviando petición PUT a /necesidadApoyo/${apoyoId}`, datosAprobacion);
  
      // Llamada al endpoint para aprobar apoyo
      const respuesta = await put(`/necesidadApoyo/${apoyoId}`, datosAprobacion);
  
      console.log("Respuesta del servidor:", respuesta);
  
      // UPDATE STATE: Update the local state to reflect the change
      setDatosGestionApoyos(prevState => {
        const updatedItems = prevState.items.map(item => {
          if (item.datosOriginales && item.datosOriginales.idNecesidadApoyo === apoyoId) {
            return {
              ...item,
              estado: "Aprobada",
              datosOriginales: {
                ...item.datosOriginales,
                estadoValidacion: 3
              }
            };
          }
          return item;
        });
  
        return {
          ...prevState,
          items: updatedItems
        };
      });
  
      // MODIFICADO: Enviar notificación usando el mismo patrón que funciona en enviarProyecto
      const idUsuario = apoyo.idUsuario || apoyo.usuario?.idUsuario;
  
      if (idUsuario) {
        const notificacionAliado = {
          idUsuario: idUsuario,
          titulo: "¡Apoyo Aprobado!",
          mensaje: `Su ofrecimiento de apoyo "${apoyo.categoria}: ${apoyo.subcategoria}" ha sido aprobado y ahora está disponible para vinculación con escuelas.`
        };
  
        try {
          console.log("Enviando notificación al usuario con ID:", idUsuario);
          await post("/notificacion", notificacionAliado);
          console.log("Notificación enviada sobre apoyo aprobado");
        } catch (errorNotificacion) {
          console.error("Error al enviar notificación:", errorNotificacion);
        }
      } else {
        console.warn("No se encontró idUsuario para enviar notificación de apoyo aprobado");
      }
  
      showNotification('Apoyo aprobado exitosamente', 'success', 'Apoyo Aprobado');
    } catch (error) {
      console.error("Error al aprobar el apoyo:", error);
      showNotification(`Error al aprobar el apoyo: ${error.message || "Revisa la conexión con el servidor"}`, 'danger', 'Error');
    }
  };  

  const handleRechazarNecesidad = async (necesidad) => {
    console.log("Rechazando necesidad:", necesidad);
    try {
      if (!necesidad.idNecesidadApoyo) {
        console.error("Error: necesidad no tiene un ID válido", necesidad);
        showNotification("Error: La necesidad no tiene un ID válido", "danger", "Error de Validación");
        return;
      }
      
      const necesidadId = necesidad.idNecesidadApoyo;
  
      // Objeto de datos para enviar al backend
      const datosRechazo = {
        id: necesidadId,
        estadoValidacion: 1 // Código de estado para "No aprobado"
      };
  
      console.log(`Enviando petición PUT a /necesidadApoyo/${necesidadId}`, datosRechazo);
  
      // Llamada al endpoint para rechazar necesidad
      const respuesta = await put(`/necesidadApoyo/${necesidadId}`, datosRechazo);
  
      console.log("Respuesta del servidor:", respuesta);
  
      // UPDATE STATE: Update the local state to reflect the change
      setDatosGestionNecesidades(prevState => {
        const updatedItems = prevState.items.map(item => {
          if (item.datosOriginales && item.datosOriginales.idNecesidadApoyo === necesidadId) {
            return {
              ...item,
              estado: "No aprobado",
              datosOriginales: {
                ...item.datosOriginales,
                estadoValidacion: 1
              }
            };
          }
          return item;
        });
  
        return {
          ...prevState,
          items: updatedItems
        };
      });
  
      // MODIFICADO: Enviar notificación usando el mismo patrón que funciona en enviarProyecto
      const idUsuario = necesidad.idUsuario || necesidad.usuario?.idUsuario;
  
      if (idUsuario) {
        const notificacionEscuela = {
          idUsuario: idUsuario,
          titulo: "Necesidad No Aprobada",
          mensaje: `Su necesidad "${necesidad.categoria}: ${necesidad.subcategoria}" no ha sido aprobada. Por favor, contacte con administración para más detalles.`
        };
  
        try {
          console.log("Enviando notificación de rechazo al usuario con ID:", idUsuario);
          await post("/notificacion", notificacionEscuela);
          console.log("Notificación enviada sobre necesidad rechazada");
        } catch (errorNotificacion) {
          console.error("Error al enviar notificación:", errorNotificacion);
        }
      } else {
        console.warn("No se encontró idUsuario para enviar notificación de necesidad rechazada");
      }
  
      showNotification('Necesidad rechazada exitosamente', 'danger', 'Necesidad Rechazada');
    } catch (error) {
      console.error("Error al rechazar la necesidad:", error);
      showNotification(`Error al rechazar la necesidad: ${error.message || "Revisa la conexión con el servidor"}`, 'danger', 'Error');
    }
  };

  const handleRechazarApoyo = async (apoyo) => {
    console.log("Rechazando apoyo:", apoyo);
    try {
      // Verifica si el ID existe y es válido
      if (!apoyo.idNecesidadApoyo) {
        console.error("Error: apoyo no tiene un ID válido", apoyo);
        showNotification("Error: El apoyo no tiene un ID válido", "danger", "Error de Validación");
        return;
      }
  
      const apoyoId = apoyo.idNecesidadApoyo;
  
      // Objeto de datos para enviar al backend
      const datosRechazo = {
        id: apoyoId,
        estadoValidacion: 1 // Código de estado para "No aprobado"
      };
  
      console.log(`Enviando petición PUT a /necesidadApoyo/${apoyoId}`, datosRechazo);
  
      const respuesta = await put(`/necesidadApoyo/${apoyoId}`, datosRechazo);
  
      console.log("Respuesta del servidor:", respuesta);
  
      // UPDATE STATE: Update the local state to reflect the change
      setDatosGestionApoyos(prevState => {
        const updatedItems = prevState.items.map(item => {
          if (item.datosOriginales && item.datosOriginales.idNecesidadApoyo === apoyoId) {
            return {
              ...item,
              estado: "No aprobado",
              datosOriginales: {
                ...item.datosOriginales,
                estadoValidacion: 1
              }
            };
          }
          return item;
        });
  
        return {
          ...prevState,
          items: updatedItems
        };
      });
  
      // MODIFICADO: Enviar notificación usando el mismo patrón que funciona en enviarProyecto
      const idUsuario = apoyo.idUsuario || apoyo.usuario?.idUsuario;
  
      if (idUsuario) {
        const notificacionAliado = {
          idUsuario: idUsuario,
          titulo: "Apoyo No Aprobado",
          mensaje: `Su ofrecimiento de apoyo "${apoyo.categoria}: ${apoyo.subcategoria}" no ha sido aprobado. Por favor, contacte con administración para más detalles.`
        };
  
        try {
          console.log("Enviando notificación de rechazo al usuario con ID:", idUsuario);
          await post("/notificacion", notificacionAliado);
          console.log("Notificación enviada sobre apoyo rechazado");
        } catch (errorNotificacion) {
          console.error("Error al enviar notificación:", errorNotificacion);
        }
      } else {
        console.warn("No se encontró idUsuario para enviar notificación de apoyo rechazado");
      }
  
      showNotification('Apoyo rechazado exitosamente', 'danger', 'Apoyo Rechazado');
    } catch (error) {
      console.error("Error al rechazar el apoyo:", error);
      showNotification(`Error al rechazar el apoyo: ${error.message || "Revisa la conexión con el servidor"}`, 'danger', 'Error');
    }
  };

  // Manejar cambios en los campos del proyecto (descripción y fecha)
  const handleCambioDatosProyecto = (e) => {
    const { name, value } = e.target;
    setDatosProyecto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en los campos de una etapa
  const handleCambioEtapa = (index, campo, valor) => {
    const nuevasEtapas = [...datosProyecto.etapas];
    nuevasEtapas[index] = {
      ...nuevasEtapas[index],
      [campo]: valor
    };
    setDatosProyecto(prev => ({
      ...prev,
      etapas: nuevasEtapas
    }));
  };

  // Agregar una nueva etapa
  const agregarEtapa = () => {
    const nuevaOrden = datosProyecto.etapas.length + 1;
    setDatosProyecto(prev => ({
      ...prev,
      etapas: [...prev.etapas, { tituloEtapa: "", descripcionEtapa: "", orden: nuevaOrden }]
    }));
  };

  // Eliminar una etapa
  const eliminarEtapa = (index) => {
    if (datosProyecto.etapas.length <= 1) {
      return; // Siempre mantener al menos una etapa
    }

    const nuevasEtapas = datosProyecto.etapas.filter((_, i) => i !== index);

    // Reordenar las etapas restantes
    const etapasReordenadas = nuevasEtapas.map((etapa, i) => ({
      ...etapa,
      orden: i + 1
    }));

    setDatosProyecto(prev => ({
      ...prev,
      etapas: etapasReordenadas
    }));
  };

 // For vinculacion approval, update when the project is created
const enviarProyecto = async () => {
  try {
    // Validar que todas las etapas tengan título
    const etapasInvalidas = datosProyecto.etapas.some(etapa => !etapa.tituloEtapa.trim());
    if (etapasInvalidas) {
      showNotification("Todas las etapas deben tener un título", "warning", "Datos Incompletos");
      return;
    }

    // Formar el objeto exactamente con la estructura requerida por el API
    const datosFormateados = {
      descripcion: datosProyecto.descripcion,
      fechaFin: datosProyecto.fechaFin,
      rfc: datosProyecto.rfc,
      cct: datosProyecto.cct,
      idApoyo: datosProyecto.idApoyo,
      idNecesidad: datosProyecto.idNecesidad,
      etapas: datosProyecto.etapas.map(etapa => ({
        tituloEtapa: etapa.tituloEtapa,
        descripcionEtapa: etapa.descripcionEtapa,
        orden: etapa.orden
      }))
    };

    // Si necesitas el ID de la vinculación, añádelo aquí
    if (vinculacionSeleccionada && vinculacionSeleccionada.id) {
      datosFormateados.idVinculacion = vinculacionSeleccionada.id;
    }

    console.log("Enviando datos:", JSON.stringify(datosFormateados, null, 2));

    // Realizar la llamada POST al endpoint especificado
    const respuesta = await post("/vinculacion/aceptar", datosFormateados);

    console.log("Respuesta del servidor:", respuesta);

    // UPDATE STATE: Remove the vinculacion from the state after it's approved
    setDatosGestionVinculaciones(prevState => {
      const updatedItems = prevState.items.filter(item => {
        // Check if this item corresponds to the approved vinculacion
        if (item.datosOriginales && 
            item.datosOriginales.aliado?.rfc === datosProyecto.rfc &&
            item.datosOriginales.escuela?.cct === datosProyecto.cct &&
            item.datosOriginales.necesidad?.idNecesidad === datosProyecto.idNecesidad &&
            item.datosOriginales.apoyo?.idApoyo === datosProyecto.idApoyo) {
          return false; // Remove this item
        }
        return true; // Keep this item
      });

      return {
        ...prevState,
        items: updatedItems
      };
    });

    // NUEVO: Enviar notificaciones a la escuela y al aliado
    // 1. Notificación a la escuela
    const notificacionEscuela = {
      cct: datosProyecto.cct,
      titulo: "¡Proyecto creado con éxito!",
      mensaje: `Se ha creado el proyecto "${datosProyecto.descripcion}" para atender su necesidad. Puede revisar los detalles en la sección de proyectos.`
    };

    // 2. Notificación al aliado
    const notificacionAliado = {
      rfc: datosProyecto.rfc,
      titulo: "¡Proyecto en marcha!",
      mensaje: `Se ha creado el proyecto "${datosProyecto.descripcion}" para la vinculación que ofreció. Revise los detalles en su panel de proyectos.`
    };

    // Enviar notificaciones de forma asíncrona
    try {
      await post("/notificacion", notificacionEscuela);
      console.log("Notificación enviada a la escuela");

      await post("/notificacion", notificacionAliado);
      console.log("Notificación enviada al aliado");
    } catch (errorNotificacion) {
      console.error("Error al enviar notificaciones:", errorNotificacion);
      // No bloqueamos la creación del proyecto si fallan las notificaciones
    }

    setProyectosActualizados(prev => prev + 1);3
    
    // Cerrar el modal y mostrar mensaje de éxito
    setMostrarModalEtapas(false);
    showNotification('Proyecto creado exitosamente y notificaciones enviadas', 'success', 'Proyecto Creado');

  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    showNotification(`Error al crear el proyecto: ${error.message || "Revisa la conexión con el servidor"}`, 'danger', 'Error');
  }
};
  // Cerrar la sección de validación activa
  const cerrarValidacion = () => {
    setValidacionActiva(null);
  };

  const handleVerNecesidades = () => {
    console.log("Ver todas las necesidades escolares");
  };

  const handleVerNotificaciones = () => {
    console.log("Ver todas las notificaciones");
    setShowAllNotificationsModal(true);
  };  

  const handleVerOfertas = () => {
    console.log("Ver todas las ofertas de apoyo");
  };

  const handleVerVinculaciones = () => {
    console.log("Ver todas las vinculaciones");
  };

  // Control del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container" id="dashboard">
      {/* Sidebar fijo */}
      <Sidebar
        logo={Logo}
        title="Connect the Schools"
        menuItems={sidebarAdministrador}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      {/* Contenido del dashboard */}
      <div className="main-content">
        <Navbar
          tipoUsuario="Administrador"
          usuario={usuario}
          notificaciones={notificaciones}
          menuItems={menuItems}
        />

        {/* Botón para mostrar sidebar en dispositivos móviles */}
        <button
          className="d-md-none menu-toggle btn btn-sm btn-primary position-fixed"
          style={{ top: '10px', left: '10px', zIndex: 1040 }}
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className="content px-3 py-3">
          <h2 className="mb-4">Dashboard Administrador</h2>

          {/* Cartas estadísticas */}
          <section className="mb-4">
            <StatCardGroup cards={cartasAdministrador} />
          </section>

          {/* Sección de Proyectos y Validaciones Pendientes */}
          <section className="mb-4" id="projects">
            <div className="row" >
              <div className="col-xl-8 col-lg-7">
                <Proyecto
                  titulo={proyectosTitulo}
                  proyectos={proyectos}
                  tipo="admin"
                  textoBoton={proyectosTextoBoton}
                  onButtonClick={null}
                  onViewClick={handleVerDetallesProyecto}
                  onActionClick={handleActionProyecto}
                  allProjects={proyectos}
                />
              </div>
              <div className="col-xl-4 col-lg-5">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Notificaciones</h5>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={handleVerNotificaciones}
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="card-body">
                    {cargandoNotificaciones ? (
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : errorNotificaciones ? (
                      <div className="alert alert-warning" role="alert">
                        {errorNotificaciones}
                      </div>
                    ) : notificacionesTodas.length === 0 ? (
                      <p className="text-muted text-center my-3">No hay notificaciones</p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {notificacionesTodas.slice(0, 2).map((item, index) => (
                          <li
                            className="list-group-item px-0 cursor-pointer"
                            key={index}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-0">{item.titulo}</h6>
                                <small className="text-muted">{item.mensaje || item.descripcion}</small>
                              </div>
                              {item.fechaCreacion && (
                                <small className="text-muted">{new Date(item.fechaCreacion).toLocaleDateString()}</small>
                              )}
                              {item.cantidad && (
                                <span className={`badge bg-${item.color || 'primary'} rounded-pill`}>{item.cantidad}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* ProyectoDetallado - Mostrado justo después de las validaciones y proyectos */}
          {showProjectDetail && selectedProject && (
            <section className="mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Detalle del Proyecto: {selectedProject.nombre}</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleGoBack}
                  >
                    <i className="fas fa-times me-1"></i> Cerrar
                  </button>
                </div>
                <div className="card-body">
                  <ProyectoDetallado
                    proyecto={selectedProject}
                    fases={etapas}
                    evidencias={projectData.evidencias}
                    mensajes={mensajes}
                    documentos={projectData.documentos}
                    onExportReport={handleExportReport}
                    onAddRecord={handleAddRecord}
                    onUpdateProgress={handleUpdateProgress}
                    onUploadEvidence={handleUploadEvidence}
                    onSendMessage={null}
                    onUploadDocument={handleUploadDocument}
                    onGoBack={handleGoBack}
                    onGenerateReport={handleGenerateReport}
                    onSaveChanges={handleSaveChanges}
                    onDownloadDocument={handleDownloadDocument}
                    onViewDocument={handleViewDocument}
                  />
                </div>
              </div>
            </section>
          )}
          {/* Sección expandible de Validación de Proyectos */}
          {validacionActiva === 'proyecto' && (
            <section className="mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Notificaciones</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cerrarValidacion}
                  >
                    <i className="fas fa-times me-1"></i> Cerrar
                  </button>
                </div>
                <div className="card-body">
                  <Notificaciones
                    titulo="Notificaciones"
                    items={notificacionesTodas} // Use the API data
                    tipo="admin"
                    textoBoton="Ver todas"
                    onButtonClick={() => console.log("Ver todas las notificaciones")}
                    apiUrl="/api"
                    idUsuario={usuario?.id}
                    hideTitulo={true} // Hide title in component since we have one in the card header
                  />
                </div>
              </div>
            </section>
          )}

          {/* Validación de Usuarios */}
          {validacionActiva === 'usuario' && (
            <section className="mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Validación de Usuarios</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cerrarValidacion}
                  >
                    <i className="fas fa-times me-1"></i> Cerrar
                  </button>
                </div>
                <div className="card-body">
                  <p>Contenido para validación de usuarios...</p>
                </div>
              </div>
            </section>
          )}

          {/* GESTIONES - Cada gestión en su propia sección */}
          <h4 className="mb-3 mt-5">Gestiones del Sistema</h4>

          {/* Gestión de Necesidades */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12" id="needs">
                <Gestiones
                  titulo={datosGestionNecesidades.titulo}
                  items={datosGestionNecesidades.items}
                  textoBoton={datosGestionNecesidades.textoBoton}
                  onButtonClick={handleVerNecesidades}
                  onVerDetalles={(item) => {
                    if (item && item.datosOriginales) {
                      handleVerDetalles(item.datosOriginales, "necesidad");
                    } else {
                      handleVerDetalles(item, "necesidad");
                    }
                  }}
                  onAprobar={(item) => {
                    if (item && item.datosOriginales) {
                      handleAprobarNecesidad(item.datosOriginales);
                    } else {
                      handleAprobarNecesidad(item);
                    }
                  }}
                  onRechazar={(item) => {
                    if (item && item.datosOriginales) {
                      handleRechazarNecesidad(item.datosOriginales);
                    } else {
                      handleRechazarNecesidad(item);
                    }
                  }}
                  tipo="admin"
                  mostrarAcciones={true}
                />
              </div>
            </div>
          </section>

          {/* Gestión de Apoyos */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12" id="supports">
                <Gestiones
                  titulo={datosGestionApoyos.titulo}
                  items={datosGestionApoyos.items}
                  textoBoton={datosGestionApoyos.textoBoton}
                  onButtonClick={handleVerOfertas}
                  onVerDetalles={(item) => {
                    if (item && item.datosOriginales) {
                      handleVerDetalles(item.datosOriginales, "apoyo");
                    } else {
                      handleVerDetalles(item, "apoyo");
                    }
                  }}
                  onAprobar={(item) => {
                    if (item && item.datosOriginales) {
                      handleAprobarApoyo(item.datosOriginales);
                    } else {
                      handleAprobarApoyo(item);
                    }
                  }}
                  onRechazar={(item) => {
                    if (item && item.datosOriginales) {
                      handleRechazarApoyo(item.datosOriginales);
                    } else {
                      handleRechazarApoyo(item);
                    }
                  }}
                  tipo="admin"
                  mostrarAcciones={true}
                />
              </div>
            </div>
          </section>

          {/* Gestión de Vinculaciones */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12" id="matches">
                <Gestiones
                  titulo={datosGestionVinculaciones.titulo}
                  items={datosGestionVinculaciones.items}
                  textoBoton={datosGestionVinculaciones.textoBoton}
                  onButtonClick={handleVerVinculaciones}
                  onVerDetalles={(item) => {
                    if (item && item.datosOriginales) {
                      handleVerDetalles(item.datosOriginales, "vinculacion");
                    } else {
                      handleVerDetalles(item, "vinculacion");
                    }
                  }}
                  onAprobar={(item) => {
                    if (item && item.datosOriginales) {
                      handleAprobarVinculacion(item.datosOriginales);
                    } else {
                      handleAprobarVinculacion(item);
                    }
                  }}
                  onRechazar={(item) => {
                    if (item && item.datosOriginales) {
                      handleRechazarVinculacion(item.datosOriginales);
                    } else {
                      handleRechazarVinculacion(item);
                    }
                  }}
                  tipo="vinculacion"
                  mostrarAcciones={true}
                  mostrarFiltros={false}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Modal para mostrar detalles - REEMPLAZA EL MODAL EXISTENTE CON ESTE */}
        {mostrarModal && detalleSeleccionado && (
          <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                <h4>{
                  tipoDetalle === "vinculacion"
                    ? (detalleSeleccionado.necesidad?.categoria || detalleSeleccionado.categoria || "Vinculación")
                    : (detalleSeleccionado.categoria || detalleSeleccionado.titulo || "Detalle")
                }</h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                {/* Título y badges para todos los tipos */}
                <h4>{detalleSeleccionado.categoria || detalleSeleccionado.titulo}</h4>

                <div className="mb-3">
                  <Badge bg="danger" className="me-2">
                    Categoría: {
                      tipoDetalle === "vinculacion"
                        ? (detalleSeleccionado.necesidad?.categoria || 'No especificada')
                        : (detalleSeleccionado.categoria || 'No especificada')
                    }
                  </Badge>
                  <Badge bg="success">
                    Subcategoría: {
                      tipoDetalle === "vinculacion"
                        ? (detalleSeleccionado.necesidad?.subcategoria || 'No especificada')
                        : (detalleSeleccionado.subcategoria || 'No especificada')
                    }
                  </Badge>
                  {detalleSeleccionado.prioridad && (
                    <Badge bg="warning" className="ms-2">
                      Prioridad: {detalleSeleccionado.prioridad}
                    </Badge>
                  )}
                </div>

                {/* Contenido específico según el tipo de detalle */}
                {tipoDetalle === "necesidad" && (
                  <>
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Información de la Necesidad</h6>
                      </div>
                      <div className="card-body">
                        <p><strong>Descripción:</strong> {detalleSeleccionado.descripcion || "Sin descripción"}</p>
                        <p><strong>Estado:</strong> {detalleSeleccionado.estadoValidacion === 1 ? "No aprobado" :
                          detalleSeleccionado.estadoValidacion === 2 ? "Pendiente" : "Aprobada"}</p>

                        {/* Fecha de creación con icono */}
                        <div className="mt-3">
                          <i className="fas fa-calendar-alt me-2 text-muted"></i>
                          <strong>Fecha de creación:</strong> {
                            detalleSeleccionado.fechaCreacion ? new Date(detalleSeleccionado.fechaCreacion).toLocaleString() :
                              '01/01/2025'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Usuario relacionado con la necesidad */}
                    {detalleSeleccionado.usuario && (
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Usuario</h6>
                        </div>
                        <div className="card-body">
                          <p><strong>Nombre:</strong> {detalleSeleccionado.usuario.nombre || "No especificado"}</p>
                          <p><strong>Email:</strong> {detalleSeleccionado.usuario.email || "No especificado"}</p>
                          <p><strong>Rol:</strong> {detalleSeleccionado.usuario.rol || "No especificado"}</p>
                        </div>
                      </div>
                    )}

                    {/* Escuela relacionada si está disponible */}
                    {detalleSeleccionado.escuela && (
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Escuela</h6>
                        </div>
                        <div className="card-body">
                          <p><strong>CCT:</strong> {detalleSeleccionado.escuela.cct || "No especificado"}</p>
                          <p><strong>Nombre:</strong> {detalleSeleccionado.escuela.nombre || "No especificado"}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {tipoDetalle === "apoyo" && (
                  <>
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Información del Apoyo</h6>
                      </div>
                      <div className="card-body">
                        <p><strong>Descripción:</strong> {detalleSeleccionado.descripcion || "Sin descripción"}</p>
                        <p><strong>Estado:</strong> {detalleSeleccionado.estadoValidacion === 1 ? "No aprobado" :
                          detalleSeleccionado.estadoValidacion === 2 ? "Pendiente" : "Aprobada"}</p>

                        {/* Fecha de creación con icono */}
                        <div className="mt-3">
                          <i className="fas fa-calendar-alt me-2 text-muted"></i>
                          <strong>Fecha de creación:</strong> {
                            detalleSeleccionado.fechaCreacion ? new Date(detalleSeleccionado.fechaCreacion).toLocaleString() :
                              '01/01/2025'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Usuario relacionado con el apoyo */}
                    {detalleSeleccionado.usuario && (
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Usuario</h6>
                        </div>
                        <div className="card-body">
                          <p><strong>Nombre:</strong> {detalleSeleccionado.usuario.nombre || "No especificado"}</p>
                          <p><strong>Email:</strong> {detalleSeleccionado.usuario.email || "No especificado"}</p>
                          <p><strong>Rol:</strong> {detalleSeleccionado.usuario.rol || "No especificado"}</p>
                        </div>
                      </div>
                    )}

                    {/* Aliado relacionado si está disponible */}
                    {detalleSeleccionado.aliado && (
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Aliado</h6>
                        </div>
                        <div className="card-body">
                          <p><strong>RFC:</strong> {detalleSeleccionado.aliado.rfc || "No especificado"}</p>
                          <p><strong>Razón Social:</strong> {detalleSeleccionado.aliado.razonSocial || "No especificado"}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {tipoDetalle === "vinculacion" && (
                  <>
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Escuela</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>CCT:</strong> {detalleSeleccionado.escuela?.cct}</p>
                            <p><strong>Nivel Educativo:</strong> {detalleSeleccionado.escuela?.nivelEducativo}</p>
                            <p><strong>Sector:</strong> {detalleSeleccionado.escuela?.sector}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Estudiantes:</strong> {detalleSeleccionado.escuela?.numeroEstudiantes}</p>
                            <p><strong>Director:</strong> {detalleSeleccionado.escuela?.nombreDirector}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Aliado</h6>
                      </div>
                      <div className="card-body">
                        <p><strong>RFC:</strong> {detalleSeleccionado.aliado?.rfc}</p>
                        <p><strong>Razón Social:</strong> {detalleSeleccionado.aliado?.razonSocial}</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Necesidad</h6>
                          </div>
                          <div className="card-body">
                            <p><strong>Categoría:</strong> {detalleSeleccionado.necesidad?.categoria}</p>
                            <p><strong>Subcategoría:</strong> {detalleSeleccionado.necesidad?.subcategoria}</p>
                            <p><strong>Descripción:</strong> {detalleSeleccionado.necesidad?.descripcion}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Apoyo</h6>
                          </div>
                          <div className="card-body">
                            <p><strong>Categoría:</strong> {detalleSeleccionado.apoyo?.categoria}</p>
                            <p><strong>Subcategoría:</strong> {detalleSeleccionado.apoyo?.subcategoria}</p>
                            <p><strong>Descripción:</strong> {detalleSeleccionado.apoyo?.descripcion}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {detalleSeleccionado.observacion && (
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Observación</h6>
                        </div>
                        <div className="card-body">
                          <p>{detalleSeleccionado.observacion}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              {tipoDetalle === "vinculacion" && (
                <>
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      setMostrarModal(false);
                      handleAprobarVinculacion(detalleSeleccionado);
                    }}
                  >
                    <i className="fas fa-check me-2"></i>
                    Crear Proyecto
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setMostrarModal(false);
                      handleRechazarVinculacion(detalleSeleccionado);
                    }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Rechazar Vinculación
                  </Button>
                </>
              )}
              {tipoDetalle === "necesidad" && (
                <>
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      setMostrarModal(false);
                      handleAprobarNecesidad(detalleSeleccionado);
                    }}
                  >
                    <i className="fas fa-check me-2"></i>
                    Aprobar
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setMostrarModal(false);
                      handleRechazarNecesidad(detalleSeleccionado);
                    }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Rechazar
                  </Button>
                </>
              )}
              {tipoDetalle === "apoyo" && (
                <>
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      setMostrarModal(false);
                      handleAprobarApoyo(detalleSeleccionado);
                    }}
                  >
                    <i className="fas fa-check me-2"></i>
                    Aprobar
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setMostrarModal(false);
                      handleRechazarApoyo(detalleSeleccionado);
                    }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Rechazar
                  </Button>
                </>
              )}
              <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        
        {/* Modal para mostrar todas las notificaciones */}
        <Modal 
          show={showAllNotificationsModal} 
          onHide={() => setShowAllNotificationsModal(false)}
          size="lg"
          aria-labelledby="notificacionesModalLabel"
        >
          <Modal.Header closeButton>
            <Modal.Title id="notificacionesModalLabel">Todas las Notificaciones</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            {cargandoNotificaciones ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : errorNotificaciones ? (
              <div className="alert alert-warning" role="alert">
                {errorNotificaciones}
              </div>
            ) : notificacionesTodas.length === 0 ? (
              <p className="text-muted text-center my-3">No hay notificaciones</p>
            ) : (
              <ul className="list-group list-group-flush">
                {notificacionesTodas.map((item, index) => (
                  <li
                    className="list-group-item cursor-pointer"
                    key={index}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{item.titulo}</h6>
                        <p className="mb-1">{item.mensaje || item.descripcion}</p>
                      </div>
                      {item.fechaCreacion && (
                        <small className="text-muted">{new Date(item.fechaCreacion).toLocaleDateString()}</small>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAllNotificationsModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal para crear proyecto con etapas dinámicas */}
        {mostrarModalEtapas && vinculacionSeleccionada && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Proyecto de Vinculación</h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModalEtapas(false)}></button>
                </div>

                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="descripcion" className="form-label">Descripción del Proyecto</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        value={datosProyecto.descripcion}
                        onChange={handleCambioDatosProyecto}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="fechaFin" className="form-label">Fecha de Finalización</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaFin"
                        name="fechaFin"
                        value={datosProyecto.fechaFin}
                        onChange={handleCambioDatosProyecto}
                        required
                      />
                    </div>

                    <hr className="my-4" />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Etapas del Proyecto</h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={agregarEtapa}
                      >
                        <i className="fas fa-plus me-1"></i> Agregar Etapa
                      </button>
                    </div>

                    {datosProyecto.etapas.map((etapa, index) => (
                      <div key={index} className="card mb-3 p-3 border-secondary">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Etapa {etapa.orden}</h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarEtapa(index)}
                            disabled={datosProyecto.etapas.length <= 1}
                          >
                            <i className="fas fa-times"></i> Eliminar
                          </button>
                        </div>

                        <div className="mb-3">
                          <label htmlFor={`titulo-${index}`} className="form-label">Título de la Etapa</label>
                          <input
                            type="text"
                            className="form-control"
                            id={`titulo-${index}`}
                            value={etapa.tituloEtapa}
                            onChange={(e) => handleCambioEtapa(index, 'tituloEtapa', e.target.value)}
                            placeholder="Ej: Planeación, Ejecución, Evaluación..."
                            required
                          />
                        </div>

                        <div className="mb-2">
                          <label htmlFor={`descripcion-${index}`} className="form-label">Descripción de la Etapa</label>
                          <textarea
                            className="form-control"
                            id={`descripcion-${index}`}
                            value={etapa.descripcionEtapa}
                            onChange={(e) => handleCambioEtapa(index, 'descripcionEtapa', e.target.value)}
                            placeholder="Descripción detallada de la etapa..."
                            rows="2"
                            required
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </form>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModalEtapas(false)}>Cancelar</button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={enviarProyecto}
                    disabled={datosProyecto.etapas.some(e => !e.tituloEtapa.trim())}
                  >
                    Crear Proyecto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section>
          <h2 className="mb-4" id="map">Mapa de escuelas</h2>
          <div className="map-container">
            <MapaGoogle tipo="admin" />
          </div>
        </section>
        <Toast 
          show={notification.show}
          onClose={() => setNotification({...notification, show: false})}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            minWidth: '250px',
            zIndex: 9999
          }}
          delay={10000}
          autohide
          bg={notification.type}
          className="text-white"
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">{notification.title}</strong>
          </Toast.Header>
          <Toast.Body>
            {notification.message}
          </Toast.Body>
        </Toast>
      </div>
    </div>
  );
};

export default Administrador;
