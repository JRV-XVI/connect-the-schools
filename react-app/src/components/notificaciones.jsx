import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Componente reutilizable para mostrar notificaciones del usuario
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.titulo - Título del componente (ej: "Notificaciones")
 * @param {Array} props.items - Lista de notificaciones a mostrar (limitada para dashboard)
 * @param {string} props.tipo - Tipo de notificaciones a mostrar ('admin', 'aliado', 'escuela')
 * @param {string} props.badgeText - Texto opcional para mostrar en el badge del título
 * @param {string} props.badgeColor - Color del badge (primary, warning, danger, etc)
 * @param {string} props.textoBoton - Texto para el botón de "ver más" (opcional)
 * @param {Function} props.onButtonClick - Función a ejecutar al hacer clic en el botón
 * @param {boolean} props.fullHeight - Si el componente debe ocupar altura completa (h-100)
 * @param {Array} props.allItems - Lista completa de notificaciones para el modal (opcional)
 * @param {string} props.apiUrl - URL base para las llamadas a la API
 * @param {number} props.idUsuario - ID del usuario para cargar sus notificaciones
 * @param {boolean} props.hideTitulo - Si se debe ocultar el título del componente
 */
const Notificaciones = ({ 
    titulo = "Notificaciones", 
    items = [], 
    badgeText,
    badgeColor = "primary",
    textoBoton,
    onButtonClick = () => {},
    fullHeight = true,
    allItems = null, // Para lista completa
    apiUrl = '/api',
    idUsuario, // Nuevo: ID del usuario para cargar sus notificaciones
    hideTitulo = false
  }) => {
  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);
  // Estado para mostrar mensajes de feedback
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  // Estado para almacenar notificaciones
  const [notificaciones, setNotificaciones] = useState(items);
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Mostrar 5 notificaciones a la vez
  
  // Usar allItems si está disponible, sino usar notificaciones
  const itemsCompletos = allItems || notificaciones;
  
  // Cálculo para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notificaciones.slice(indexOfFirstItem, indexOfLastItem);
  
  // Total de páginas para notificaciones
  const totalPages = Math.ceil(notificaciones.length / itemsPerPage);
  
  // Efecto para cargar notificaciones del usuario si se proporciona idUsuario
  useEffect(() => {
    const cargarNotificaciones = async () => {
      if (!idUsuario) return;
      
      try {
        const response = await axios.get(`http://localhost:4001/api/usuario/${idUsuario}/notificacion`);
        setNotificaciones(response.data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
        setFeedback({
          show: true,
          message: `No se pudieron cargar las notificaciones: ${error.response?.data?.error || error.message}`,
          type: 'danger'
        });
      }
    };
    
    cargarNotificaciones();
  }, [idUsuario, apiUrl]);
  
  // Handlers para paginación
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  
  // Renderizar una notificación estándar
  const renderNotificacion = (item, index) => {
    const fechaFormateada = item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleString() : 'Sin fecha';
    const esNueva = item.leida === false;
    
    return (
      <li 
        className={`list-group-item px-0 ${esNueva ? 'bg-light' : ''}`} 
        key={index}
        onClick={() => marcarComoLeida(item)}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h6 className="mb-0">
            {esNueva && <span className="badge bg-danger me-2">Nueva</span>}
            {item.titulo || "Notificación"}
          </h6>
          <small className="text-muted">{fechaFormateada}</small>
        </div>
        <p className="mb-1">{item.mensaje || "Sin mensaje"}</p>
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={(e) => eliminarNotificacion(e, item)}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </li>
    );
  };

  // Función para marcar una notificación como leída
  const marcarComoLeida = async (notificacion) => {
    if (notificacion.leida) return;
    
    try {
      await axios.put(`${apiUrl}/notificacion/${notificacion.id}/leer`);
      
      // Actualizar el estado local
      setNotificaciones(notificaciones.map(item => 
        item.id === notificacion.id ? {...item, leida: true} : item
      ));
      
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };
  
  // Función para eliminar una notificación
  const eliminarNotificacion = async (e, notificacion) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre
    
    try {
      await axios.delete(`${apiUrl}/notificacion/${notificacion.id}`);
      
      // Actualizar el estado local eliminando la notificación
      setNotificaciones(notificaciones.filter(item => item.id !== notificacion.id));
      
      setFeedback({
        show: true,
        message: "Notificación eliminada correctamente",
        type: "success"
      });
      
      // Auto-esconder el mensaje después de 3 segundos
      setTimeout(() => {
        setFeedback({...feedback, show: false});
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
      setFeedback({
        show: true,
        message: `Error al eliminar la notificación: ${error.response?.data?.error || error.message}`,
        type: "danger"
      });
    }
  };

  // Renderizar controles de paginación
  const renderPaginationControls = () => {
    if (notificaciones.length <= itemsPerPage) return null;
    
    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <nav aria-label="Navegación de notificaciones">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={goToPreviousPage} 
                aria-label="Anterior"
                disabled={currentPage === 1}
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            
            {/* Mostrar hasta 3 números de página alrededor de la página actual */}
            {[...Array(totalPages).keys()].map(number => {
              const pageNumber = number + 1;
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <li 
                    key={pageNumber} 
                    className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => goToPage(pageNumber)}>
                      {pageNumber}
                    </button>
                  </li>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) || 
                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <li key={pageNumber} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
              return null;
            })}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={goToNextPage} 
                aria-label="Siguiente"
                disabled={currentPage === totalPages}
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
        <span className="ms-3 text-muted small">
          {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, notificaciones.length)} de {notificaciones.length}
        </span>
      </div>
    );
  };
  
  // Renderizar lista de notificaciones
  const renderItems = (itemsList) => {
    if (!itemsList || itemsList.length === 0) {
      return <p className="text-muted text-center my-3">No hay notificaciones</p>;
    }
    
    return (
      <>
        <ul className="list-group list-group-flush">
          {itemsList.map(renderNotificacion)}
        </ul>
        {renderPaginationControls()}
      </>
    );
  };

  // Manejador del botón para mostrar todas las notificaciones
  const handleShowAllNotifications = () => {
    setShowModal(true);
    onButtonClick(); // Llamar a la función original también
  };

  // Para prevenir que clics en el interior del modal se propaguen al backdrop
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  return (
    <>
      {/* Alerta de feedback */}
      {feedback.show && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback({...feedback, show: false})}></button>
        </div>
      )}
    
      <div className={`card ${fullHeight ? 'h-100' : ''} d-flex flex-column`}>
        {/* Renderizado condicional del encabezado según hideTitulo */}
        {!hideTitulo && (
          <div className="card-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h5 className="mb-0">{titulo}</h5>
              {badgeText && (
                <span className={`ms-2 badge bg-${badgeColor}`}>{badgeText}</span>
              )}
            </div>
            {textoBoton && (
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleShowAllNotifications}
              >
                {textoBoton}
              </button>
            )}
          </div>
        )}
        <div className="card-body flex-grow-1">
          {renderItems(currentItems)}
        </div>
      </div>

      {/* Modal para mostrar todas las notificaciones */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={handleModalClick}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{titulo}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {renderItems(itemsCompletos)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>
        </div>
      )}
    </>
  );
};

export default Notificaciones;