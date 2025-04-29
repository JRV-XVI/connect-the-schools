import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';

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
  onVerDetalles = () => { },
  onAprobar = () => { },
  onRechazar = () => { },
  tipo = "admin",
  mostrarAcciones = false,
  mostrarFiltros = true  // Nueva prop para controlar si se muestran los filtros
}) => {
  // Agregar configuración de categorías y subcategorías
  const categoriasConfig = {
    todos: {
      nombre: "Todas",
      subcategorias: []  // No necesita subcategorías específicas
    },
    formacionDocente: {
      nombre: "Formación docente",
      subcategorias: [
        'Alimentación saludable',
        'Atención de estudiantes con BAP',
        'Comunidades de aprendizaje',
        'Comunicación efectiva con comunidad escolar',
        'Convivencia escolar/Cultura de paz/Valores',
        'Disciplina positiva',
        'Educación inclusiva',
        'Enseñanza de lectura y matemáticas',
        'Evaluación',
        'Herramientas digitales para la educación',
        'Inteligencia emocional',
        'Lectoescritura',
        'Liderazgo y habilidades directivas',
        'Metodologías activas',
        'Neuroeducación',
        'Nueva Escuela Mexicana',
        'Participación infantil',
        'Proyecto de vida/Expectativas a futuro',
        'Sexualidad'
      ]
    },
    formacionFamilias: {
      nombre: "Formación a familias",
      subcategorias: [
        'Alimentación saludable',
        'Atención para hijos con BAP',
        'Comunicación efectiva con escuela',
        'Cultura de paz/Valores en el hogar',
        'Crianza positiva',
        'Derechos y obligaciones de los padres',
        'Enseñanza de lectura y matemáticas',
        'Inteligencia emocional',
        'Nueva Escuela Mexicana',
        'Proyecto de vida/Expectativas a futuro',
        'Sexualidad'
      ]
    },
    formacionNinos: {
      nombre: "Formación niñas y niños",
      subcategorias: [
        'Alimentación saludable',
        'Arte',
        'Convivencia escolar/Cultura de paz/Valores',
        'Computación',
        'Educación física',
        'Enseñanza de lectura y matemáticas',
        'Inteligencia emocional',
        'Lectoescritura',
        'Música',
        'Proyecto de vida/Expectativas a futuro',
        'Sexualidad',
        'Visitas fuera de la escuela'
      ]
    },
    personalApoyo: {
      nombre: "Personal de apoyo",
      subcategorias: [
        'Maestro para clases de arte',
        'Maestro para clases de educación física',
        'Maestro para clases de idiomas',
        'Persona para apoyo administrativo',
        'Persona para apoyo en limpieza',
        'Psicólogo',
        'Psicopedagogo o especialista en BAP',
        'Suplentes de docentes frente a grupo',
        'Terapeuta de lenguaje o comunicación'
      ]
    },
    infraestructura: {
      nombre: "Infraestructura",
      subcategorias: [
        'Adecuaciones para personas con discapacidad',
        'Agua',
        'Árboles',
        'Baños',
        'Cocina',
        'Conectividad',
        'Domos y patios',
        'Luz',
        'Muros, techos o pisos',
        'Pintura',
        'Seguridad',
        'Ventanas y puertas'
      ]
    },
    materiales: {
      nombre: "Materiales",
      subcategorias: [
        'Didácticos',
        'De educación física',
        'Tecnológico',
        'Literarios'
      ]
    },
    mobiliario: {
      nombre: "Mobiliario",
      subcategorias: [
        'Mesas para niños/mesabancos',
        'Mesas para docentes',
        'Comedores',
        'Sillas',
        'Estantes, libreros o cajoneras',
        'Pizarrones'
      ]
    },
    alimentacion: {
      nombre: "Alimentación",
      subcategorias: [
        'Desayunos',
        'Fórmula'
      ]
    },
    transporte: {
      nombre: "Transporte",
      subcategorias: [
        'Transporte',
        'Arreglo de camino'
      ]
    },
    juridico: {
      nombre: "Jurídico",
      subcategorias: [
        'Apoyo en gestión de escrituras'
      ]
    }
  };

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [itemsFiltrados, setItemsFiltrados] = useState([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  

  // Estado para las subcategorías disponibles basadas en la categoría seleccionada
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState([]);
  
  // Estado para los filtros (sin prioridad)
  const [filtro, setFiltro] = useState({
    categoria: "Todas",
    subcategoria: "Todas",
    estado: "Todos"
  });

  // Efecto para actualizar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (filtro.categoria === "Todas") {
      setSubcategoriasDisponibles([]);
    } else {
      // Buscar la categoría en el config
      const categoriaKey = Object.keys(categoriasConfig).find(
        key => categoriasConfig[key].nombre === filtro.categoria
      );
      
      if (categoriaKey) {
        setSubcategoriasDisponibles(categoriasConfig[categoriaKey].subcategorias);
      } else {
        setSubcategoriasDisponibles([]);
      }
    }
  }, [filtro.categoria, categoriasConfig]); // Añadido categoriasConfig como dependencia
  
  // Función para ver detalles (abre el modal)
  const handleVerDetalles = (item) => {
    onVerDetalles(item);
  };
  
  // Función para truncar texto largo
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Función para manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia la categoría, resetea la subcategoría
    if (name === 'categoria') {
      setFiltro(prevFiltro => ({
        ...prevFiltro,
        [name]: value,
        subcategoria: "Todas" // Reset subcategoría
      }));
    } else {
      setFiltro(prevFiltro => ({
        ...prevFiltro,
        [name]: value
      }));
    }
  };

    // Reemplaza la lógica de extracción de estado
  const getItemEstado = (item) => {
    // Primero intentamos usar el estado explícito del item
    if (item.estado) {
      return item.estado;
    }
    
    // Si no existe, revisamos el estado de validación
    if (item.datosOriginales) {
      const validacion = item.datosOriginales.estadoValidacion;
      if (validacion === 1) return "No aprobado";
      if (validacion === 2) return "Pendiente";
      if (validacion === 3) return "Aprobada";
    }
    
    // Estado por defecto
    return "Pendiente";
  };
  

  const aplicarFiltros = () => {
    const resultado = items.filter(item => {
      const itemCategoria = item.categoria || 
                          item.datosOriginales?.categoria || 
                          item.datosOriginales?.necesidad?.categoria || '';
      
      const itemSubcategoria = item.subcategoria || 
                             item.datosOriginales?.subcategoria || 
                             item.datosOriginales?.necesidad?.subcategoria || '';
      
      // Nueva función para determinar estado
      const itemEstado = getItemEstado(item);
  
      // Aplica los filtros (sin convertir a minúsculas para estados específicos)
      const categoriaMatch = filtro.categoria === "Todas" || 
                            itemCategoria.toLowerCase().includes(filtro.categoria.toLowerCase());
      
      const subcategoriaMatch = filtro.subcategoria === "Todas" || 
                               itemSubcategoria.toLowerCase().includes(filtro.subcategoria.toLowerCase());
      
      const estadoMatch = filtro.estado === "Todos" || itemEstado === filtro.estado;
  
      return categoriaMatch && subcategoriaMatch && estadoMatch;
    });
  
    setItemsFiltrados(resultado);
    setFiltrosAplicados(true);
    setCurrentPage(1);
    console.log("Filtros aplicados:", filtro);
    console.log("Resultados filtrados:", resultado.length);
  };
  
  // Función para limpiar los filtros - modificarla para resetear los resultados
  const limpiarFiltros = () => {
    setFiltro({
      categoria: "Todas",
      subcategoria: "Todas",
      estado: "Todos"
    });
    setItemsFiltrados([]);
    setFiltrosAplicados(false);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Estructura de la tabla según el tipo de usuario
  const renderTableHeaders = () => {
    switch (tipo) {
      case "admin":
        return (
          <tr>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      case "vinculacion":  // Nuevo tipo para vinculaciones
        return (
          <tr>
            <th>CCT</th>
            <th>RFC</th>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        );
      case "aliado":
        return (
          <tr>
            <th>Escuela</th>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      case "escuela":
        return (
          <tr>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Prioridad</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
      default:
        return (
          <tr>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        );
    }
  };
  
  const renderTableRows = () => {
    // Cálculo para paginación
    const itemsToShow = filtrosAplicados ? itemsFiltrados : items;
  
    // Cálculo para paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemsToShow.slice(indexOfFirstItem, indexOfLastItem);
  
    switch (tipo) {
      case "admin":
        return currentItems.map((item, index) => (
          <tr key={index}>
            <td>
              <span className={`badge bg-${getCategoriaColor(
                item.categoria || 
                item.datosOriginales?.categoria || 
                item.datosOriginales?.necesidad?.categoria || 
                'No especificada')}`}>
                {item.categoria || 
                 item.datosOriginales?.categoria || 
                 item.datosOriginales?.necesidad?.categoria || 
                 'No especificada'}
              </span>
            </td>
            <td>
              <span className={`badge bg-${getSubcategoriaColor(
                item.subcategoria || 
                item.datosOriginales?.subcategoria || 
                item.datosOriginales?.necesidad?.subcategoria || 
                'No especificada')}`}>
                {item.subcategoria || 
                 item.datosOriginales?.subcategoria || 
                 item.datosOriginales?.necesidad?.subcategoria || 
                 'No especificada'}
              </span>
            </td>
            <td title={item.descripcion}>{truncateText(item.descripcion)}</td>
            <td>
              <span className={`badge bg-${getEstadoColor(item.estado)}`}>
                {item.estado || 'Pendiente'}
              </span>
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button
                  className="btn btn-outline-primary"
                  title="Ver detalles"
                  onClick={() => handleVerDetalles(item)}>
                  <i className="fas fa-eye"></i>
                </button>
                {mostrarAcciones && (
                  <>
                    <button 
                      className="btn btn-outline-success" 
                      title="Aprobar"
                      onClick={() => onAprobar(item)}>
                      <i className="fas fa-check"></i>
                    </button>
                    <button 
                      className="btn btn-outline-danger" 
                      title="Rechazar"
                      onClick={() => onRechazar(item)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ));

      case "escuela":
        return currentItems.map((item, index) => (
          <tr key={index}>
            <td>
              <span className={`badge bg-${getCategoriaColor(item.categoria)}`}>
                {item.categoria || 'No especificada'}
              </span>
            </td>
            <td>
              <span className={`badge bg-${getSubcategoriaColor(item.subcategoria)}`}>
                {item.subcategoria || 'No especificada'}
              </span>
            </td>
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
                <button 
                  className="btn btn-outline-primary" 
                  title="Ver detalles"
                  onClick={() => handleVerDetalles(item)}>
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
            <td>
              <span className={`badge bg-${getCategoriaColor(item.categoria)}`}>
                {item.categoria || 'No especificada'}
              </span>
            </td>
            <td>
              <span className={`badge bg-${getSubcategoriaColor(item.subcategoria)}`}>
                {item.subcategoria || 'No especificada'}
              </span>
            </td>
            <td>
              <span className={`badge bg-${getEstadoColor(item.estado)}`}>
                {item.estado || 'Disponible'}
              </span>
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button 
                  className="btn btn-outline-primary" 
                  title="Ver detalles"
                  onClick={() => handleVerDetalles(item)}>
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

        case "vinculacion":
          return currentItems.map((item, index) => {
            const vinculacionData = item.datosOriginales || item;
            
            return (
              <tr key={index}>
                <td>{vinculacionData.escuela?.cct || "No especificado"}</td>
                <td>{vinculacionData.aliado?.rfc || "No especificado"}</td>
                <td>
                  <span className={`badge bg-${getCategoriaColor(
                    vinculacionData.necesidad?.categoria || 'No especificada')}`}>
                    {vinculacionData.necesidad?.categoria || 'No especificada'}
                  </span>
                </td>
                <td>
                  <span className={`badge bg-${getSubcategoriaColor(
                    vinculacionData.necesidad?.subcategoria || 'No especificada')}`}>
                    {vinculacionData.necesidad?.subcategoria || 'No especificada'}
                  </span>
                </td>
                <td title={vinculacionData.observacion}>{truncateText(vinculacionData.observacion)}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-primary"
                      title="Ver detalles"
                      onClick={() => handleVerDetalles(item)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    {mostrarAcciones && (
                      <>
                      <button 
                        className="btn btn-outline-success" 
                        title="Aprobar"
                        onClick={() => onAprobar(item)}>
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger" 
                        title="Rechazar"
                        onClick={() => onRechazar(item)}>
                        <i className="fas fa-times"></i>
                      </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          });
      default:
        return currentItems.map((item, index) => (
          <tr key={index}>
            <td>
              <span className={`badge bg-${getCategoriaColor(item.categoria)}`}>
                {item.categoria || 'No especificada'}
              </span>
            </td>
            <td>
              <span className={`badge bg-${getSubcategoriaColor(item.subcategoria)}`}>
                {item.subcategoria || 'No especificada'}
              </span>
            </td>
            <td title={item.descripcion}>{truncateText(item.descripcion)}</td>
            <td>
              <span className={`badge bg-${getEstadoColor(item.estado)}`}>
                {item.estado || 'Pendiente'}
              </span>
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button 
                  className="btn btn-outline-primary" 
                  title="Ver detalles"
                  onClick={() => handleVerDetalles(item)}>
                  <i className="fas fa-eye"></i>
                </button>
                {mostrarAcciones && (
                  <>
                    <button 
                      className="btn btn-outline-success" 
                      title="Aprobar"
                      onClick={() => onAprobar(item)}>
                      <i className="fas fa-check"></i>
                    </button>
                    <button 
                      className="btn btn-outline-danger" 
                      title="Rechazar"
                      onClick={() => onRechazar(item)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ));
    }
  };

  const getSubcategoriaColor = (subcategoria) => {
    // Puedes personalizar los colores según necesites
    switch (subcategoria) {
      case 'Didácticos':
      case 'De educación física':
      case 'Tecnológico':
      case 'Literarios':
      case 'Adecuaciones para personas con discapacidad':
      case 'Agua':
      case 'Árboles':
      case 'Baños':
      case 'Mesas para niños/mesabancos':
      case 'Mesas para docentes':
      case 'Comedores':
      case 'Sillas':
      case 'Desayunos':
      case 'Fórmula':
      default:
        return 'success'; // Color por defecto
    }
  };

  // Mantener las funciones auxiliares existentes y añadir otras si es necesario
  const getCategoriaColor = (categoria) => {
    // Añadir categorías específicas del proyecto
    switch (categoria) {
      case 'Formación Docente': 
      case 'Formación a Familias': 
      case 'Formación para Niñas y Niños':
      case 'Personal de Apoyo': 
      case 'Infraestructura':
      case 'Materiales': 
      case 'Mobiliario': 
      case 'Alimentación': 
      case 'Transporte': 
      case 'Apoyo Jurídico':
      case 'Tecnología': 
      case 'Capacitación': 
      case 'Material': 
      default: return 'danger';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobada': return 'success';
      case 'No aprobado': return 'danger';
      case 'Publicada': return 'success';
      case 'En Vinculación': return 'primary';
      case 'En Implementación': return 'info';
      case 'Pendiente': return 'warning';
      case 'Rechazada': return 'danger';
      default: return 'secondary';
    }
  };

  const getPrioridadText = (prioridad) => {
    switch (prioridad) {
      case 'critical': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };

  // Cálculo de paginación
  const pageCount = Math.ceil((filtrosAplicados ? itemsFiltrados.length : items.length) / itemsPerPage);

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
    <>
      <div className="card">
        {/* Encabezado con título */}
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{titulo}</h5>
          </div>
        </div>
  
        {/* Sección de filtros modificada */}
        {mostrarFiltros && (
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
                  {Object.values(categoriasConfig)
                    .filter(cat => cat.nombre !== "Todas")
                    .map((cat, idx) => (
                      <option key={idx} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                </select>
              </div>
  
              <div className="col-md">
                <label className="form-label">Subcategoría</label>
                <select
                  className="form-select"
                  name="subcategoria"
                  value={filtro.subcategoria}
                  onChange={handleFiltroChange}
                  disabled={filtro.categoria === "Todas" || subcategoriasDisponibles.length === 0}
                >
                  <option value="Todas">Todas</option>
                  {subcategoriasDisponibles.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
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
                  <option value="Aprobada">Aprobada</option>
                  <option value="No aprobado">No aprobado</option>
                </select>
              </div>
  
              <div className="col-md-auto d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={limpiarFiltros}>
                  Limpiar
                </button>
                <button 
                  className="btn btn-success"
                  onClick={aplicarFiltros}
                >
                  Aplicar Filtros {filtrosAplicados && `(${itemsFiltrados.length})`}
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Tabla de datos */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                {renderTableHeaders()}
              </thead>
              <tbody>
                {(filtrosAplicados ? itemsFiltrados.length : items.length) > 0 ? (
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
        {(filtrosAplicados ? itemsFiltrados.length : items.length) > itemsPerPage && (
          <div className="card-footer bg-white">
            {renderPagination()}
          </div>
        )}
      </div>
    </>
  );
}
export default Gestiones;