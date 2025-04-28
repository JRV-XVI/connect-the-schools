import React, { useState, useEffect } from "react";
import { get } from '../api.js'
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Pendientes from "../components/pendientes.jsx";
import { pendientesAdministrador, proyectosPendientes } from '../data/pendientes/pendientesAdministrador.js';
import Proyecto from "../components/proyectos.jsx";
import Gestiones from "../components/gestiones.jsx";
import { StatCardGroup } from "../components/cartas.jsx";
import { sidebarAdministrador } from "../data/barraLateral/barraLateralAdministrador.js";
import { navbarAdministrador } from "../data/barraNavegacion/barraNavegacionAdministrador.js";
import { cartasAdministrador } from "../data/cartas/cartasAdministrador.js";
import { proyectosAdministrador } from '../data/proyectos/proyectosAdministrador.js';
// Removemos las importaciones que pueden estar causando problemas
// import { gestionUsuarios } from '../data/gestiones/gestionUsuarios.js';
// import { gestionNecesidades } from '../data/gestiones/gestionNecesidades.js';
// import { gestionApoyos } from '../data/gestiones/gestionApoyos.js';
// import { gestionVinculaciones } from '../data/gestiones/gestionVinculaciones.js';
import Logo from "../assets/MPJ.png";
import { string } from "prop-types";

