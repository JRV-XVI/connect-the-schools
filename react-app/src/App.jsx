import React, { useState } from "react";
import Administrador from "./pages/administrador.jsx";
import Aliado from "./pages/aliado.jsx";
import Escuela from "./pages/escuela.jsx";
import InicioSesion from "./pages/inicioSesion.jsx"; // Importamos el componente de inicio de sesión
import 'bootstrap/dist/css/bootstrap.min.css'; // Importante: añadimos Bootstrap CSS
import '../styles/styles.css';

function App() {
  // Cambiamos el estado inicial a null para indicar que no hay sesión iniciada
  const [userRole, setUserRole] = useState(null); // null (no autenticado), 'admin', 'aliado' o 'escuela'
  const [userData, setUserData] = useState(null);

  // Manejador de inicio de sesión que recibirá las credenciales del formulario
  const handleLogin = (credentials) => {
    console.log("Intentando iniciar sesión con:", credentials);
    
    // Simulamos autenticación - esto normalmente sería una llamada a la API
    if (credentials && credentials.email) {
      // Determinamos el rol basado en el correo (simulación)
      let role;
      if (credentials.email.includes('admin')) {
        role = 'admin';
      } else if (credentials.email.includes('aliado')) {
        role = 'aliado';
      } else if (credentials.email.includes('escuela')) {
        role = 'escuela';
      } else {
        // Por defecto para pruebas
        role = 'aliado';
      }

      // Establecemos el rol y datos del usuario
      setUserRole(role);
      setUserData({
        nombre: `Usuario ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: credentials.email
      });
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
  };

  // Renderiza el componente apropiado basado en el estado de autenticación y el rol
  const renderView = () => {
    // Si no hay usuario autenticado, mostramos la página de inicio de sesión
    if (userRole === null) {
      return <InicioSesion onLogin={handleLogin} />;
    }

    // Si el usuario está autenticado, mostramos su vista según su rol
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
      
      {/* Panel de pruebas - Mejorado con estilos Bootstrap */}
      <div className="role-buttons" style={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20, 
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        {userRole === null ? (
          // Opciones cuando no hay sesión iniciada
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
          // Opciones cuando hay sesión iniciada
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