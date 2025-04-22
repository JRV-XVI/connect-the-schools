import React, { useState } from 'react';

/**
 * Componente reutilizable para mostrar diferentes tipos de gestiones en formato tabla
 * 
 * @param {Object} props
 * @param {string} props.titulo - Título de la gestión
 * @param {Array} props.items - Lista de elementos a mostrar
 * @param {string} props.textoBoton - Texto para el botón de exportar/filtrar
 * @param {Function} props.onButtonClick - Función a ejecutar cuando se hace clic en el botón
 * @param {string} props.tipo - Tipo de gestión para estilo específico (admin, aliado, escuela)
 */
const Gestiones = ({ 
  titulo = "Gestiones", 
  items = [], 
  textoBoton = "Ver todos", 
  onButtonClick = () => {}, 
  tipo = "admin"
}) => {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Estado para los filtros
  const [filtro, setFiltro] = useState({
    categoria: "Todas",
    prioridad: "Todas",
    estado: "Todos",
    busqueda: ""
  });
  
  // Función para manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prevFiltro => ({
      ...prevFiltro,
      [name]: value
    }));
  };
  
  // Función para limpiar los filtros
  const limpiarFiltros = () => {
    setFiltro({
      categoria: "Todas",
      prioridad: "Todas",
      estado: "Todos",
      busqueda: ""
    });
  };
  
  // Estructura de la tabla según el tipo de usuario
  const renderTableHeaders = () => {
    switch(tipo) {
      case "admin":
        return (
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      case "aliado":
        return (
          <tr>
            <th>Escuela</th>
            <th>Necesidad</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      case "escuela":
        return (
          <tr>
            <th>Categoría</th>
            <th>Necesidad</th>
            <th>Prioridad</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      default:
        return (
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
    }
  };
  
  // Renderiza las filas de la tabla según el tipo de usuario
  const renderTableRows = () => {
    // Cálculo para paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    
    switch(tipo) {
      case "admin":
        return currentItems.map((item, index) => (
          <tr key={index}>
            <td>{item.id || index + 1}</td>
            <td>{item.titulo}</td>
            <td>{item.descripcion}</td>
            <td>
              {item.categoria && (
                <span className={`badge bg-${getCategoriaColor(item.categoria)}`}>
                  {item.categoria}
                </span>
              )}
            </td>
            <td>
              <span className={`badge bg-${getEstadoColor(item.estado)}`}>
                {item.estado || 'Pendiente'}
              </span>
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-primary" title="Ver detalles">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="btn btn-outline-success" title="Aprobar">
                  <i className="fas fa-check"></i>
                </button>
                <button className="btn btn-outline-danger" title="Rechazar">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </td>
          </tr>
        ));
        
      case "escuela":
        return currentItems.map((item, index) => (
          <tr key={index}>
            <td>
              {item.categoria && (
                <span className={`badge bg-${getCategoriaColor(item.categoria)}`}>
                  {item.categoria}
                </span>
              )}
            </td>
            <td>{item.descripcion}</td>
            <td>
              <span className={`status-indicator status-${item.prioridad || 'pending'}`}></span>
              {getPrioridadText(item.prioridad)}
            </td>
            <td>{item.fecha || '01/01/2025'}</td>
            <td>
              {item.estado === 'Publicada' && <span className="badge bg-success">●&nbsp;Publicada</span>}
              {item.estado === 'En Vinculación' && <span className="badge bg-primary">●&nbsp;En Vinculación</span>}
              {item.estado === 'En Implementación' && <span className="badge bg-info">En Implementación</span>}
              {!item.estado && <span className="badge bg-warning">Pendiente</span>}
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-primary" title="Ver detalles">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="btn btn-outline-warning" title="Editar">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-outline-info" title="Ver vinculaciones">
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </td>
          </tr>
        ));
        
      case "aliado":
        return currentItems.map((item, index) => (
          <tr key={index}>
            <td>{item.escuela || 'Esc. Primaria'}</td>
            <td>{item.titulo || item.descripcion}</td>
            <td>{item.fecha || '01/01/2025'}</td>
            <td>
              <span className={`badge bg-${getEstadoColor(item.estado)}`}>
                {item.estado || 'Disponible'}
              </span>
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-primary" title="Ver detalles">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="btn btn-outline-success" title="Ofrecer apoyo">
                  <i className="fas fa-handshake"></i>
                </button>
                <button className="btn btn-outline-info" title="Ver contacto">
                  <i className="fas fa-address-card"></i>
                </button>
              </div>
            </td>
          </tr>
        ));
        
      default:
        return currentItems.map((item, index) => (
          <tr key={index}>
            <td>{item.titulo}</td>
            <td>{item.descripcion}</td>
            <td>
              <span className={`badge bg-${getEstadoColor(item.estado)}`}>
                {item.estado || 'Pendiente'}
              </span>
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-primary" title="Ver detalles">
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        ));
    }
  };
  
  // Funciones auxiliares para determinar colores
  const getCategoriaColor = (categoria) => {
    switch(categoria) {
      case 'Tecnología': return 'success';
      case 'Infraestructura': return 'danger';
      case 'Capacitación': return 'info';
      case 'Material': return 'warning';
      default: return 'secondary';
    }
  };
  
  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Publicada': return 'success';
      case 'En Vinculación': return 'primary';
      case 'En Implementación': return 'info';
      case 'Pendiente': return 'warning';
      case 'Rechazada': return 'danger';
      default: return 'secondary';
    }
  };
  
  const getPrioridadText = (prioridad) => {
    switch(prioridad) {
      case 'critical': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };
  
  // Cálculo de paginación
  const pageCount = Math.ceil(items.length / itemsPerPage);
  
  // Renderizado de paginación
  const renderPagination = () => {
    return (
      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(number)}>
                {number}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  return (
    <div className="card">
      {/* Encabezado con título y botones */}
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{titulo}</h5>
          <div>
            <button className="btn btn-outline-secondary me-2">
              <i className="fas fa-download me-1"></i> Exportar Datos
            </button>
            <button className="btn btn-success" onClick={onButtonClick}>
              <i className="fas fa-filter me-1"></i> Filtrar {titulo}
            </button>
          </div>
        </div>
      </div>
      
      {/* Sección de filtros */}
      <div className="card-body border-bottom">
        <h6>Filtros de {titulo}</h6>
        <div className="row g-3 align-items-end">
          <div className="col-md">
            <label className="form-label">Categoría</label>
            <select 
              className="form-select" 
              name="categoria" 
              value={filtro.categoria} 
              onChange={handleFiltroChange}
            >
              <option value="Todas">Todas</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Infraestructura">Infraestructura</option>
              <option value="Capacitación">Capacitación</option>
            </select>
          </div>
          
          <div className="col-md">
            <label className="form-label">Prioridad</label>
            <select 
              className="form-select" 
              name="prioridad" 
              value={filtro.prioridad} 
              onChange={handleFiltroChange}
            >
              <option value="Todas">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          
          <div className="col-md">
            <label className="form-label">Estado</label>
            <select 
              className="form-select" 
              name="estado" 
              value={filtro.estado} 
              onChange={handleFiltroChange}
            >
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Publicada">Publicada</option>
              <option value="En Vinculación">En Vinculación</option>
              <option value="En Implementación">En Implementación</option>
            </select>
          </div>
          
          <div className="col-md">
            <label className="form-label">Buscar Escuela</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nombre de escuela..." 
              name="busqueda" 
              value={filtro.busqueda} 
              onChange={handleFiltroChange}
            />
          </div>
          
          <div className="col-md-auto d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={limpiarFiltros}>
              Limpiar
            </button>
            <button className="btn btn-success">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabla de datos */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              {renderTableHeaders()}
            </thead>
            <tbody>
              {items.length > 0 ? (
                renderTableRows()
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No hay elementos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Paginación */}
      {items.length > itemsPerPage && (
        <div className="card-footer bg-white">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default Gestiones;