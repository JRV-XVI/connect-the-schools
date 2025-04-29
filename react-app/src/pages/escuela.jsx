import React, { useState } from "react";
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Pendientes from "../components/pendientes.jsx";
import Proyecto from "../components/proyectos.jsx";
import NecesidadApoyo from "../components/necesidadApoyo.jsx";
import ProyectoDetallado from '../components/proyectoDetallado.jsx'; 
import { useEffect } from "react";

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


const Escuela = ({ userData, onLogout }) => { 
  const usuario = navbarEscuela?.usuario || { nombre: "Escuela", foto: "" };
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

// Cargar datos del proyecto cuando se selecciona uno
useEffect(() => {
  const fetchProjectDetails = async () => {
    if (!selectedProject) return;
    
    try {
      // Aquí normalmente cargarías datos del backend
      // Por ahora simulamos datos de ejemplo
      setProjectData({
        fases: [
          {
            nombre: "Fase de Planificación",
            fechaInicio: "2025-03-01",
            fechaFin: "2025-03-15",
            estado: "Completado",
            entregables: [
              { nombre: "Plan de proyecto", estado: "completado" },
              { nombre: "Presupuesto inicial", estado: "completado" }
            ]
          },
          {
            nombre: "Fase de Implementación",
            fechaInicio: "2025-03-16",
            fechaFin: "2025-04-30",
            estado: "En Progreso",
            progreso: 40,
            entregables: [
              { nombre: "Instalación de equipo", estado: "en progreso" },
              { nombre: "Capacitación inicial", estado: "pendiente" }
            ]
          },
          {
            nombre: "Fase de Cierre",
            fechaInicio: "2025-05-01",
            fechaFin: "2025-05-15",
            estado: "Pendiente",
            entregables: [
              { nombre: "Informe final", estado: "pendiente" },
              { nombre: "Evaluación de resultados", estado: "pendiente" }
            ]
          }
        ],
        evidencias: [
          {
            titulo: "Reunión inicial",
            descripcion: "Primera reunión con el equipo directivo",
            fecha: "2025-03-03",
            imagen: "https://via.placeholder.com/300x200?text=Reunión+Inicial",
            fase: "Planificación"
          }
        ],
        mensajes: [
          {
            remitente: "Coordinador MPJ",
            contenido: "Buen día, ¿cómo va el avance del proyecto?",
            fecha: "2025-03-20",
            hora: "09:30",
            esPropio: false
          },
          {
            contenido: "Estamos en proceso de instalación del equipo, todo va según lo planeado",
            fecha: "2025-03-20",
            hora: "10:15",
            esPropio: true
          }
        ],
        documentos: [
          {
            nombre: "Plan de Proyecto.pdf",
            tipo: "pdf",
            categoria: "Documentación",
            fase: "Planificación",
            autor: "Coordinador MPJ",
            fecha: "2025-03-05",
            tamaño: "2.3 MB"
          },
          {
            nombre: "Presupuesto Inicial.xlsx",
            tipo: "excel",
            categoria: "Financiero",
            fase: "Planificación",
            autor: "Administración Escuela",
            fecha: "2025-03-10",
            tamaño: "1.1 MB"
          }
        ]
      });
    } catch (error) {
      console.error("[ERROR] Error al cargar detalles del proyecto:", error.response?.data || error.message);
    }
  };
  
  fetchProjectDetails();
}, [selectedProject]);

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

  const handleVerProyectos = () => {
    console.log("Ver todos los proyectos");
    setActiveSection('proyectos');
  };

  const handleVerDetallesProyecto = (proyecto) => {
    console.log("Ver detalles del proyecto:", proyecto.nombre);
    setSelectedProject(proyecto);
    setShowProjectDetail(true);
  };

  const handleActionProyecto = (proyecto) => {
    console.log("Acción en proyecto:", proyecto.nombre, "Estado:", proyecto.estado);
  };
  
  // Manejadores para el componente ProyectoDetallado
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

  const handleSendMessage = (mensaje) => {
    console.log("Enviando mensaje para el proyecto:", selectedProject?.nombre, mensaje);
    
    // Actualizar los mensajes localmente
    const newMessage = {
      contenido: mensaje,
      fecha: new Date().toISOString(),
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
      esPropio: true
    };
    
    setProjectData(prev => ({
      ...prev,
      mensajes: [...prev.mensajes, newMessage]
    }));
  };

  const handleUploadDocument = () => {
    console.log("Subiendo documento para el proyecto:", selectedProject?.nombre);
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
                      proyectos={proyectosItems}
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
              {showProjectDetail && selectedProject && (
                <section className="mb-4">
                  <ProyectoDetallado
                    proyecto={selectedProject}
                    fases={projectData.fases}
                    evidencias={projectData.evidencias}
                    mensajes={projectData.mensajes}
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