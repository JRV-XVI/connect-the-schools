import React, { useState, useEffect } from "react";
import { Modal, Button, Toast } from 'react-bootstrap';
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Proyecto from "../components/proyectos.jsx";
import NecesidadApoyo from "../components/necesidadApoyo.jsx";
import DiagnosticoNecesidades from '../components/DiagnosticoNecesidades';
import MapaEscuelas from "../components/mapasEscuela.jsx";
import ProyectoDetallado from '../components/proyectoDetallado.jsx'; 
import { get, post } from "../api.js";
import { StatCardGroup } from "../components/cartas.jsx";
import { sidebarEscuela } from "../data/barraLateral/barraLateralEscuela.js";
import { navbarEscuela } from "../data/barraNavegacion/barraNavegacionEscuela.js";
import { cartasEscuela } from "../data/cartas/cartasEscuela.js";
import { proyectosEscuela } from '../data/proyectos/proyectosEscuela.js';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import '../../styles/escuela.css';
import Logo from "../assets/MPJ.png";
import MapaGoogle from "../components/mapaGoogle.jsx";

const Escuela = ({ userData, onLogout }) => { 
  // Add notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success', // 'success', 'warning', 'danger', 'info'
    title: ''
  });

  // Add showNotification function
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

  const usuario = userData || { nombre: "Escuela", foto: "" };
  const notificaciones = navbarEscuela?.notificaciones || [];
  const menuItems = navbarEscuela?.menuItems || [];
  
  // New state for API notifications
  const [notificacionesTodas, setNotificacionesTodas] = useState([]);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false);
  const [errorNotificaciones, setErrorNotificaciones] = useState(null);

  // Manejadores para notificaciones
  const handleVerNotificaciones = () => {
    console.log("Ver todas las notificaciones");
    setShowAllNotificationsModal(true);
  };
  // Obtenemos todos los proyectos y los limitamos a 3 para el dashboard
  const proyectosTodos = proyectosEscuela?.proyectos || [];
  const proyectosTitulo = proyectosEscuela?.titulo || "Proyectos Recientes";
  const proyectosTextoBoton = proyectosEscuela?.textoBoton || "Ver todos";

  // Estado para necesidades y sección activa
  const [necesidades, setNecesidades] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);


  // PROYECTOS / ETAPAS / MENSAJES -> VARIABLES
  const [proyectos, setProyectos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [etapas, setEtapas] = useState([]);

  // Estados para el componente ProyectoDetallado
  const [mostrarProyectoDetallado, setMostrarProyectoDetallado] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  //-------------------------------//
  //---------RENDER DATOS---------//
  //-----------------------------//

  // Obtener proyectos del usuario logeado
  useEffect(() => {
    fetchProyectos();
  }, [usuario.idUsuario]);
  
    // Add this useEffect to fetch notifications
  useEffect(() => {
    const obtenerNotificaciones = async () => {
      if (!userData?.idUsuario) return;
      
      setCargandoNotificaciones(true);
      setErrorNotificaciones(null);
      
      try {
        const datosNotificaciones = await get(`/usuario/${userData.idUsuario}/notificacion`);
        setNotificacionesTodas(datosNotificaciones);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        setErrorNotificaciones("No se pudieron cargar las notificaciones");
      } finally {
        setCargandoNotificaciones(false);
      }
    };
    
    obtenerNotificaciones();
  }, [userData?.idUsuario]); // Re-fetch when user ID changes

  // Estado para el proyecto seleccionado y su detalle
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [projectData, setProjectData] = useState({
    fases: [],
    evidencias: [],
    mensajes: [],
    documentos: []
  });

  const handleNotificacionClick = (item) => {
    console.log("Notificación clickeada:", item);
    // Add any specific actions for notification clicks here
  };

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
      return necesidadesConTipo;
    } catch (error) {
      console.error("[ERROR] Error al cargar necesidades escolares:", error.response?.data || error.message);
      return [];
    }
  };
  
  // Now use this function in your useEffect
  useEffect(() => {
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

  const totalAlumnosProyecto = () => {
    if (proyectos && proyectos.length > 0) {
      let estudiantes = 0;

      for (let i = 0; i < proyectos.length; i++) {
        estudiantes += Number(proyectos[i].estudiantes);
      }

      console.log("Numero de estudiantes totales: ", estudiantes)
      return estudiantes;
    }
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

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
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

const handleEditNecesidad = async (id, necesidadActualizada) => {
  console.log("Editando necesidad escolar con ID:", id);
  
  // Verificar si se debe eliminar la necesidad
  if (necesidadActualizada._delete) {
    try {
      // Determinar el ID correcto para la API
      const idNecesidadApoyo = necesidadActualizada.idNecesidadApoyo || id;
      
      console.log("[DEBUG] Intentando eliminar necesidad con ID:", idNecesidadApoyo);
      
      // Hacer la llamada a la API para eliminar la necesidad
      await axios.delete(`http://localhost:4001/api/necesidadApoyo/${idNecesidadApoyo}`, {
        withCredentials: true
      });
      
      console.log("[SUCCESS] Necesidad eliminada del servidor");
      
      // Eliminar del estado local (mejorado para manejar diferentes formatos de ID)
      setNecesidades(necesidades.filter(necesidad => {
        return necesidad.id !== id && 
               necesidad.idNecesidadApoyo !== id && 
               necesidad.id !== idNecesidadApoyo && 
               necesidad.idNecesidadApoyo !== idNecesidadApoyo;
      }));
      
      // Refetch all needs to ensure the list is in sync with backend
      await fetchNecesidades();
      
      showNotification('Necesidad eliminada correctamente', 'success', 'Eliminación Exitosa');
    } catch (error) {
      console.error("[ERROR] Error al eliminar necesidad:", error.response?.data || error.message);
      console.error("[ERROR] Detalles completos:", error);
      showNotification('Error al eliminar la necesidad: ' + (error.response?.data || error.message), 'danger', 'Error');
    }
    return;
  }
    
    // Si llegamos aquí, es una actualización, no una eliminación
    // Aquí iría la lógica para actualizar la necesidad
    console.log("Actualizando necesidad:", necesidadActualizada);
    
    // Actualizar el estado local
    setNecesidades(necesidades.map(necesidad => 
      necesidad.id === id ? {...necesidad, ...necesidadActualizada} : necesidad
    ));
  };

  const handleViewNecesidad = (item) => {
    console.log("Ver detalles de necesidad escolar:", item);
  };

  // Control del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const cartasEscuela = [
    {
      title: "Necesidades identificadas",
      value: 0,
      icon: "fa-school",
      color: "success",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Cantidad alumnos",
      value: totalAlumnosProyecto() | 0,
      icon: "fa-handshake",
      color: "danger",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Proyectos activos",
      value: proyectosTodos.length || 0, // puedes reemplazar con otro estado real cuando lo tengas
      icon: "fa-diagram-project",
      color: "primary",
      trend: "Calculado dinámicamente",
      isTrendPositive: true
    },
    {
      title: "Vinculaciones disponibles",
      value: 0,
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
        menuItems={sidebarEscuela}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
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
                  <div className="col-xl-8 col-lg-7" id="projects">
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
                          onClick={() => handleNotificacionClick(item, index)}
                          style={{ cursor: 'pointer' }}
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
              <section id="needs">
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
              <section className="mb-4" id="map">
                <h2 className="mb-4">Mapa de aliados</h2>
                <Container className="map-container">
                  <MapaGoogle tipo="escuelas"/>
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
    </div>
  );
};

export default Escuela;
