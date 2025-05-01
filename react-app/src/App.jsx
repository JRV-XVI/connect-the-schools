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

    </div>
  );
}

export default App;