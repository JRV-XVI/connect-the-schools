import React, { useState } from 'react';
import axios from 'axios'; // Add axios for backend API calls

/**
 * Componente reutilizable para mostrar elementos pendientes o eventos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.titulo - Título del componente (ej: "Validaciones Pendientes", "Tareas Pendientes")
 * @param {Array} props.items - Lista de elementos pendientes a mostrar (limitada para dashboard)
 * @param {string} props.tipo - Tipo de pendientes a mostrar ('admin', 'aliado', 'escuela', 'proyecto')
 * @param {string} props.badgeText - Texto opcional para mostrar en el badge del título
 * @param {string} props.badgeColor - Color del badge (primary, warning, danger, etc)
 * @param {string} props.textoBoton - Texto para el botón de "ver más" (opcional)
 * @param {Function} props.onButtonClick - Función a ejecutar al hacer clic en el botón
 * @param {boolean} props.fullHeight - Si el componente debe ocupar altura completa (h-100)
 * @param {Array} props.allItems - Lista completa de pendientes para el modal (opcional)
 * @param {string} props.apiUrl - URL base para las llamadas a la API
 * @param {Function} props.onValidate - Función a ejecutar después de una validación exitosa
 * @param {boolean} props.hideTitulo - Si se debe ocultar el título del componente
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
    allItems = null, // Nuevo parámetro para la lista completa
    apiUrl = '/api',
    onValidate = () => {},
    hideTitulo = false // Nueva propiedad para ocultar el título
  }) => {
  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);
  // Estado para controlar carga durante validaciones
  const [loading, setLoading] = useState({});
  // Estado para mostrar mensajes de feedback
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  // Estado para almacenar comentarios del administrador (no observaciones)
  const [comentariosAdmin, setComentariosAdmin] = useState({});
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = tipo === 'proyecto' ? 1 : items.length; // Solo 1 proyecto a la vez
  
  // Usar allItems si está disponible, sino usar items
  const itemsCompletos = allItems || items;
  
  // Cálculo para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Solo aplicar paginación en proyectos
  const currentItems = tipo === 'proyecto' 
    ? items.slice(indexOfFirstItem, indexOfLastItem) 
    : items;
  
  // Total de páginas para proyectos
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // Handlers para paginación
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Limpiar comentario del proyecto anterior
      const prevItemId = items[indexOfFirstItem - 1]?.idProyecto || (indexOfFirstItem - 1);
      if (comentariosAdmin[prevItemId]) {
        setComentariosAdmin({...comentariosAdmin, [prevItemId]: ''});
      }
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Limpiar comentario del proyecto anterior
      const prevItemId = items[indexOfFirstItem]?.idProyecto || indexOfFirstItem;
      if (comentariosAdmin[prevItemId]) {
        setComentariosAdmin({...comentariosAdmin, [prevItemId]: ''});
      }
    }
  };
  
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  
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

  // Renderizador actualizado para proyectos pendientes de validación
  const renderProyectoItem = (item, index) => {
    const itemId = item.idProyecto || index;
    
    return (
      <div className="card mb-3" key={itemId}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{item.nombreProyecto || "Proyecto sin nombre"}</h6>
          <span className={`badge bg-${getEstadoColor(item)}`}>
            {getEstadoText(item)}
          </span>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <p className="mb-1"><strong>Escuela:</strong> {item.nombreEscuela || item.cct || "No especificada"}</p>
              <p className="mb-1"><strong>Aliado:</strong> {item.nombreAliado || item.rfc || "No especificado"}</p>
              <p className="mb-0"><strong>Necesidad:</strong> {item.necesidadApoyo || "No especificada"}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1"><strong>Aceptación Escuela:</strong> 
                <span className={`badge ms-2 ${item.aceptacionEscuela ? 'bg-success' : 'bg-warning'}`}>
                  {item.aceptacionEscuela ? 'Aceptado' : 'Pendiente'}
                </span>
              </p>
              <p className="mb-0"><strong>Aceptación Aliado:</strong> 
                <span className={`badge ms-2 ${item.aceptacionAliado ? 'bg-success' : 'bg-warning'}`}>
                  {item.aceptacionAliado ? 'Aceptado' : 'Pendiente'}
                </span>
              </p>
            </div>
          </div>
          
          {/* Observaciones originales - Solo lectura */}
          {item.observacion && (
            <div className="form-group mb-3">
              <label><strong>Observaciones originales:</strong></label>
              <p className="form-control-plaintext border bg-light p-2 mb-0">
                {item.observacion}
              </p>
            </div>
          )}
          
          {/* Comentarios del administrador - Campo editable y obligatorio */}
          <div className="form-group my-3">
            <label htmlFor={`comentario-admin-${itemId}`}>
              <strong>Comentarios del Administrador:</strong> <span className="text-danger">*</span>
            </label>
            <textarea 
              className="form-control" 
              id={`comentario-admin-${itemId}`} 
              rows="3"
              placeholder="Añade un comentario sobre esta validación"
              onChange={(e) => setComentariosAdmin({...comentariosAdmin, [itemId]: e.target.value})}
              value={comentariosAdmin[itemId] || ''}
            />
          </div>
          
          {/* Botones de acción */}
          <div className="d-flex justify-content-end mt-3">
            <button 
              className="btn btn-danger me-2" 
              onClick={() => handleValidateProject(item, false)}
              disabled={loading[itemId] || !comentariosAdmin[itemId]?.trim()}
            >
              {loading[itemId] === 'reject' ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              Rechazar
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => handleValidateProject(item, true)}
              disabled={loading[itemId] || !comentariosAdmin[itemId]?.trim()}
            >
              {loading[itemId] === 'approve' ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              Aprobar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar controles de paginación para proyectos
  const renderPaginationControls = () => {
    if (tipo !== 'proyecto' || items.length <= 1) return null;
    
    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <nav aria-label="Navegación de proyectos">
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
              // Solo mostrar páginas cercanas a la actual para evitar demasiados botones
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
                // Agregar puntos suspensivos para separar números de página
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
          Proyecto {indexOfFirstItem + 1} de {items.length}
        </span>
      </div>
    );
  };
  
  // Función helper para determinar color de estado
  const getEstadoColor = (item) => {
    if (!item.aceptacionEscuela && !item.aceptacionAliado) return 'warning';
    if (item.aceptacionEscuela && item.aceptacionAliado) return 'success';
    return 'info';
  };
  
  // Función helper para determinar texto de estado
  const getEstadoText = (item) => {
    if (!item.aceptacionEscuela && !item.aceptacionAliado) return 'Pendiente';
    if (item.aceptacionEscuela && item.aceptacionAliado) return 'Aprobado';
    return 'En proceso';
  };
  
  // Manejar la validación de proyectos
  const handleValidateProject = async (item, isApproved) => {
    const itemId = item.idProyecto || item.id;
    
    // Verificar que hay comentarios del administrador
    if (!comentariosAdmin[itemId]?.trim()) {
      setFeedback({
        show: true,
        message: 'Debes añadir un comentario para validar este proyecto',
        type: 'danger'
      });
      return;
    }
    
    try {
      setLoading({...loading, [itemId]: isApproved ? 'approve' : 'reject'});
      
      // Preparar datos para enviar al API
      const validationData = {
        idProyecto: item.idProyecto,
        cct: item.cct,
        rfc: item.rfc, 
        idNecesidadApoyo: item.idNecesidadApoyo,
        observacionOriginal: item.observacion || '', // Campo de solo lectura
        comentarioAdmin: comentariosAdmin[itemId], // Nuevo campo para comentarios del admin
        estado: isApproved ? 'aprobado' : 'rechazado'
      };
      
      // Llamada al API
      const response = await axios.post(`${apiUrl}/proyectos/validar`, validationData);
      
      // Mostrar mensaje de éxito
      setFeedback({
        show: true,
        message: `Proyecto ${isApproved ? 'aprobado' : 'rechazado'} correctamente`,
        type: 'success'
      });
      
      // Notificar al componente padre sobre la validación exitosa
      onValidate(response.data, isApproved);
      
      // Limpiar los comentarios para este ítem
      setComentariosAdmin({
        ...comentariosAdmin, 
        [itemId]: ''
      });
      
      // Si hay más proyectos pendientes, pasar al siguiente
      if (currentPage < totalPages && items.length > 1) {
        setTimeout(() => {
          goToNextPage();
        }, 1000);
      } else if (items.length === 1) {
        // Si este era el último o único proyecto, notificar que no hay más proyectos
        setTimeout(() => {
          setFeedback({
            show: true,
            message: "No hay más proyectos pendientes por validar.",
            type: "info"
          });
        }, 2000);
      }
      
      // Auto-esconder el mensaje después de 3 segundos
      setTimeout(() => {
        setFeedback({...feedback, show: false});
      }, 3000);
      
    } catch (error) {
      console.error("Error validando proyecto:", error);
      setFeedback({
        show: true,
        message: `Error al ${isApproved ? 'aprobar' : 'rechazar'} el proyecto: ${error.message}`,
        type: 'danger'
      });
    } finally {
      setLoading({...loading, [itemId]: false});
    }
  };
  
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
      case 'proyecto':
        return (
          <div className="p-3">
            {/* Para proyectos, solo mostrar los que corresponden a la página actual */}
            {currentItems.map(renderProyectoItem)}
            {/* Mostrar controles de paginación si hay más de un proyecto */}
            {renderPaginationControls()}
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
                className={`btn btn-sm btn-${tipo === 'aliado' ? 'outline-' : ''}primary`}
                onClick={handleShowAllPending}
              >
                {textoBoton}
              </button>
            )}
          </div>
        )}
        <div className={`card-body ${tipo === 'escuela' ? 'p-0' : ''} flex-grow-1`}>
          {renderItems(tipo === 'proyecto' ? currentItems : items)}
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