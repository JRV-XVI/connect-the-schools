import React, { useState, useEffect, useMemo } from "react";
import { get, post } from "../api.js";
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Pendientes from "../components/pendientes.jsx";
import Proyecto from "../components/proyectos.jsx";
import axios from "axios";
// Reemplazamos NecesidadApoyo por el nuevo componente
import OfertaApoyo from "../components/OfertaApoyo.jsx";
import Busqueda from "../components/busqueda.jsx";
import ProyectoDetallado from "../components/proyectoDetallado.jsx";
import { StatCardGroup } from "../components/cartas.jsx";
import { sidebarAliado } from "../data/barraLateral/barraLateralAliado.js";
import { navbarAliado } from "../data/barraNavegacion/barraNavegacionAliado.js";
import { cartasAliado } from "../data/cartas/cartasAliado.js";
import { pendientesAliado } from '../data/pendientes/pendientesAliado.js';
import { proyectosAliado } from '../data/proyectos/proyectosAliado.js';
// Mantenemos la importación para migrar los datos iniciales
import { tabsApoyos, columnasApoyos, datosApoyos } from '../data/necesidadApoyo/apoyos.js';
import { escuelasData, opcionesFiltros, apoyosDisponiblesAliado } from '../data/busqueda/busquedaEscuelas.js';
import { proyectoDetallado } from '../data/proyectoDetallado/proyectoDetallado.js';
import Logo from "../assets/MPJ.png";
import MapaGoogle from "../components/mapaGoogle.jsx";

