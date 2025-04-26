import React, { useState, useEffect } from "react";
import { get, post } from "../api.js";
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Pendientes from "../components/pendientes.jsx";
import Proyecto from "../components/proyectos.jsx";
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

const Aliado = () => { 
  const usuario = navbarAliado?.usuario || {idUsuario: 1, nombre: "Aliado", foto: "" };
  const notificaciones = navbarAliado?.notificaciones || [];
  const menuItems = navbarAliado?.menuItems || [];

  // Obtenemos todos los pendientes y los limitamos a 4 para el dashboard
  const pendientesTodos = pendientesAliado?.items || [];
  const pendientesItems = pendientesTodos.slice(0, 5);
  const pendientesTitulo = pendientesAliado?.titulo || "Validaciones Pendientes";
  const pendientesTextoBoton = pendientesAliado?.textoBoton || "Ver todos los pendientes";

  // Obtenemos todos los proyectos y los limitamos a 3 para el dashboard
  const proyectosTodos = proyectosAliado?.proyectos || [];
  const proyectosItems = proyectosTodos.slice(0, 3);
  const proyectosTitulo = proyectosAliado?.titulo || "Proyectos Recientes";
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

  // MODIFICADO: Función auxiliar para mapear categorías antiguas a nuevos tipos
  const mapearCategoriaATipo = (categoria) => {
    switch(categoria) {
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
  const [apoyos, setApoyos] = useState(apoyosIniciales);

  // Estado para sincronizar con el componente de búsqueda
  const [apoyosDisponibles, setApoyosDisponibles] = useState(apoyosDisponiblesAliado);

  // Efecto para mantener sincronizados los apoyos disponibles
  useEffect(() => {
    // Transformar apoyos al formato esperado por el componente Búsqueda
    const apoyosFormateados = apoyos
      .filter(a => a.estado === "Disponible")
      .map(a => ({
        id: a.id,
        titulo: a.titulo,
        tipo: a.tipo,
        descripcion: a.descripcion
      }));
    
    setApoyosDisponibles(apoyosFormateados);
  }, [apoyos]);

  // Resto del código permanece igual...
  const handleVerPendientes = () => {
    console.log("Ver todos los pendientes");
  };

  const handleVerProyectos = () => {
    console.log("Ver todos los proyectos");
    setMostrarProyectoDetallado(false);
  };

  const handleVerDetallesProyecto = (proyecto) => {
    console.log("Ver detalles del proyecto:", proyecto.nombre);
    setProyectoSeleccionado(proyecto);
    setMostrarProyectoDetallado(true);
    
    // Obtener mensajes del proyecto
    console.log("Ver id del proyecto:", proyectoSeleccionado.id);
    fetchMensajes(proyectoSeleccionado.id);
    
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
  
  // Manejadores para ofertas de apoyo - Ya compatible con la versión simplificada
  const handleAddApoyo = (nuevaOferta) => {
    console.log("Agregando nueva oferta:", nuevaOferta);
    // Añadir ID y otros campos necesarios
    const ofertaCompleta = {
      ...nuevaOferta,
      id: apoyos.length + 1,
      fechaCreacion: new Date().toISOString()
    };
    
    // Actualizar estado
    setApoyos([...apoyos, ofertaCompleta]);
    
    // Mostrar notificación de éxito
    alert(`Oferta de apoyo "${ofertaCompleta.titulo}" registrada correctamente`);
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
      apoyo.id === id ? {...apoyo, ...apoyoActualizado} : apoyo
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

  // Manejadores para el componente ProyectoDetallado
  // NUEVO: Manejadores para el componente ProyectoDetallado

  // Todos los mensajes
  const [mensajes, setMensajes] = useState([]);

  // Obtener todos los mensajes por proyecto
  const fetchMensajes = async (idProyecto) => {
    try {
      // Obtener la mensajería asociada al proyecto
      const mensajerias = await get(`/proyecto/${idProyecto}/mensajeria`);
      
      // Verificar si se encontraron mensajerías
      if (mensajerias && mensajerias.length > 0) {
        // Paso 2: Obtener los mensajes usando el idMensajeria
        const idMensajeria = mensajerias[0].idMensajeria;
        const respuestaMensajes = await get(`/mensajeria/${idMensajeria}/mensajes`);
        setMensajes(respuestaMensajes);
      } else {
        setMensajes([]);
      }
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      setMensajes([]);
    }
  };

  const handleSendMessage = async ( mensaje, idUsuario) => {
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
  
  return (
    <div className="dashboard-container">
      {/* Sidebar fijo */}
      <Sidebar
        logo={Logo}
        title="Connect the Schools"
        menuItems={sidebarAliado}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
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
              <div className="col-xl-8 col-lg-7">
                {/* Componente de Proyectos - Limitado a 3 */}
                <Proyecto 
                  titulo={proyectosTitulo}
                  proyectos={proyectosItems}
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
                proyecto={proyecto}
                fases={fases}
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
              />
            </section>
          )}
          
          {/* COMPONENTE REEMPLAZADO: Gestión de ofertas de apoyo */}
          <section className="mb-4">
            <OfertaApoyo
              apoyos={apoyos}
              onAddApoyo={handleAddApoyo}
              onEditApoyo={handleEditApoyo}
              onViewApoyo={handleViewApoyo}
            />
          </section>

          {/* Búsqueda de Escuelas */}
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
              apoyosDisponibles={apoyosDisponibles}  // Ahora usa el estado sincronizado
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Aliado;