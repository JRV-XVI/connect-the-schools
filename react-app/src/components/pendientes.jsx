import React, { useState } from 'react';

/**
 * Componente reutilizable para mostrar elementos pendientes o eventos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.titulo - Título del componente (ej: "Validaciones Pendientes", "Tareas Pendientes")
 * @param {Array} props.items - Lista de elementos pendientes a mostrar (limitada para dashboard)
 * @param {string} props.tipo - Tipo de pendientes a mostrar ('admin', 'aliado', 'escuela')
 * @param {string} props.badgeText - Texto opcional para mostrar en el badge del título
 * @param {string} props.badgeColor - Color del badge (primary, warning, danger, etc)
 * @param {string} props.textoBoton - Texto para el botón de "ver más" (opcional)
 * @param {Function} props.onButtonClick - Función a ejecutar al hacer clic en el botón
 * @param {boolean} props.fullHeight - Si el componente debe ocupar altura completa (h-100)
 * @param {Array} props.allItems - Lista completa de pendientes para el modal (opcional)
 */
const Pendientes = ({ 
    titulo = "Pendientes", 
    items = [], 
    tipo = 'admin', 
    badgeText,
    badgeColor = "primary",
    textoBoton,
    onButtonClick = () => {},
    fullHeight = true,
    allItems = null // Nuevo parámetro para la lista completa
  }) => {
  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);
  
  // Usar allItems si está disponible, sino usar items
  const itemsCompletos = allItems || items;
  
  const renderAdminItem = (item, index) => (
    <li className="list-group-item px-0" key={index}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">{item.titulo}</h6>
          <small className="text-muted">{item.descripcion}</small>
        </div>
        <span className={`badge bg-${item.color || 'primary'} rounded-pill`}>{item.cantidad}</span>
      </div>
    </li>
  );
  
  const renderAliadoItem = (item, index) => (
    <div className="list-group-item px-0" key={index}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="mb-0">{item.titulo}</h6>
        <span className={`badge bg-${item.color || 'primary'} rounded-pill`}>{item.fecha || 'Sin fecha'}</span>
      </div>
      <p className="mb-1 small">{item.descripcion}</p>
      <small className="text-muted">{item.estado}</small>
    </div>
  );
  
  const renderEscuelaItem = (item, index) => (
    <div className="task-item" key={index}>
      <div>
        <span className={`status-indicator status-${item.prioridad || 'pending'}`}></span>
        <span>{item.descripcion}</span>
      </div>
      <button className="btn btn-sm btn-outline-primary" onClick={() => item.onAction && item.onAction()}>
        {item.textoAccion || 'Ver'}
      </button>
    </div>
  );
  
  const renderItems = (itemsList) => {
    if (!itemsList || itemsList.length === 0) {
      return <p className="text-muted text-center my-3">No hay elementos pendientes</p>;
    }
    
    switch (tipo) {
      case 'admin':
        return (
          <ul className="list-group list-group-flush">
            {itemsList.map(renderAdminItem)}
          </ul>
        );
      case 'aliado':
        return (
          <div className="list-group list-group-flush">
            {itemsList.map(renderAliadoItem)}
          </div>
        );
      case 'escuela':
        return (
          <div className="p-3">
            {itemsList.map(renderEscuelaItem)}
          </div>
        );
      default:
        return <p className="text-muted">Tipo de pendientes no reconocido</p>;
    }
  };

  // Manejador del botón para mostrar todos los pendientes
  const handleShowAllPending = () => {
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
      <div className="card h-100 d-flex flex-column">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{titulo}</h5>
          {textoBoton && (
            <button 
                className={`btn btn-sm btn-${tipo === 'aliado' ? 'outline-' : ''}primary`}
              onClick={handleShowAllPending}
            >
              {textoBoton}
            </button>
          )}
        </div>
        <div className={`card-body ${tipo === 'escuela' ? 'p-0' : ''} flex-grow-1`}>
          {renderItems(items)}
        </div>
      </div>

      {/* Modal para mostrar todos los pendientes */}
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

export default Pendientes;