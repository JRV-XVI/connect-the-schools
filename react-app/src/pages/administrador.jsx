import React, { useState } from "react";
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

const Administrador = () => { 
  // Estado para controlar qué tipo de validación se está mostrando (proyecto, usuario, etc.)
  const [validacionActiva, setValidacionActiva] = useState(null);

  const usuario = navbarAdministrador?.usuario || { nombre: "Administrador", foto: "" };
  const notificaciones = navbarAdministrador?.notificaciones || [];
  const menuItems = navbarAdministrador?.menuItems || [];

  // Datos locales para las gestiones
  const datosGestionUsuarios = {
    titulo: "Gestión de Usuarios",
    textoBoton: "Ver catálogo completo",
    items: [
      {
        titulo: "Nuevos Registros",
        descripcion: "Escuelas y aliados pendientes de validación",
        cantidad: "12",
        color: "warning"
      },
      {
        titulo: "Documentación Escolar",
        descripcion: "Documentos para validar",
        cantidad: "8",
        color: "danger"
      },
      {
        titulo: "Nuevas Vinculaciones",
        descripcion: "Matches esperando aprobación",
        cantidad: "5",
        color: "primary"
      },
      {
        titulo: "Evidencias Subidas",
        descripcion: "Documentos de implementación",
        cantidad: "3",
        color: "secondary"
      }
    ]
  };

  const datosGestionNecesidades = {
    titulo: "Necesidades Escolares",
    textoBoton: "Ver todas las necesidades",
    items: [
      {
        titulo: "Infraestructura",
        descripcion: "Reparaciones y mejoras de instalaciones",
        cantidad: "7",
        color: "success"
      },
      {
        titulo: "Equipamiento Tecnológico",
        descripcion: "Computadoras, proyectores y equipos",
        cantidad: "10",
        color: "primary"
      },
      {
        titulo: "Material Didáctico",
        descripcion: "Libros y recursos educativos",
        cantidad: "6",
        color: "info"
      },
      {
        titulo: "Capacitación Docente",
        descripcion: "Formación para profesores",
        cantidad: "4",
        color: "warning"
      }
    ]
  };

  const datosGestionApoyos = {
    titulo: "Ofertas de Apoyo",
    textoBoton: "Ver todas las ofertas",
    items: [
      {
        titulo: "Donación de Equipos",
        descripcion: "Equipos de cómputo para laboratorios",
        cantidad: "3",
        color: "success"
      },
      {
        titulo: "Capacitaciones",
        descripcion: "Talleres para docentes y alumnos",
        cantidad: "5",
        color: "info"
      },
      {
        titulo: "Fondos para Infraestructura",
        descripcion: "Patrocinios para mejoras escolares",
        cantidad: "2",
        color: "warning"
      },
      {
        titulo: "Voluntariado",
        descripcion: "Servicios profesionales pro-bono",
        cantidad: "8",
        color: "primary"
      }
    ]
  };

  const datosGestionVinculaciones = {
    titulo: "Vinculaciones",
    textoBoton: "Gestionar vinculaciones",
    items: [
      {
        titulo: "Pendientes de Aprobación",
        descripcion: "Vinculaciones en espera de validación",
        cantidad: "6",
        color: "warning"
      },
      {
        titulo: "En Implementación",
        descripcion: "Proyectos actualmente en curso",
        cantidad: "15",
        color: "primary"
      },
      {
        titulo: "Finalizadas Recientemente",
        descripcion: "Vinculaciones completadas este mes",
        cantidad: "4",
        color: "success"
      },
      {
        titulo: "Con Retrasos",
        descripcion: "Proyectos con retrasos críticos",
        cantidad: "3",
        color: "danger"
      }
    ]
  };

// Obtenemos todos los pendientes para el dashboard
  const pendientesTodos = pendientesAdministrador?.items || [];

  // Obtenemos todos los proyectos y los limitamos a 3 para el dashboard
  const proyectosTodos = proyectosAdministrador?.proyectos || [];
  const proyectosItems = proyectosTodos.slice(0, 3);
  const proyectosTitulo = proyectosAdministrador?.titulo || "Proyectos Recientes";
  const proyectosTextoBoton = proyectosAdministrador?.textoBoton || "Ver todos";

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
          
          {/* Gestión de Usuarios */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12">
                <Gestiones 
                  titulo={datosGestionUsuarios.titulo}
                  items={datosGestionUsuarios.items}
                  textoBoton={datosGestionUsuarios.textoBoton}
                  onButtonClick={handleVerGestionUsuarios}
                  tipo="admin"
                />
              </div>
            </div>
          </section>
          
          {/* Gestión de Necesidades */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12">
                <Gestiones 
                  titulo={datosGestionNecesidades.titulo}
                  items={datosGestionNecesidades.items}
                  textoBoton={datosGestionNecesidades.textoBoton}
                  onButtonClick={handleVerNecesidades}
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
                  tipo="admin"
                />
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default Administrador;