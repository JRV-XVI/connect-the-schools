import React, { useState } from "react";
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Pendientes from "../components/pendientes.jsx";
import Proyecto from "../components/proyectos.jsx";
import NecesidadApoyo from "../components/necesidadApoyo.jsx";
import DiagnosticoNecesidades from '../components/DiagnosticoNecesidades'; // Ruta corregida
import MapaEscuelas from "../components/mapasEscuela.jsx";
import ProyectoDetallado from '../components/proyectoDetallado.jsx'; 
import { useEffect } from "react";
import { get, post } from "../api.js";

import { StatCardGroup } from "../components/cartas.jsx";
import { sidebarEscuela } from "../data/barraLateral/barraLateralEscuela.js";
import { navbarEscuela } from "../data/barraNavegacion/barraNavegacionEscuela.js";
import { cartasEscuela } from "../data/cartas/cartasEscuela.js";
import { pendientesEscuela } from '../data/pendientes/pendientesEscuela.js';
import { proyectosEscuela } from '../data/proyectos/proyectosEscuela.js';
import { tabsNecesidades, columnasNecesidades, datosNecesidades } from '../data/necesidadApoyo/necesidades.js';
import { necesidadesData } from '../data/necesidadesData';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import '../../styles/escuela.css';
import Logo from "../assets/MPJ.png";
import MapaGoogle from "../components/mapaGoogle.jsx";
import { proyectoDetallado } from '../data/proyectoDetallado/proyectoDetallado.js';