const Administrador = () => {
  // Estado para controlar qué tipo de validación se está mostrando (proyecto, usuario, etc.)
  const [validacionActiva, setValidacionActiva] = useState(null);
  const usuario = navbarAdministrador?.usuario || { nombre: "Administrador", foto: "" };
  const notificaciones = navbarAdministrador?.notificaciones || [];
  const menuItems = navbarAdministrador?.menuItems || [];
  const [datosGestionNecesidades, setDatosGestionNecesidades] = useState({});
  const [datosGestionApoyos, setDatosGestionApoyos] = useState({});
  const [datosGestionVinculaciones, setDatosGestionVinculaciones] = useState({});

  const [mostrarModalEtapas, setMostrarModalEtapas] = useState(false);
  const [vinculacionSeleccionada, setVinculacionSeleccionada] = useState(null);
  const [datosProyecto, setDatosProyecto] = useState({
    descripcion: "",
    fechaFin: "",
    etapas: [
      { tituloEtapa: "", descripcionEtapa: "", orden: 1 }
    ]
  });

  useEffect(() => {
    async function fetchDatosNecesidades() {
      try {
        const datos = await get("/necesidades");
        console.log("Datos necesidades:", datos); // Debug log
  
        const datosAdaptados = {
          titulo: "Necesidades Escolares",
          textoBoton: "Ver todas las necesidades",
          items: datos.map(item => ({
            titulo: item.categoria || "Sin categoría",
            descripcion: item.descripcion || "Sin descripción",
            estado: item.estadoValidacion === 1 ? "No aprobado" : (item.estadoValidacion === 2 ? "Pendiente" : "Aprobada"),
            cantidad: item.prioridad != null ? String(item.prioridad) : "0",
            color: "primary",
            datosOriginales: item  // Add this line to preserve original data
          }))
        };
  
        setDatosGestionNecesidades(datosAdaptados);
      } catch (error) {
        console.error("Error al obtener datos de necesidades:", error);
      }
    }
  
    fetchDatosNecesidades();
  }, []);

  useEffect(() => {
    async function fetchDatosApoyos() {
      try {
        const datos = await get("/apoyos");
        console.log("Datos apoyos:", datos); // Debug log
  
        const datosAdaptados = {
          titulo: "Ofertas de Apoyo",
          textoBoton: "Ver todas las ofertas",
          items: datos.map(item => ({
            titulo: item.categoria || "Sin categoría",
            descripcion: item.descripcion || "Sin descripción",
            estado: item.estadoValidacion === 1 ? "No aprobado" : (item.estadoValidacion === 2 ? "Pendiente" : "Aprobada"),
            cantidad: item.prioridad != null ? String(item.prioridad) : "0",
            color: "secondary",
            datosOriginales: item  // Add this line to preserve original data
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
          textoBoton: "Ver todas las vinculaciones",
          items: datos.map(item => ({
            titulo: item.necesidad.categoria || "Sin categoría",
            descripcion: item.observacion || "Sin descripción",
            categoria: item.necesidad.subcategoria,
            cantidad: item.prioridad != null ? String(item.prioridad) : "0", // lo convierto a string para mantener mismo tipo que tus dummys
            color: "secondary", // Aquí también puedes mapear colores si lo deseas
            datosOriginales: item
          }))
        };

        setDatosGestionVinculaciones(datosAdaptados);
      } catch (error) {
        console.error("Error al obtener datos de apoyos:", error);
      }
    }

    fetchDatosVinculaciones();
  }, []); // Este useEffect también solo se ejecuta una vez al cargar el componente

  // Obtenemos todos los pendientes para el dashboard
  const pendientesTodos = pendientesAdministrador?.items || [];

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

  // Manejadores para pendientes y proyectos
  const handleVerPendientes = () => {
    console.log("Ver todos los pendientes");
    // Al hacer clic en "Ver todos los pendientes", mostrar la sección de validación
    setMostrarValidacionProyectos(true);
  };

  const handleVerProyectos = () => {
    console.log("Ver todos los proyectos");
  };

  const handleVerDetallesProyecto = (proyecto) => {
    console.log("Ver detalles del proyecto:", proyecto.nombre);
  };

  const handleActionProyecto = (proyecto) => {
    console.log("Acción en proyecto:", proyecto.nombre, "Estado:", proyecto.estado);
  };

    // Funciones para manejar las etapas (agregar después de tus otros manejadores)
  
  const handleAprobarVinculacion = (vinculacion) => {
    console.log("Aprobando vinculación:", vinculacion);
    setVinculacionSeleccionada(vinculacion);
    
    // Inicializar el formulario con datos predeterminados pero solo con una etapa vacía
    setDatosProyecto({
      descripcion: `Proyecto: ${vinculacion.necesidad?.categoria || ''} - ${vinculacion.apoyo?.categoria || ''}`,
      fechaFin: obtenerFechaFinPredeterminada(),
      etapas: [
        { tituloEtapa: "", descripcionEtapa: "", orden: 1 }
      ]
    });
    
    setMostrarModalEtapas(true);
  };
  
  // Función auxiliar para obtener una fecha predeterminada (6 meses desde hoy)
  const obtenerFechaFinPredeterminada = () => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 6);
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
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
  
  // Enviar los datos del proyecto al backend
  const enviarProyecto = async () => {
    try {
      // Validar que todas las etapas tengan título
      const etapasInvalidas = datosProyecto.etapas.some(etapa => !etapa.tituloEtapa.trim());
      if (etapasInvalidas) {
        alert('Todas las etapas deben tener un título');
        return;
      }
  
      console.log("Enviando datos del proyecto:", JSON.stringify(datosProyecto, null, 2));
      
      // Aquí iría tu llamada al backend
      // const respuesta = await post('/proyectos', {
      //   idVinculacion: vinculacionSeleccionada.id,
      //   ...datosProyecto
      // });
      
      // Cerrar el modal y mostrar mensaje de éxito
      setMostrarModalEtapas(false);
      alert('Proyecto creado exitosamente');
      
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      alert('Error al crear el proyecto. Por favor, inténtelo de nuevo.');
    }
  };
  
  // Manejadores para validaciones de pendientes
  const handlePendienteClick = (item, index) => {
    if (item.tipo === 'proyecto') {
      // Si ya está activo, lo desactivamos (toggle)
      setValidacionActiva(validacionActiva === 'proyecto' ? null : 'proyecto');
    } else if (item.tipo === 'usuario') {
      setValidacionActiva(validacionActiva === 'usuario' ? null : 'usuario');
    } else if (item.tipo === 'documento') {
      setValidacionActiva(validacionActiva === 'documento' ? null : 'documento');
    }
    // Puedes agregar más tipos según sea necesario
  };

  // Cerrar la sección de validación activa
  const cerrarValidacion = () => {
    setValidacionActiva(null);
  };

  // Manejador para validación de proyectos
  const handleProyectoValidado = (data, isApproved) => {
    console.log(`Proyecto ${isApproved ? 'aprobado' : 'rechazado'}:`, data);
    // Aquí podrías actualizar la lista de proyectos pendientes después de validar
  };

  // Nuevos manejadores para gestiones
  const handleVerGestionUsuarios = () => {
    console.log("Ver todos los usuarios pendientes");
  };

  const handleVerNecesidades = () => {
    console.log("Ver todas las necesidades escolares");
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
    <div className="dashboard-container">
      {/* Sidebar fijo */}
      <Sidebar
        logo={Logo}
        title="Connect the Schools"
        menuItems={sidebarAdministrador}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
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
          <section className="mb-4">
            <div className="row">
              <div className="col-xl-8 col-lg-7">
                <Proyecto
                  titulo={proyectosTitulo}
                  proyectos={proyectosItems}
                  tipo="admin"
                  textoBoton={proyectosTextoBoton}
                  onButtonClick={handleVerProyectos}
                  onViewClick={handleVerDetallesProyecto}
                  onActionClick={handleActionProyecto}
                  allProjects={proyectosTodos}
                />
              </div>
              <div className="col-xl-4 col-lg-5">
                {/* Componente de validaciones pendientes actualizado */}
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Validaciones Pendientes</h5>
                    {pendientesAdministrador?.textoBoton && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => console.log("Ver todas las validaciones")}
                      >
                        {pendientesAdministrador.textoBoton}
                      </button>
                    )}
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      {pendientesTodos.map((item, index) => (
                        <li
                          className="list-group-item px-0 cursor-pointer"
                          key={index}
                          onClick={() => handlePendienteClick(item, index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">{item.titulo}</h6>
                              <small className="text-muted">{item.descripcion}</small>
                            </div>
                            <span className={`badge bg-${item.color || 'primary'} rounded-pill`}>{item.cantidad}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección expandible de Validación de Proyectos */}
          {validacionActiva === 'proyecto' && (
            <section className="mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Validación de Proyectos</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cerrarValidacion}
                  >
                    <i className="fas fa-times me-1"></i> Cerrar
                  </button>
                </div>
                <div className="card-body">
                  <Pendientes
                    titulo={proyectosPendientes.titulo}
                    items={proyectosPendientes.items}
                    tipo="proyecto"
                    badgeText={proyectosPendientes.badgeText}
                    badgeColor={proyectosPendientes.badgeColor}
                    textoBoton={proyectosPendientes.textoBoton}
                    onButtonClick={() => console.log("Ver todos los proyectos pendientes")}
                    apiUrl={proyectosPendientes.apiUrl || "/api/v1"}
                    onValidate={handleProyectoValidado}
                    fullHeight={false}
                    hideTitulo={true} // Ocultar título ya que está en el card-header
                  />
                </div>
              </div>
            </section>
          )}

          {/* Implementar otras secciones de validación según sea necesario */}
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
                  {/* Aquí se implementaría el componente para validar usuarios */}
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
              <div className="col-12">
                <Gestiones
                  titulo={datosGestionNecesidades.titulo}
                  items={datosGestionNecesidades.items}
                  textoBoton={datosGestionNecesidades.textoBoton}
                  onButtonClick={handleVerNecesidades}
                  onVerDetalles={(item) => {
                    if (item && item.datosOriginales) {
                      handleVerDetalles(item.datosOriginales, "necesidad");
                    } else {
                      // Fallback to the item itself if datosOriginales is not available
                      handleVerDetalles(item, "necesidad");
                    }
                  }}
                  tipo="admin"
                />
              </div>
            </div>
          </section>

          {/* Gestión de Apoyos */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12">
                <Gestiones
                  titulo={datosGestionApoyos.titulo}
                  items={datosGestionApoyos.items}
                  textoBoton={datosGestionApoyos.textoBoton}
                  onButtonClick={handleVerOfertas}
                  onVerDetalles={(item) => {
                    if (item && item.datosOriginales) {
                      handleVerDetalles(item.datosOriginales, "apoyo");
                    } else {
                      // Fallback to the item itself if datosOriginales is not available
                      handleVerDetalles(item, "apoyo");
                    }
                  }}
                  tipo="admin"
                />
              </div>
            </div>
          </section>

          {/* Gestión de Vinculaciones */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12">
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
                  tipo="admin"
                  mostrarAcciones={true}
                />
              </div>
            </div>
          </section>
        </div>
        
        {/* Modal para mostrar detalles - CORRECTAMENTE POSICIONADO */}
        {mostrarModal && detalleSeleccionado && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {tipoDetalle === "necesidad" ? "Detalle de Necesidad" : 
                     tipoDetalle === "apoyo" ? "Detalle de Apoyo" : "Detalle de Vinculación"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
                </div>
                    
                <div className="modal-body">
                  {/* Contenido condicional según el tipo de detalle */}
                  {tipoDetalle === "necesidad" && (
                    <>
                      <h6>Información de la Necesidad</h6>
                      <p><strong>Categoría:</strong> {detalleSeleccionado.categoria || "No especificado"}</p>
                      <p><strong>Subcategoría:</strong> {detalleSeleccionado.subcategoria || "No especificado"}</p>
                      <p><strong>Descripción:</strong> {detalleSeleccionado.descripcion || "Sin descripción"}</p>
                      <p><strong>Prioridad:</strong> {detalleSeleccionado.prioridad || "No especificada"}</p>
                      <p><strong>Estado:</strong> {detalleSeleccionado.estadoValidacion === 1 ? "No aprobado" : 
                                                detalleSeleccionado.estadoValidacion === 2 ? "Pendiente" : "Aprobada"}</p>
                      
                      {/* Usuario relacionado con la necesidad */}
                      {detalleSeleccionado.usuario && (
                        <>
                          <h6 className="mt-3">Usuario</h6>
                          <p><strong>Nombre:</strong> {detalleSeleccionado.usuario.nombre || "No especificado"}</p>
                          <p><strong>Email:</strong> {detalleSeleccionado.usuario.email || "No especificado"}</p>
                          <p><strong>Rol:</strong> {detalleSeleccionado.usuario.rol || "No especificado"}</p>
                        </>
                      )}
                      
                      {/* Escuela relacionada si está disponible */}
                      {detalleSeleccionado.escuela && (
                        <>
                          <h6 className="mt-3">Escuela</h6>
                          <p><strong>CCT:</strong> {detalleSeleccionado.escuela.cct || "No especificado"}</p>
                          <p><strong>Nombre:</strong> {detalleSeleccionado.escuela.nombre || "No especificado"}</p>
                        </>
                      )}
                    </>
                  )}
                  
                  {tipoDetalle === "apoyo" && (
                    <>
                      <h6>Información del Apoyo</h6>
                      <p><strong>Categoría:</strong> {detalleSeleccionado.categoria || "No especificado"}</p>
                      <p><strong>Subcategoría:</strong> {detalleSeleccionado.subcategoria || "No especificado"}</p>
                      <p><strong>Descripción:</strong> {detalleSeleccionado.descripcion || "Sin descripción"}</p>
                      <p><strong>Prioridad:</strong> {detalleSeleccionado.prioridad || "No especificada"}</p>
                      <p><strong>Estado:</strong> {detalleSeleccionado.estadoValidacion === 1 ? "No aprobado" : 
                                                detalleSeleccionado.estadoValidacion === 2 ? "Pendiente" : "Aprobada"}</p>
                      
                      {/* Usuario relacionado con el apoyo */}
                      {detalleSeleccionado.usuario && (
                        <>
                          <h6 className="mt-3">Usuario</h6>
                          <p><strong>Nombre:</strong> {detalleSeleccionado.usuario.nombre || "No especificado"}</p>
                          <p><strong>Email:</strong> {detalleSeleccionado.usuario.email || "No especificado"}</p>
                          <p><strong>Rol:</strong> {detalleSeleccionado.usuario.rol || "No especificado"}</p>
                        </>
                      )}
                      
                      {/* Aliado relacionado si está disponible */}
                      {detalleSeleccionado.aliado && (
                        <>
                          <h6 className="mt-3">Aliado</h6>
                          <p><strong>RFC:</strong> {detalleSeleccionado.aliado.rfc || "No especificado"}</p>
                          <p><strong>Razón Social:</strong> {detalleSeleccionado.aliado.razonSocial || "No especificado"}</p>
                        </>
                      )}
                    </>
                  )}
                  
                  {tipoDetalle === "vinculacion" && (
                    <>
                      <h6>Escuela</h6>
                      <p><strong>CCT:</strong> {detalleSeleccionado.escuela?.cct}</p>
                      <p><strong>Nivel Educativo:</strong> {detalleSeleccionado.escuela?.nivelEducativo}</p>
                      <p><strong>Sector:</strong> {detalleSeleccionado.escuela?.sector}</p>
                      <p><strong>Estudiantes:</strong> {detalleSeleccionado.escuela?.numeroEstudiantes}</p>
                      <p><strong>Director:</strong> {detalleSeleccionado.escuela?.nombreDirector}</p>

                      <h6>Aliado</h6>
                      <p><strong>RFC:</strong> {detalleSeleccionado.aliado?.rfc}</p>
                      <p><strong>Razón Social:</strong> {detalleSeleccionado.aliado?.razonSocial}</p>

                      <h6>Necesidad</h6>
                      <p><strong>Categoría:</strong> {detalleSeleccionado.necesidad?.categoria}</p>
                      <p><strong>Subcategoría:</strong> {detalleSeleccionado.necesidad?.subcategoria}</p>
                      <p><strong>Descripción:</strong> {detalleSeleccionado.necesidad?.descripcion}</p>

                      <h6>Apoyo</h6>
                      <p><strong>Categoría:</strong> {detalleSeleccionado.apoyo?.categoria}</p>
                      <p><strong>Subcategoría:</strong> {detalleSeleccionado.apoyo?.subcategoria}</p>
                      <p><strong>Descripción:</strong> {detalleSeleccionado.apoyo?.descripcion}</p>

                      <h6>Observación</h6>
                      <p>{detalleSeleccionado.observacion}</p>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

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

      </div>
    </div>
  );
};

export default Administrador;