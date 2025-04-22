import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente reutilizable para gestionar necesidades escolares u ofertas de apoyo
 * 
 * @param {Object} props
 * @param {string} props.tipo - "necesidad" para escuelas o "apoyo" para aliados
 * @param {string} props.titulo - Título de la sección
 * @param {Array} props.tabs - Pestañas a mostrar
 * @param {Array} props.datos - Datos para mostrar en las tablas
 * @param {Object} props.columnas - Definición de columnas para cada tab
 * @param {Function} props.onAdd - Función para agregar un nuevo elemento
 * @param {Function} props.onEdit - Función para editar un elemento
 * @param {Function} props.onView - Función para ver detalles de un elemento
 * @param {Function} props.onToggleStatus - Función para cambiar el estado activo/inactivo
 * @param {Function} props.onHistory - Función para ver historial
 */
const NecesidadApoyo = ({
  tipo = "necesidad",
  titulo = tipo === "necesidad" ? "Gestión de Necesidades Escolares" : "Gestión de Ofertas de Apoyo",
  tabs = [],
  datos = {},
  columnas = {},
  onAdd = () => {},
  onEdit = () => {},
  onView = () => {},
  onToggleStatus = () => {},
  onHistory = () => {}
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  // Determinar el texto para el botón según el tipo
  const textoBoton = tipo === "necesidad" ? "Nueva Necesidad" : "Nueva Oferta";
  
  // Determinar los iconos y clases según el tipo
  const getIconoCategoria = (categoria) => {
    const categoriaInfo = {
      "Equipamiento Tecnológico": { icon: "laptop", color: "primary" },
      "Infraestructura": { icon: "paint-roller", color: "success" },
      "Material Deportivo": { icon: "futbol", color: "warning" },
      "Material Didáctico": { icon: "book", color: "info" },
      "Capacitación Docente": { icon: "chalkboard-teacher", color: "danger" },
      "Material Bibliográfico": { icon: "book", color: "secondary" },
      "default": { icon: "box", color: "secondary" }
    };
    
    return categoriaInfo[categoria] || categoriaInfo.default;
  };
  
  const renderTabla = (tabId) => {
    const tabData = datos[tabId] || [];
    const columnasActuales = columnas[tabId] || [];
    
    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              {columnasActuales.map((columna, index) => (
                <th key={index}>{columna.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabData.length > 0 ? (
              tabData.map((item, index) => (
                <tr key={index}>
                  {columnasActuales.map((columna, colIndex) => (
                    <td key={colIndex}>
                      {columna.field === 'categoria' ? (
                        <div className="d-flex align-items-center">
                          <div className={`bg-${getIconoCategoria(item.categoria).color}-light rounded-circle p-2 me-2`}>
                            <i className={`fas fa-${getIconoCategoria(item.categoria).icon} text-${getIconoCategoria(item.categoria).color}`}></i>
                          </div>
                          <span>{item.categoria}</span>
                        </div>
                      ) : columna.field === 'estado' ? (
                        <div className="toggle-switch small">
                          <input 
                            type="checkbox" 
                            id={`item${index}`} 
                            checked={item.activo} 
                            onChange={() => onToggleStatus(item)}
                          />
                          <label className="toggle-slider" htmlFor={`item${index}`}></label>
                        </div>
                      ) : columna.field === 'acciones' ? (
                        <div>
                          <button 
                            className="btn btn-sm btn-outline-primary me-1" 
                            onClick={() => onEdit(item)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-info" 
                            onClick={() => onView(item)}
                            title="Ver detalles"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      ) : columna.format ? (
                        columna.format(item[columna.field], item)
                      ) : (
                        item[columna.field]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnasActuales.length} className="text-center py-3">
                  No hay elementos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <section className="mb-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{titulo}</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={onHistory}>
            <i className="fas fa-history me-1"></i> Historial
          </button>
          <button className="btn btn-primary" onClick={onAdd}>
            <i className="fas fa-plus me-2"></i> {textoBoton}
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs" role="tablist">
            {tabs.map((tab) => (
              <li className="nav-item" role="presentation" key={tab.id}>
                <button 
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button" 
                  role="tab"
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body">
          <div className="tab-content">
            {tabs.map((tab) => (
              <div 
                key={tab.id}
                className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
                role="tabpanel"
              >
                {renderTabla(tab.id)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

NecesidadApoyo.propTypes = {
  tipo: PropTypes.oneOf(['necesidad', 'apoyo']),
  titulo: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  datos: PropTypes.object,
  columnas: PropTypes.object,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onToggleStatus: PropTypes.func,
  onHistory: PropTypes.func
};

export default NecesidadApoyo;