const Aliado = ({ userData, onLogout }) => {
  const usuario = userData || { nombre: "Aliado", foto: "" };
  const notificaciones = navbarAliado?.notificaciones || [];
  const menuItems = navbarAliado?.menuItems || [];

  // Obtenemos todos los pendientes y los limitamos a 4 para el dashboard
  const pendientesTodos = pendientesAliado?.items || [];
  const pendientesItems = pendientesTodos.slice(0, 5);
  const pendientesTitulo = pendientesAliado?.titulo || "Validaciones Pendientes";
  const pendientesTextoBoton = pendientesAliado?.textoBoton || "Ver todos los pendientes";

  // PROYECTOS / ETAPAS / MENSAJES / VINCULACIONES -> VARIABLES
  const [proyectos, setProyectos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [vinculaciones, setVInculaciones] = useState([]);

  const proyectosTodos = proyectosAliado?.proyectos || [];
  const proyectosItems = proyectosTodos.slice(0, 3);
  const proyectosTitulo = "Proyectos Recientes";
  const proyectosTextoBoton = proyectosAliado?.textoBoton || "Ver todos";

  // Estados para el componente de búsqueda
  const [resultadosBusqueda, setResultadosBusqueda] = useState(escuelasData);
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);

  // Configuración de paginación
  const escuelasPorPagina = 3;
  const totalPaginas = Math.ceil(resultadosBusqueda.length / escuelasPorPagina);

  // Obtener escuelas para la página actual
  const escuelasPaginaActual = resultadosBusqueda.slice(
    (paginaActual - 1) * escuelasPorPagina,
    paginaActual * escuelasPorPagina
  );

  // Estados para el componente ProyectoDetallado
  const [mostrarProyectoDetallado, setMostrarProyectoDetallado] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const { proyecto, fases, evidencias, documentos } = proyectoDetallado; // Datos Dummie

  //-------------------------------//
  //---------RENDER DATOS---------//
  //-----------------------------//

  // Obtener proyectos del usuario logeado
  useEffect(() => {
    fetchProyectos();
  }, [usuario.idUsuario]);

  useEffect(() => {
    fetchVinculaciones();
  }, [usuario?.idUsuario]);

  //-------------------------------//
  //------------------------------//
  //-----------------------------//

  // MODIFICADO: Función auxiliar para mapear categorías antiguas a nuevos tipos
  const mapearCategoriaATipo = (categoria) => {
    switch (categoria) {
      case "Infraestructura": return "material";
      case "Formación": return "servicios";
      case "Materiales": return "material";
      case "Financiero": return "economico";
      case "Voluntariado": return "voluntariado";
      default: return "material";
    }
  };

  // SIMPLIFICADO: Procesamiento de datos de apoyos eliminando campos no necesarios
  const procesarDatosApoyos = () => {
    // Verificar si datosApoyos es un array
    if (Array.isArray(datosApoyos)) {
      // Usar flatMap si datosApoyos es un array
      return datosApoyos.flatMap(categoria => {
        if (categoria && Array.isArray(categoria.items)) {
          return categoria.items.map(item => ({
            id: item.id || Math.random().toString(36).substr(2, 9),
            titulo: item.titulo || item.nombre || "Apoyo sin título",
            descripcion: item.descripcion || "Sin descripción",
            tipo: mapearCategoriaATipo(categoria.categoria || "material"),
            subcategoria: item.subcategoria || "General",
            estado: item.estado || "Disponible",
            fechaCreacion: item.fecha || new Date().toISOString()
          }));
        }
        return [];
      });
    }
    // Si datosApoyos es un objeto con propiedades
    else if (datosApoyos && typeof datosApoyos === 'object') {
      const resultado = [];

      // Intentar iterar sobre las propiedades del objeto
      Object.keys(datosApoyos).forEach(key => {
        const categoria = datosApoyos[key];
        if (categoria && Array.isArray(categoria.items)) {
          categoria.items.forEach(item => {
            resultado.push({
              id: item.id || Math.random().toString(36).substr(2, 9),
              titulo: item.titulo || item.nombre || "Apoyo sin título",
              descripcion: item.descripcion || "Sin descripción",
              tipo: mapearCategoriaATipo(categoria.categoria || key || "material"),
              subcategoria: item.subcategoria || "General",
              estado: item.estado || "Disponible",
              fechaCreacion: item.fecha || new Date().toISOString()
            });
          });
        }
      });

      return resultado;
    }

    // Si nada funciona, devolver datos de muestra simplificados
    return [
      {
        id: 1,
        titulo: "Donación de equipos informáticos",
        descripcion: "10 computadoras de escritorio para laboratorio de cómputo",
        tipo: "material",
        subcategoria: "Equipamiento tecnológico",
        estado: "Disponible",
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 2,
        titulo: "Taller de programación básica",
        descripcion: "Curso de introducción a la programación para estudiantes",
        tipo: "servicios",
        subcategoria: "Capacitación docente",
        estado: "Disponible",
        fechaCreacion: new Date().toISOString()
      }
    ];
  };

  // CORREGIDO: Usar el método de procesamiento seguro
  const apoyosIniciales = procesarDatosApoyos();

  // Estado para gestionar las ofertas de apoyo
  const [apoyos, setApoyos] = useState([]);

  // Estado para sincronizar con el componente de búsqueda
  const [apoyosDisponibles, setApoyosDisponibles] = useState([
    {
      id: "default",
      titulo: "Cargando apoyos disponibles...",
      tipo: "material",
      descripcion: "Por favor espere mientras se cargan sus apoyos disponibles"
    }
  ]);

  useEffect(() => {
    // Transformar apoyos al formato esperado por el componente Búsqueda con campos correctos
    const apoyosFormateados = apoyos
      // Asegúrate que sólo filtras si realmente quieres excluir algunos
      //.filter(a => a.estado === "Disponible" || a.estadoValidacion === 1)
      .map(a => ({
        id: a.id || a.idNecesidadApoyo,
        titulo: a.titulo || a.descripcion || "Apoyo sin título", // Usar descripción como respaldo
        tipo: a.tipo || mapearCategoriaAliado(a.categoria),
        descripcion: a.descripcion || "",
        categoria: a.categoria || "",
        subcategoria: a.subcategoria || ""
      }));

    console.log("Apoyos formateados disponibles para vinculación:", apoyosFormateados);
    setApoyosDisponibles(apoyosFormateados);
  }, [apoyos]);

  // Resto del código permanece igual...
  const handleVerPendientes = () => {
    console.log("Ver todos los pendientes");
  };

  //-------------------------------------------//
  //---------VINCULACIONES PENDIENTES---------//
  //------------------------------------------//

  const fetchVinculaciones = async () => {
    try {
      const respuesta = await get(`/vinculacion/${usuario.rfc}`)
      setVInculaciones(respuesta);
      console.log("VInculaciones obtenidas: ", respuesta)
    } catch (error) {
      console.log("Error al obtener las vinculaciones", error)
      setVInculaciones([]);
    }
  };

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
          estado: proyecto.validacionAdmin ? 'En tiempo' : 'Pendiente',
          escuela: proyecto.nombreEscuela || 'Escuela asociada',
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

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
  };
  
  const totalAlumnosProyecto = useMemo(() => {
    if (proyectos && proyectos.length > 0) {
      let estudiantes = 0;

      for (let i = 0; i < proyectos.length; i++) {
        estudiantes += Number(proyectos[i].estudiantes);
      }

      console.log("Numero de estudiantes totales: ", estudiantes)
      return estudiantes;
    }
  }, [proyectos]);

  const handleVerProyectos = () => {
    console.log("Ver todos los proyectos");
    setMostrarProyectoDetallado(false);
  };

  const handleVerDetallesProyecto = (proyecto) => {
    console.log("Ver detalles del proyecto:", proyecto.nombre);
    setProyectoSeleccionado(proyecto);
    setMostrarProyectoDetallado(true);

    // Obtener mensajes del proyecto
    console.log("Ver id del proyecto:", proyecto.id);

    fetchMensajes(proyecto.id);
    fetchEtapas(proyecto.id);

    setTimeout(() => {
      const seccionDetalles = document.getElementById('seccionProyectoDetallado');
      if (seccionDetalles) {
        seccionDetalles.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleActionProyecto = (proyecto) => {
    console.log("Acción en proyecto:", proyecto.nombre, "Estado:", proyecto.estado);
  };

  //----------------------------------//
  //---------ETAPAS PROYECTO---------//
  //--------------------------------//

  const fetchEtapas = async (idProyecto) => {
    try {
      const respuesta = await get(`/proyecto/${idProyecto}/etapas`);
      setEtapas(respuesta);
      console.log(`Etapas del proyecto ${idProyecto}`, respuesta)
    } catch (error) {
      console.log("Error al obtener las etapas:", error);
      setEtapas([]);
    }
  };

  //---------------------------------//
  //---------OFERTAS APOYOS---------//
  //-------------------------------//

  // Manejadores para ofertas de apoyo
  const handleAddApoyo = async (nuevaOferta) => {
    try {
      const payload = {
        idUsuario: usuario.idUsuario,
        descripcion: nuevaOferta.descripcion || nuevaOferta.titulo,
        categoria: nuevaOferta.categoria || "Apoyo Material",
        subcategoria: nuevaOferta.subcategoria || "General",
        estadoValidacion: nuevaOferta.estado || 0
      };


      const response = await axios.post('http://localhost:4001/api/apoyos-aliado', payload, {
        withCredentials: true
      });

      console.log("[SUCCESS] Apoyo creado en base:", response.data);


      const apoyoNuevo = {
        id: response.data.idNecesidadApoyo,
        descripcion: response.data.descripcion,
        categoria: response.data.categoria,
        subcategoria: response.data.subcategoria || "General",
        fechaCreacion: response.data.fechaCreacion,
        tipo: mapearCategoriaAliado(response.data.categoria),
        estado: "Disponible"
      };

      setApoyos((prev) => [...prev, apoyoNuevo]);

      alert('¡Oferta de apoyo creada correctamente!');
    } catch (error) {
      console.error("[ERROR] Al crear apoyo:", error.response?.data || error.message);
      alert('Error al guardar apoyo. Inténtalo de nuevo.');
    }
  };



  const handleEditApoyo = (id, apoyoActualizado) => {
    console.log("Editando oferta de apoyo con ID:", id);

    // Verificar si se debe eliminar el apoyo
    if (apoyoActualizado._delete) {
      setApoyos(apoyos.filter(apoyo => apoyo.id !== id));
      alert("Oferta de apoyo eliminada correctamente");
      return;
    }

    // Actualizar el apoyo en el estado
    setApoyos(apoyos.map(apoyo =>
      apoyo.id === id ? { ...apoyo, ...apoyoActualizado } : apoyo
    ));

    alert(`Oferta de apoyo "${apoyoActualizado.titulo}" actualizada correctamente`);
  };

  const handleViewApoyo = (id) => {
    console.log("Viendo detalles de oferta con ID:", id);
    // Lógica para mostrar detalles
  };

  // Manejadores para el componente de búsqueda
  const handleFilterChange = (filtros) => {
    console.log("Filtros aplicados:", filtros);

    setCargandoBusqueda(true);

    setTimeout(() => {
      let resultadosFiltrados = [...escuelasData];

      if (filtros.soloCompatibles) {
        resultadosFiltrados = resultadosFiltrados.filter(
          escuela => escuela.compatibilidad === 'total'
        );
      }

      if (filtros.nivelEducativo) {
        resultadosFiltrados = resultadosFiltrados.filter(
          escuela => escuela.nivelEducativo.toLowerCase() === filtros.nivelEducativo
        );
      }

      setResultadosBusqueda(resultadosFiltrados);
      setPaginaActual(1);
      setCargandoBusqueda(false);
    }, 800);
  };

  const handleMapView = () => {
    console.log("Ver mapa de escuelas");
  };

  const handleVincular = (escuela, formData) => {
    console.log("Vinculando con escuela:", escuela.nombre);
    console.log("Datos del formulario:", formData);

    alert(`Solicitud de vinculación con ${escuela.nombre} enviada correctamente`);
  };

  const handleVerDetalles = (escuela) => {
    console.log("Ver detalles de escuela:", escuela);
  };

  const handlePageChange = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    const seccionBusqueda = document.getElementById('seccionBusqueda');
    if (seccionBusqueda) {
      seccionBusqueda.scrollIntoView({ behavior: 'smooth' });
    }
  };

  //----------------------------//
  //---------MENSAJERIA---------//
  //----------------------------//

  // Obtener todos los mensajes por proyecto
  const fetchMensajes = async (idProyecto) => {
    try {
      // Paso 1: Obtener la mensajería asociada al proyecto
      const mensajerias = await get(`/proyecto/${idProyecto}/mensajeria`);

      // Verificar si se encontraron mensajerías
      if (mensajerias && mensajerias.length > 0) {
        // Paso 2: Obtener los mensajes usando el idMensajeria
        const idMensajeria = mensajerias[0].idMensajeria;
        const respuestaMensajes = await get(`/mensajeria/${idMensajeria}/mensajes`);

        // Paso 3: Transformar los mensajes para el front
        const mensajesFormateados = respuestaMensajes.map(mensaje => {
          const fecha = new Date(mensaje.fechaEnvio);
          return {
            esPropio: mensaje.idUsuario === usuario.idUsuario,
            remitente: mensaje.idUsuario === usuario.idUsuario,
            hora: mensaje.fechaEnvio,
            contenido: mensaje.contenido
          };
        });

        setMensajes(mensajesFormateados);
        console.log(mensajesFormateados);
      } else {
        setMensajes([]);
      }
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      setMensajes([]);
    }
  };

  // Crear mensajes
  const handleSendMessage = async (mensaje, idUsuario) => {
    try {

      const idProyecto = proyectoSeleccionado.id;

      // Obtener la mensajería asociada al proyecto
      const mensajerias = await get(`/proyecto/${idProyecto}/mensajeria`);

      if (mensajerias && mensajerias.length > 0) {
        const idMensajeria = mensajerias[0].idMensajeria;

        // Enviar el mensaje con los datos requeridos
        const datosEnvio = {
          idUsuario: usuario.idUsuario, // ID del usuario actual
          contenido: mensaje
        };

        console.log("Mensaje:", datosEnvio)
        const respuestaEnvio = await post(`/mensajeria/${idMensajeria}/mensajes`, datosEnvio);
        console.log("Mensaje enviado:", respuestaEnvio);

        // Actualizar la lista de mensajes
        fetchMensajes(idProyecto);

        return respuestaEnvio;
      } else {
        throw new Error("No se encontró una mensajería asociada a este proyecto");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      throw error;
    }
  };

  // Refrescar mensajes cada 2 segundos si hay un proyecto seleccionado
  if (proyectoSeleccionado) {
    setTimeout(fetchMensajes, 2000, proyectoSeleccionado.id)
  }

  useEffect(() => {
    const fetchApoyos = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/apoyos-aliado/${usuario.idUsuario}`, {
          withCredentials: true
        });
        console.log("[INFO] Apoyos cargados:", response.data);

        // Inspección detallada de la primera entrada para diagnóstico
        if (response.data.length > 0) {
          console.log("[DEBUG] Primer apoyo - campos disponibles:",
            Object.keys(response.data[0]));
          console.log("[DEBUG] Primer apoyo - estado:",
            response.data[0].estado || response.data[0].estadoValidacion);
        } else {
          console.log("[WARN] No se encontraron apoyos para mostrar");
        }

        const apoyosConTipo = response.data.map(apoyo => ({
          ...apoyo,
          tipo: mapearCategoriaAliado(apoyo.categoria)
        }));

        setApoyos(apoyosConTipo);
      } catch (error) {
        console.error("[ERROR] Error al cargar apoyos:", error.response?.data || error.message);
      }
    };

    fetchApoyos();
  }, [usuario.idUsuario]);

  const mapearCategoriaAliado = (categoria) => {
    if (!categoria) return 'material'; // default

    switch (categoria.toLowerCase()) {
      // Material
      case 'infraestructura':
      case 'equipamiento tecnológico':
      case 'material didáctico':
      case 'mobiliario':
      case 'material bibliográfico':
      case 'material deportivo':
        return 'material';

      // Servicios
      case 'capacitación':
      case 'formación docente':
      case 'formación niñas y niños':
      case 'formación a familias':
      case 'servicios tecnológicos':
      case 'servicios de consultoría':
      case 'mantenimiento':
      case 'rehabilitación de espacios':
        return 'servicios';

      // Económico
      case 'financiero':
      case 'apoyo económico':
      case 'becas estudiantiles':
      case 'apoyo a proyectos escolares':
      case 'financiamiento de mejoras':
      case 'patrocinios':
      case 'donaciones monetarias':
        return 'economico';

      // Voluntariado
      case 'voluntariado':
      case 'clases y talleres':
      case 'asesoría académica':
      case 'actividades culturales':
      case 'mantenimiento y limpieza':
      case 'mentorías':
        return 'voluntariado';

      default:
        return 'material';
    }
  };




  const handleExportReport = () => {
    console.log("Exportando reporte del proyecto");
  };

  const handleAddRecord = () => {
    console.log("Añadiendo nuevo registro al proyecto");
  };

  const handleUpdateProgress = () => {
    console.log("Actualizando progreso del proyecto");
  };

  const handleUploadEvidence = () => {
    console.log("Subiendo nueva evidencia para el proyecto");
  };

  const handleUploadDocument = () => {
    console.log("Subiendo documento para el proyecto");
  };

  const handleGoBack = () => {
    setMostrarProyectoDetallado(false);
  };

  const handleGenerateReport = () => {
    console.log("Generando reporte detallado del proyecto");
  };

  const handleSaveChanges = () => {
    console.log("Guardando cambios en el proyecto");
  };

  const handleDownloadDocument = (documento) => {
    console.log("Descargando documento:", documento.nombre);
  };

  const handleViewDocument = (documento) => {
    console.log("Viendo documento:", documento.nombre);
  };

  // Control del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const cartasAliado = [
    {
      title: "Proyectos activos",
      value: proyectos.length || 0,
      icon: "fa-school",
      color: "success",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Apoyos por validar",
      value: apoyosDisponibles.items?.length || 0,
      icon: "fa-handshake",
      color: "danger",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Vinculaciones disponibles",
      value: vinculaciones.length || 0,
      icon: "fa-diagram-project",
      color: "primary",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Impacto estudiantes",
      value: totalAlumnosProyecto || 0,
      icon: "fa-clipboard-check",
      color: "warning",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    }
  ];

  return (
    <div className="dashboard-container" id="dashboard">
      {/* Sidebar fijo */}
      <Sidebar
        logo={Logo}
        title="Connect the Schools"
        menuItems={sidebarAliado}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      {/* Contenido principal */}
      <div className="main-content">
        {/* Barra de navegación superior */}
        <Navbar
          tipoUsuario="Aliado"
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

        {/* Contenido del dashboard */}
        <div className="content px-3 py-3">
          <h2 className="mb-4">Dashboard Aliado</h2>

          {/* Cartas estadísticas */}
          <section className="mb-4">
            <StatCardGroup cards={cartasAliado} />
          </section>

          {/* Sección de Proyectos y Pendientes */}
          <section className="mb-4">
            <div className="row">
              <div className="col-xl-8 col-lg-7" id="projects">
                {/* Componente de Proyectos - Limitado a 3 */}
                <Proyecto
                  titulo={proyectosTitulo}
                  proyectos={proyectos}
                  tipo="aliado"
                  textoBoton={proyectosTextoBoton}
                  onButtonClick={handleVerProyectos}
                  onViewClick={handleVerDetallesProyecto}
                  onActionClick={handleActionProyecto}
                  allProjects={proyectosTodos}
                />
              </div>
              <div className="col-xl-4 col-lg-5">
                {/* Componente de Pendientes - Limitado a 5 */}
                <Pendientes
                  titulo={pendientesTitulo}
                  items={pendientesItems}
                  tipo="aliado"
                  textoBoton={pendientesTextoBoton}
                  onButtonClick={handleVerPendientes}
                  allItems={pendientesTodos}
                />
              </div>
            </div>
          </section>

          {/* Detalle de Proyecto (condicional) */}
          {mostrarProyectoDetallado && (
            <section id="seccionProyectoDetallado" className="mb-4">
              <ProyectoDetallado
                proyecto={proyectoSeleccionado}
                fases={etapas}
                evidencias={evidencias}
                mensajes={mensajes}
                documentos={documentos}
                onExportReport={handleExportReport}
                onAddRecord={handleAddRecord}
                onUpdateProgress={handleUpdateProgress}
                onUploadEvidence={handleUploadEvidence}
                onSendMessage={handleSendMessage}
                onUploadDocument={handleUploadDocument}
                onGoBack={handleGoBack}
                onGenerateReport={handleGenerateReport}
                onSaveChanges={handleSaveChanges}
                onDownloadDocument={handleDownloadDocument}
                onViewDocument={handleViewDocument}
                userData={userData}
              />
            </section>
          )}

          {/* COMPONENTE REEMPLAZADO: Gestión de ofertas de apoyo */}
          <section className="mb-4" id="supports">
            <OfertaApoyo
              apoyos={apoyos}
              onAddApoyo={handleAddApoyo}
              onEditApoyo={handleEditApoyo}
              onViewApoyo={handleViewApoyo}
            />
          </section>

          <section>
            <h2 className="mb-4" id="map">Mapa de escuelas</h2>
            <div className="map-container">
              <MapaGoogle tipo="escuelas" />
            </div>
          </section>

          {/* Búsqueda de Escuelas */}
          <div id="schools">
            <section id="seccionBusqueda" className="mt-5">
              <Busqueda
                titulo="Búsqueda de Escuelas"
                resultados={escuelasPaginaActual}
                opcionesFiltros={opcionesFiltros}
                onFilterChange={handleFilterChange}
                onMapView={handleMapView}
                onVincular={handleVincular}
                onVerDetalles={handleVerDetalles}
                onPageChange={handlePageChange}
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cargando={cargandoBusqueda}
                apoyosDisponibles={apoyosDisponibles}
                userData={userData}  // Aquí está pasando correctamente userData
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aliado;
