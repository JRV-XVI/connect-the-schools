import React, { useState } from 'react';

/**
 * Componente reutilizable para mostrar tablas de proyectos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.titulo - Título del componente (ej: "Proyectos Recientes", "Proyectos Activos")
 * @param {Array} props.proyectos - Lista de proyectos a mostrar
 * @param {string} props.tipo - Tipo de proyectos a mostrar ('admin', 'aliado', 'escuela')
 * @param {string} props.textoBoton - Texto para el botón de "ver más" (opcional)
 * @param {Function} props.onButtonClick - Función a ejecutar al hacer clic en el botón
 * @param {Function} props.onViewClick - Función para ver detalles de un proyecto
 * @param {Function} props.onActionClick - Función para acción secundaria (aprobar, editar, etc.)
 */
const Proyecto = ({ 
  titulo = "Proyectos", 
  proyectos = [], 
  tipo = 'admin', 
  textoBoton = "Ver todos",
  onButtonClick = () => {},
  onViewClick = () => {},
  onActionClick = () => {}
}) => {
  // Estado para el modal de vista completa
  const [showModal, setShowModal] = useState(false);
  const [allProjects, setAllProjects] = useState(proyectos);

  // Determinar las columnas según el tipo de usuario
  const getColumns = () => {
    switch(tipo) {
      case 'admin':
        return (
          <tr>
            <th>Proyecto</th>
            <th>Escuela</th>
            <th>Aliado</th>
            <th>Fecha Inicio</th>
            <th>Progreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      case 'aliado':
        return (
          <tr>
            <th>Proyecto</th>
            <th>Escuela</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Progreso</th>
            <th>Acciones</th>
          </tr>
        );
      case 'escuela':
        return (
          <tr>
            <th>Proyecto</th>
            <th>Aliado</th>
            <th>Fecha Inicio</th>
            <th>Progreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      default:
        return null;
    }
  };

  // Renderizar fila según tipo de usuario
  const renderRow = (proyecto, index) => {
    // Determinar el color de la barra de progreso
    const getProgressBarColor = (porcentaje) => {
      if (porcentaje >= 70) return 'bg-success';
      if (porcentaje >= 40) return 'bg-warning';
      return 'bg-danger';
    };

    // Determinar el color del badge de estado
    const getStatusBadgeColor = (estado) => {
      switch(estado?.toLowerCase()) {
        case 'en tiempo': return 'bg-success';
        case 'retraso menor': return 'bg-warning';
        case 'retraso crítico': return 'bg-danger';
        case 'completado': return 'bg-primary';
        case 'cancelado': return 'bg-secondary';
        default: return 'bg-info';
      }
    };

    // Renderizar progreso
    const renderProgress = (porcentaje) => (
      <div className="d-flex align-items-center">
        <div className="progress flex-grow-1" style={{ height: '6px' }}>
          <div 
            className={`progress-bar ${getProgressBarColor(porcentaje)}`} 
            role="progressbar" 
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
        <span className="ms-2">{porcentaje}%</span>
      </div>
    );

    // Renderizar acciones
    const renderActions = (proyecto) => (
      <td className="table-action-buttons">
        <button 
          className="btn btn-sm btn-outline-primary me-1"
          onClick={() => onViewClick(proyecto, index)}
        >
          <i className="fas fa-eye"></i>
        </button>
        <button 
          className="btn btn-sm btn-outline-success"
          onClick={() => onActionClick(proyecto, index)}
        >
          <i className="fas fa-pen"></i>
        </button>
      </td>
    );

    switch(tipo) {
      case 'admin':
        return (
          <tr key={index}>
            <td>{proyecto.nombre}</td>
            <td>{proyecto.escuela}</td>
            <td>{proyecto.aliado}</td>
            <td>{proyecto.fechaInicio}</td>
            <td>{renderProgress(proyecto.progreso)}</td>
            <td>
              <span className={`badge ${getStatusBadgeColor(proyecto.estado)}`}>
                {proyecto.estado}
              </span>
            </td>
            {renderActions(proyecto)}
          </tr>
        );
      case 'aliado':
        return (
          <tr key={index}>
            <td>{proyecto.nombre}</td>
            <td>{proyecto.escuela}</td>
            <td>{proyecto.fechaInicio}</td>
            <td>{proyecto.fechaFin}</td>
            <td>{renderProgress(proyecto.progreso)}</td>
            {renderActions(proyecto)}
          </tr>
        );
      case 'escuela':
        return (
          <tr key={index}>
            <td>{proyecto.nombre}</td>
            <td>{proyecto.aliado}</td>
            <td>{proyecto.fechaInicio}</td>
            <td>{renderProgress(proyecto.progreso)}</td>
            <td>
              <span className={`badge ${getStatusBadgeColor(proyecto.estado)}`}>
                {proyecto.estado}
              </span>
            </td>
            {renderActions(proyecto)}
          </tr>
        );
      default:
        return null;
    }
  };

  // Añadir la función handleButtonClick que faltaba
  const handleButtonClick = () => {
    setShowModal(true);
    onButtonClick();
  };

  // Agregar mensaje de depuración si no hay proyectos
  const noProyectos = !proyectos || proyectos.length === 0;

  return (
    <>
      <div className="card h-100 d-flex flex-column">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{titulo}</h5>
          {textoBoton && (
            <button className={`btn btn-sm btn-${tipo === 'aliado' ? 'outline-' : ''}primary`} onClick={handleButtonClick}>
              {textoBoton}
            </button>
          )}
        </div>
        <div className="card-body p-2 ">
          {noProyectos ? (
            <div className="alert alert-info m-3">No hay proyectos para mostrar</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-compact mb-0">
                <thead>
                  {getColumns()}
                </thead>
                <tbody>
                  {proyectos.map((proyecto, index) => renderRow(proyecto, index))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver todos los proyectos */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{titulo}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-2">
                {allProjects.length === 0 ? (
                  <div className="alert alert-info m-3">No hay proyectos para mostrar</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-compact mb-0">
                      <thead>
                        {getColumns()}
                      </thead>
                      <tbody>
                        {allProjects.map((proyecto, index) => renderRow(proyecto, index))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
        </div>
      )}
    </>
  );
};

export default Proyecto;