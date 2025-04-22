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
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ notifications: {}, user: {} });
  
  const notificationRef = useRef(null);
  const userRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  
  // Función para calcular la posición correcta del dropdown
  const calculateDropdownPosition = () => {
    if (notificationRef.current && notificationDropdownRef.current) {
      const buttonRect = notificationRef.current.getBoundingClientRect();
      const dropdownWidth = notificationDropdownRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      
      // Si el dropdown se sale por la derecha, ajustamos
      if (buttonRect.right - dropdownWidth < 0) {
        setDropdownPosition(prev => ({
          ...prev,
          notifications: { right: 'auto', left: '0' }
        }));
      } else {
        setDropdownPosition(prev => ({
          ...prev,
          notifications: { right: '0', left: 'auto' }
        }));
      }
    }
    
    if (userRef.current && userDropdownRef.current) {
      const buttonRect = userRef.current.getBoundingClientRect();
      const dropdownWidth = userDropdownRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      
      if (buttonRect.right - dropdownWidth < 0) {
        setDropdownPosition(prev => ({
          ...prev,
          user: { right: 'auto', left: '0' }
        }));
      } else {
        setDropdownPosition(prev => ({
          ...prev,
          user: { right: '0', left: 'auto' }
        }));
      }
    }
  };

  // Calcular posiciones al abrir dropdown
  useEffect(() => {
    if (notificationDropdownOpen || userDropdownOpen) {
      calculateDropdownPosition();
    }
  }, [notificationDropdownOpen, userDropdownOpen]);

  // Recalcular al cambiar el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (notificationDropdownOpen || userDropdownOpen) {
        calculateDropdownPosition();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [notificationDropdownOpen, userDropdownOpen]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

            {/* Notifications */}
            {notificaciones.length > 0 && (
              <li className="nav-item dropdown me-3 position-static position-lg-relative" ref={notificationRef}>
                <a 
                  className="nav-link position-relative" 
                  href="#" 
                  role="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    setNotificationDropdownOpen(!notificationDropdownOpen);
                  }}
                  aria-expanded={notificationDropdownOpen}
                  id="notificationDropdown"
                >
                  <i className="fas fa-bell fa-lg"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notificaciones.length > 99 ? '99+' : notificaciones.length}
                  </span>
                </a>
                <div 
                  ref={notificationDropdownRef}
                  className={`dropdown-menu p-0 notification-dropdown ${notificationDropdownOpen ? 'show' : ''}`}
                  style={{
                    position: 'absolute',
                    maxWidth: '320px',
                    width: '100%',
                    ...dropdownPosition.notifications,
                    maxHeight: '80vh',
                    overflow: 'auto'
                  }}
                  aria-labelledby="notificationDropdown"
                >
                  {/* Header para notificaciones - Corregido para mejor alineación */}
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h6 className="mb-0 me-2">Notificaciones</h6>
                    <button 
                      className="btn btn-sm btn-link text-decoration-none p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        onMarkAllRead();
                      }}
                    >
                      <small>Marcar todas como leídas</small>
                    </button>
                  </div>

                  <div className="list-group list-group-flush">
                    {notificaciones.map((notif, idx) => (
                      <a 
                        key={notif.id || idx} 
                        href={notif.url || "#"} 
                        className={`list-group-item list-group-item-action ${notif.unread ? 'unread' : ''}`}
                        onClick={(e) => {
                          if (!notif.url) e.preventDefault();
                          setNotificationDropdownOpen(false);
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {/* Contenedor del icono corregido para ser perfectamente circular */}
                          <div 
                            className={`d-flex align-items-center justify-content-center bg-${notif.color || 'primary'} text-white me-3`}
                            style={{
                              width: '36px', 
                              height: '36px', 
                              borderRadius: '50%',
                              flexShrink: 0
                            }}
                          >
                            <i className={`fas ${notif.icon || 'fa-bell'}`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1"><strong>{notif.title}</strong></p>
                            <p className="mb-1 small">{notif.description}</p>
                            <p className="mb-0 text-muted small">{notif.time}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="p-2 border-top text-center">
                    <a 
                      href="#" 
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        onViewAllNotifications();
                        setNotificationDropdownOpen(false);
                      }}
                    >
                      Ver todas las notificaciones
                    </a>
                  </div>
                </div>
              </li>
            )}

            {/* User - Sin cambios */}
            <li className="nav-item dropdown position-static position-lg-relative" ref={userRef}>
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                role="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setUserDropdownOpen(!userDropdownOpen);
                }}
                aria-expanded={userDropdownOpen}
                id="userDropdown"
              >
                <div className="profile-pic me-2">
                  <img 
                    src={`${usuario.foto || 'https://via.placeholder.com/40x40'}`} 
                    alt={`${usuario.nombre} profile`} 
                    className="img-fluid rounded-circle" 
                    width={40} 
                    height={40}
                  />
                </div>
                <span>{usuario.nombre}</span>
              </a>
              <ul 
                ref={userDropdownRef}
                className={`dropdown-menu ${userDropdownOpen ? 'show' : ''}`} 
                style={{
                  position: 'absolute',
                  ...dropdownPosition.user,
                  maxWidth: '250px',
                  width: '100%'
                }} 
                aria-labelledby="userDropdown"
              >
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    {item.divider ? (
                      <hr className="dropdown-divider" />
                    ) : (
                      <a 
                        className="dropdown-item" 
                        href={item.href || "#"}
                        onClick={(e) => {
                          if (!item.href) e.preventDefault();
                          onMenuItemClick(item);
                          setUserDropdownOpen(false);
                        }}
                      >
                        {item.icon && <i className={`fas ${item.icon} me-2`}></i>}
                        {item.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;