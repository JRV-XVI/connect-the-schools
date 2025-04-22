import React, { useState } from "react";
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Pendientes from "../components/pendientes.jsx";
import Proyecto from "../components/proyectos.jsx";
import NecesidadApoyo from "../components/necesidadApoyo.jsx"; // Nuevo componente importado
import { StatCardGroup } from "../components/cartas.jsx"; 
import { sidebarEscuela } from "../data/barraLateral/barraLateralEscuela.js";
import { navbarEscuela } from "../data/barraNavegacion/barraNavegacionEscuela.js";
import { cartasEscuela } from "../data/cartas/cartasEscuela.js"; 
import { pendientesEscuela } from '../data/pendientes/pendientesEscuela.js';
import { proyectosEscuela } from '../data/proyectos/proyectosEscuela.js';
// Importación de los datos para el componente NecesidadApoyo
import { tabsNecesidades, columnasNecesidades, datosNecesidades } from '../data/necesidadApoyo/necesidades.js';
import Logo from "../assets/MPJ.png";

const Escuela = () => { 
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

  // Manejadores para pendientes y proyectos
  const handleVerPendientes = () => {
    console.log("Ver todos los pendientes");
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
  
  // Nuevos manejadores para necesidades escolares
  const handleAddNecesidad = () => {
    console.log("Agregar nueva necesidad escolar");
    // Aquí implementarías la lógica para mostrar el formulario de nueva necesidad
  };

  const handleEditNecesidad = (item) => {
    console.log("Editar necesidad escolar:", item);
    // Aquí implementarías la lógica para editar la necesidad seleccionada
  };

  const handleViewNecesidad = (item) => {
    console.log("Ver detalles de necesidad escolar:", item);
    // Aquí implementarías la lógica para mostrar los detalles de la necesidad
  };

  const handleToggleStatus = (item) => {
    console.log("Cambiar estado de necesidad escolar:", item);
    // Aquí implementarías la lógica para activar/desactivar la necesidad
  };

  const handleVerHistorial = () => {
    console.log("Ver historial de necesidades escolares");
    // Aquí implementarías la lógica para mostrar el historial completo
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
          <h2 className="mb-4">Dashboard Escuela</h2>
          
          {/* Cartas estadísticas */}
          <section className="mb-4">
            <StatCardGroup cards={cartasEscuela} />
          </section>
          
          {/* Sección de Proyectos y Pendientes */}
          <section className="mb-4">
            <div className="row">
              <div className="col-xl-8 col-lg-7">
                {/* Componente de Proyectos - Limitado a 3 */}
                <Proyecto 
                  titulo={proyectosTitulo}
                  proyectos={proyectosItems}
                  tipo="escuela"
                  textoBoton={proyectosTextoBoton}
                  onButtonClick={handleVerProyectos}
                  onViewClick={handleVerDetallesProyecto}
                  onActionClick={handleActionProyecto}
                  allProjects={proyectosTodos} // Lista completa para el modal
                />
              </div>
              <div className="col-xl-4 col-lg-5">
                {/* Componente de Pendientes - Limitado a 5 */}
                <Pendientes 
                  titulo={pendientesTitulo}
                  items={pendientesItems}
                  tipo="escuela"
                  textoBoton={pendientesTextoBoton}
                  onButtonClick={handleVerPendientes}
                  allItems={pendientesTodos} // Lista completa para el modal
                />
              </div>
            </div>
          </section>
          
          {/* NUEVA SECCIÓN: Gestión de necesidades escolares */}
          <section>
            <NecesidadApoyo 
              tipo="necesidad"
              titulo="Gestión de Necesidades Escolares"
              tabs={tabsNecesidades}
              datos={datosNecesidades}
              columnas={columnasNecesidades}
              onAdd={handleAddNecesidad}
              onEdit={handleEditNecesidad}
              onView={handleViewNecesidad}
              onToggleStatus={handleToggleStatus}
              onHistory={handleVerHistorial}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Escuela;