const Escuela = ({ userData, onLogout }) => { 
  const usuario = userData || { nombre: "Escuela", foto: "" };
  const notificaciones = navbarEscuela?.notificaciones || [];
  const menuItems = navbarEscuela?.menuItems || [];
  
  // Obtenemos todos los pendientes y los limitamos a 4 para el dashboard
  const pendientesTodos = pendientesEscuela?.items || [];
  const pendientesItems = pendientesTodos.slice(0, 5); // Limitamos a 5 pendientes
  const pendientesTitulo = pendientesEscuela?.titulo || "Validaciones Pendientes";
  const pendientesTextoBoton = pendientesEscuela?.textoBoton || "Ver todos los pendientes";

  // Obtenemos todos los proyectos y los limitamos a 3 para el dashboard
  const proyectosTodos = proyectosEscuela?.proyectos || [];
  const proyectosItems = proyectosTodos.slice(0, 3); // Limitamos a 3 proyectos
  const proyectosTitulo = proyectosEscuela?.titulo || "Proyectos Recientes";
  const proyectosTextoBoton = proyectosEscuela?.textoBoton || "Ver todos";

  // Estado para necesidades y sección activa
  const [necesidades, setNecesidades] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  // PROYECTOS / ETAPAS / MENSAJES -> VARIABLES
  const [proyectos, setProyectos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [etapas, setEtapas] = useState([]);

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
  
  // Estado para el proyecto seleccionado y su detalle
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [projectData, setProjectData] = useState({
    fases: [],
    evidencias: [],
    mensajes: [],
    documentos: []
  });

useEffect(() => {
  const fetchNecesidades = async () => {
    if (!userData?.idUsuario) return;

    try {
      const response = await axios.get(`http://localhost:4001/api/necesidades-escuela/${userData.idUsuario}`, {
        withCredentials: true
      });
      console.log("[INFO] Necesidades escolares cargadas:", response.data);
      const necesidadesConTipo = response.data.map(nec => ({
        ...nec,
        tipo: mapearCategoriaATipo(nec.categoria)
      }));
      
      setNecesidades(necesidadesConTipo);
    } catch (error) {
      console.error("[ERROR] Error al cargar necesidades escolares:", error.response?.data || error.message);
    }
  };

  fetchNecesidades();
}, [userData?.idUsuario]);

const mapearCategoriaATipo = (categoria) => {
  switch (categoria?.toLowerCase()) {
    case 'infraestructura':
      return 'infraestructura';
    case 'equipamiento tecnológico':
      return 'equipamiento';
    case 'material didáctico':
      return 'material';
    case 'capacitación':
    case 'formación docente':
    case 'formación niñas y niños':
    case 'formación a familias':
      return 'capacitacion';
    default:
      return 'infraestructura'; // O cualquier default
  }
};

  // Función para cambiar entre secciones del dashboard
  const handleSectionChange = (section) => {
    console.log("Cambiando a sección:", section);
    setActiveSection(section);
  };

  // Manejadores para pendientes y proyectos
  const handleVerPendientes = () => {
    console.log("Ver todos los pendientes");
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

  // Refrescar mensajes cada 2 segundos si hay un proyecto seleccionado
  if (proyectoSeleccionado) {
    setTimeout(fetchMensajes, 2000, proyectoSeleccionado.id)
  }

  const handleActionProyecto = (proyecto) => {
    console.log("Acción en proyecto:", proyecto.nombre, "Estado:", proyecto.estado);
  };
  
  // Agregar esta función
  const handleGoBack = () => {
    setMostrarProyectoDetallado(false);
  };

  const handleExportReport = () => {
    console.log("Exportando reporte del proyecto:", proyectoSeleccionado?.nombre);
  };
  
  const handleAddRecord = (record) => {
    console.log("Agregando registro al proyecto:", proyectoSeleccionado?.nombre, record);
  };
  
  const handleUpdateProgress = () => {
    console.log("Actualizando progreso del proyecto:", proyectoSeleccionado?.nombre);
  };
  
  const handleUploadEvidence = () => {
    console.log("Subiendo evidencia para el proyecto:", proyectoSeleccionado?.nombre);
  };
  
  const handleUploadDocument = () => {
    console.log("Subiendo documento para el proyecto:", proyectoSeleccionado?.nombre);
  };
  
  const handleGenerateReport = () => {
    console.log("Generando reporte para el proyecto:", proyectoSeleccionado?.nombre);
  };
  
  const handleSaveChanges = () => {
    console.log("Guardando cambios del proyecto:", proyectoSeleccionado?.nombre);
  };

  const handleDownloadDocument = (documento) => {
    console.log("Descargando documento:", documento.nombre);
  };

  const handleViewDocument = (documento) => {
    console.log("Visualizando documento:", documento.nombre);
  };
  
  // Nuevos manejadores para necesidades escolares (componente NecesidadApoyo)
  const handleAddNecesidad = () => {
    console.log("Agregar nueva necesidad escolar");
  };

  const handleEditNecesidad = (item) => {
    console.log("Editar necesidad escolar:", item);
  };

  const handleViewNecesidad = (item) => {
    console.log("Ver detalles de necesidad escolar:", item);
  };

  const handleToggleStatus = (item) => {
    console.log("Cambiar estado de necesidad escolar:", item);
  };

  const handleVerHistorial = () => {
    console.log("Ver historial de necesidades escolares");
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
        menuItems={sidebarEscuela}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Contenido principal */}
      <div className="main-content">
        {/* Barra de navegación superior */}
        <Navbar 
          tipoUsuario="Escuela"
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
          {/* Dashboard principal */}
          {activeSection === 'dashboard' && (
            <>
              <h2 className="mb-4">Dashboard Escuela</h2>
              
              {/* Cartas estadísticas */}
              <section className="mb-4">
                <StatCardGroup cards={cartasEscuela} />
              </section>
              
              {/* Sección de Proyectos y Pendientes */}
              <section className="mb-4">
                <div className="row">
                  <div className="col-xl-8 col-lg-7">
                    <Proyecto 
                      titulo={proyectosTitulo}
                      proyectos={proyectos}
                      tipo="escuela"
                      textoBoton={proyectosTextoBoton}
                      onButtonClick={handleVerProyectos}
                      onViewClick={handleVerDetallesProyecto}
                      onActionClick={handleActionProyecto}
                      allProjects={proyectosTodos}
                    />
                  </div>
                  <div className="col-xl-4 col-lg-5">
                    <Pendientes 
                      titulo={pendientesTitulo}
                      items={pendientesItems}
                      tipo="escuela"
                      textoBoton={pendientesTextoBoton}
                      onButtonClick={handleVerPendientes}
                      allItems={pendientesTodos}
                    />
                  </div>
                </div>
              </section>
              
              {/* Detalle del proyecto (ahora aparece debajo de proyectos y pendientes) */}
              {mostrarProyectoDetallado && (
                <section id="seccionProyectoDetallado" className="mb-4">
                  <ProyectoDetallado
                    proyecto={proyectoSeleccionado}
                    fases={etapas}
                    evidencias={projectData.evidencias}
                    mensajes={mensajes}
                    documentos={projectData.documentos}
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
              
              {/* NUEVA SECCIÓN: Gestión de necesidades escolares */}
              <section>
                <NecesidadApoyo 
                  necesidades={necesidades}
                  setNecesidades={setNecesidades}
                  onAddNecesidad={handleAddNecesidad}
                  onEditNecesidad={handleEditNecesidad}
                  onViewNecesidad={handleViewNecesidad}
                  userData={userData}
                />
              </section>

              {/* Mapa de Aliados para EScuelas */}
              <section className="mb-4">
                <h2 className="mb-4">Mapa de Escuelas</h2>
                <Container className="map-container">
                  <MapaGoogle tipo="aliados"/>
                </Container>
              </section>
            </>
          )}
          
          {/* Vista de proyectos */}
          {activeSection === 'proyectos' && (
            <>
              <h2 className="mb-4">Proyectos de la Escuela</h2>
              <div className="card">
                <div className="card-body">
                  <Proyecto 
                    titulo="Todos los proyectos"
                    proyectos={proyectosTodos}
                    tipo="escuela"
                    textoBoton="Historial completo"
                    onViewClick={handleVerDetallesProyecto}
                    onActionClick={handleActionProyecto}
                    allProjects={proyectosTodos}
                    fullView={true}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Escuela;