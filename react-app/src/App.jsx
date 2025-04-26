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
  
  // Estado para la posición del panel (arrastre)
  const [panelPosition, setPanelPosition] = useState({ x: 20, y: 20 });
  const panelRef = useRef(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Función para manejar el inicio de sesión
  const handleLogin = (credentials) => {
    console.log("Credenciales ingresadas:", credentials);
    
    // Validación básica (en producción, usa una API)
    if (!credentials.email || !credentials.password) {
      alert("Por favor ingresa email y contraseña");
      return;
    }

    // Determina el rol basado en el email (ejemplo)
    let role;
    if (credentials.email.includes('admin')) {
      role = 'admin';
    } else if (credentials.email.includes('aliado')) {
      role = 'aliado';
    } else if (credentials.email.includes('escuela')) {
      role = 'escuela';
    } else {
      role = 'aliado'; // Rol por defecto
    }

    // Guarda el rol y datos del usuario
    setUserRole(role);
    setUserData({
      nombre: `Usuario ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: credentials.email
    });
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
  };

  // ... (código de arrastre del panel, igual que antes)

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
      
      {/* Panel flotante (solo muestra info del usuario) */}
      {userRole && (
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
          
          <h6 className="mb-2">Usuario: {userData?.nombre}</h6>
          <div className="d-grid gap-2">
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;