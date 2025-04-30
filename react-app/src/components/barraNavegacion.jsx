import React, { useState, useRef, useEffect } from "react";

const BarraNavegacion = ({ 
  tipoUsuario, 
  usuario = { nombre: "Usuario", foto: "https://via.placeholder.com/40x40" }, 
  notificaciones = [], 
  menuItems = [],
  logo,
  onMarkAllRead = () => {},
  onViewAllNotifications = () => {},
  onMenuItemClick = () => {}
}) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-white shadow-sm px-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          {logo && (
            <a className="navbar-brand me-3" href="#">
              {typeof logo === "string" ? <img src={logo} alt="Logo" height="30" /> : logo}
            </a>
          )}
          <h5 className="mb-0 text-primary">
            Bienvenido, {usuario.nombre || tipoUsuario || "administrador"}
          </h5>
        </div>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={handleNavCollapse}
          aria-controls="navbarContent" 
          aria-expanded={!isNavCollapsed} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div 
          className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} 
          id="navbarContent"
        >
          <ul className="navbar-nav ms-auto align-items-center">
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;