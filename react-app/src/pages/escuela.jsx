import React, { useState } from "react";
import Sidebar from "../components/barraLateral.jsx";
import Navbar from "../components/barraNavegacion.jsx";
import Pendientes from "../components/pendientes.jsx";
import Proyecto from "../components/proyectos.jsx";
import NecesidadApoyo from "../components/necesidadApoyo.jsx";
import DiagnosticoNecesidades from '../components/DiagnosticoNecesidades'; // Ruta corregida
import MapaEscuelas from "../components/mapasEscuela.jsx";
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
import MapaGoogle from "../components/mapaGoogle.jsx";


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

  // Estado para necesidades y sección activa - Importante: iniciar en 'dashboard'
  const [necesidades, setNecesidades] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

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
        tipo: mapearCategoriaATipo(nec.categoria) // 🔥 función que mapea
      }));
      
      setNecesidades(necesidadesConTipo);
    } catch (error) {
      console.error("[ERROR] Error al cargar necesidades escolares:", error.response?.data || error.message);
    }
  };

  fetchNecesidades();
}, [userData?.idUsuario]); // <-- se ejecuta cuando el usuario ya esté disponible

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
    console.log("Cambiando a sección:", section); // Debug para verificar cambios de sección
    setActiveSection(section);
  };

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
  
  // Nuevos manejadores para necesidades escolares (componente NecesidadApoyo)
  const handleAddNecesidad = () => {
    console.log("Agregar nueva necesidad escolar");
    setActiveSection('diagnostico');
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
  
  // Manejadores para DiagnosticoNecesidades
  const handleAddNeed = async (newNeed) => {
    try {
      const payload = {
        descripcion: newNeed.descripcion,
        prioridad: newNeed.prioridad,
        idCategoria: newNeed.idCategoria,
        idSubcategoria: newNeed.idSubcategoria,
        idUsuario: userData?.idUsuario, // <-- muy importante: ID del usuario escuela que está logueado
      };
  
      console.log("[INFO] Enviando necesidad:", payload);
  
      const response = await axios.post('http://localhost:4001/api/usuarionecesidadApoyo', payload, {
        withCredentials: true
      });
  
      console.log("[SUCCESS] Necesidad creada:", response.data);
  
      // Actualizar lista local
      const id = `need-${Date.now()}`;
      setNecesidades([...necesidades, { id, ...newNeed }]);
  
      alert('¡Necesidad registrada exitosamente!');
  
    } catch (error) {
      console.error("[ERROR] Al crear necesidad:", error.response?.data || error.message);
      alert('Error al registrar necesidad. Verifica los campos.');
    }
  };

  const handleEditNeed = (needId) => {
    console.log("Editando necesidad con ID:", needId);
  };

  const handleViewNeed = (needId) => {
    console.log("Viendo detalles de necesidad con ID:", needId);
  };
  
  // Control del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Debug para verificar el estado actual
  console.log("Estado actual: activeSection =", activeSection);
  console.log("Necesidades disponibles:", necesidades.length);
  
  return (
    <div className="dashboard-container">
      {/* Sidebar fijo - Asegurarse de pasar correctamente las props */}
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
        
        {/* Contenido del dashboard - IMPORTANTE: incluir test buttons para depurar */}
        <div className="content px-3 py-3">
          {/* Botones de prueba para cambiar secciones directamente */}
          <div className="mb-3 p-2 bg-light">
            <button className="btn btn-sm btn-outline-dark me-2" onClick={() => setActiveSection('dashboard')}>
              Dashboard
            </button>
            <button className="btn btn-sm btn-outline-dark me-2" onClick={() => setActiveSection('diagnostico')}>
              Diagnóstico
            </button>
            <span className="ms-3 badge bg-secondary">Sección activa: {activeSection}</span>
          </div>
          
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
                  <MapaGoogle />
                </Container>
              </section>
            </>
          )}
          
          {/* IMPORTANTE: Verificar que esta condición se evalúa correctamente */}
          {activeSection === 'diagnostico' && (
            <>
              <h2 className="mb-4">Diagnóstico de Necesidades</h2>
              <DiagnosticoNecesidades
                necesidades={necesidades}
                onAddNeed={handleAddNeed}
                onEditNeed={handleEditNeed}
                onViewNeed={handleViewNeed}
                idUsuario={userData?.idUsuario}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Escuela;