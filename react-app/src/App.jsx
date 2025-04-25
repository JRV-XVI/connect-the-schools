import React, { useState, useRef, useEffect } from "react";
import Administrador from "./pages/administrador.jsx";
import Aliado from "./pages/aliado.jsx";
import Escuela from "./pages/escuela.jsx";
import InicioSesion from "./pages/inicioSesion.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // Estado para la posición del panel
  const [panelPosition, setPanelPosition] = useState({ x: 20, y: 20 });
  const panelRef = useRef(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleLogin = (usuario) => {
    console.log("Usuario autenticado:", usuario);

    setUserRole(usuario.rol);
    setUserData(usuario);
};

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
  };

  // Funciones para manejar el arrastre del panel
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    
    // Calcular el desplazamiento desde el punto de clic hasta la esquina del panel
    const rect = panelRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Cambiar el cursor durante el arrastre
    document.body.style.cursor = 'grabbing';
    
    // Prevenir comportamiento predeterminado
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    
    // Calcular la nueva posición basada en la posición del mouse y el offset
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;
    
    // Actualizar la posición del panel
    setPanelPosition({ x: newX, y: newY });
    
    // Prevenir comportamiento predeterminado
    e.preventDefault();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
  };

  // Configurar y limpiar event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const renderView = () => {
    if (userRole === null) {
      return <InicioSesion onLogin={handleLogin} />;
    }

    switch(userRole) {
      case 'admin':
        return <Administrador userData={userData} onLogout={handleLogout} />;
      case 'aliado':
        return <Aliado userData={userData} onLogout={handleLogout} />;
      case 'escuela':
        return <Escuela userData={userData} onLogout={handleLogout} />;
      default:
        return <InicioSesion onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
      
      <div 
        ref={panelRef}
        className="role-buttons" 
        style={{ 
          position: 'fixed',
          left: `${panelPosition.x}px`,
          top: `${panelPosition.y}px`,
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          cursor: isDraggingRef.current ? 'grabbing' : 'grab'
        }}
      >
        {/* Barra de título para arrastrar */}
        <div 
          className="panel-header"
          onMouseDown={handleMouseDown}
          style={{
            padding: '5px',
            marginBottom: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '3px',
            cursor: 'grab',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          ✥ Arrastrar para mover ✥
        </div>
        
        {userRole === null ? (
          <>
            <h6 className="mb-2">Pruebas de inicio de sesión</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={() => handleLogin({email: 'admin@test.com', password: '123456'})}>
                Iniciar como Admin
              </button>
              <button 
                className="btn btn-sm btn-outline-success" 
                onClick={() => handleLogin({email: 'aliado@test.com', password: '123456'})}>
                Iniciar como Aliado
              </button>
              <button 
                className="btn btn-sm btn-outline-info" 
                onClick={() => handleLogin({email: 'escuela@test.com', password: '123456'})}>
                Iniciar como Escuela
              </button>
            </div>
          </>
        ) : (
          <>
            <h6 className="mb-2">Usuario: {userData?.nombre}</h6>
            <div className="d-grid gap-2">
              <button className="btn btn-sm btn-outline-danger mb-2" onClick={handleLogout}>Cerrar sesión</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setUserRole('admin')}>Ver como Admin</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setUserRole('aliado')}>Ver como Aliado</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setUserRole('escuela')}>Ver como Escuela</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;