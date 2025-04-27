import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { get, post } from '../api';

const Busqueda = ({
  titulo = "Búsqueda de Escuelas",
  resultados = [],
  opcionesFiltros = {},
  onFilterChange = () => {},
  onMapView = () => {},
  onVincular = () => {},
  onVerDetalles = () => {},
  onPageChange = () => {},
  paginaActual = 1,
  totalPaginas = 1,
  cargando: externalLoading = false,
  apoyosDisponibles = [],
  userId = null // Nuevo prop para recibir userId externamente
}) => {
  // Estados para datos reales y carga
  const [escuelasCompatibles, setEscuelasCompatibles] = useState([]);
  const [escuelasParaMostrar, setEscuelasParaMostrar] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado de filtros
  const [filtros, setFiltros] = useState({
    nivelEducativo: "",
    tipoNecesidad: "",
    municipio: "",
    urgencia: "",
    matriculaMin: "",
    matriculaMax: "",
    soloCompatibles: false
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estado de paginación local
  const [paginaLocal, setPaginaLocal] = useState(1);
  const escuelasPorPagina = 3;
  const [totalPaginasLocal, setTotalPaginasLocal] = useState(1);
  
  // Estados para modal de vinculación
  const [showVinculacionModal, setShowVinculacionModal] = useState(false);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    necesidadSeleccionada: "",
    mensajeInteres: "",
    apoyoSeleccionado: "",
    descripcionServicios: "",
    documentos: []
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referencias para evitar dependencias cíclicas
  const onFilterChangeRef = useRef(onFilterChange);
  const filtrosRef = useRef(filtros);

  // Actualizar referencias cuando cambian los props
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
    filtrosRef.current = filtros;
  }, [onFilterChange, filtros]);

  // Función para obtener necesidades compatibles
  const fetchEscuelasCompatibles = async (idUsuario) => {
    try {
      setLoading(true);
      // Use the actual endpoint path that exists on the backend
      const response = await get(`/usuario/${idUsuario}/necesidadApoyo`);
      console.log("Necesidades compatibles obtenidas de BD:", response);
      return response;
    } catch (error) {
      console.error("Error al obtener necesidades compatibles:", error);
      setError("No se pudieron cargar las escuelas compatibles");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Función auxiliar para asignar colores según prioridad
  const getPriorityColor = (prioridad) => {
    const priority = parseInt(prioridad, 10);
    if (priority >= 8) return 'danger';
    if (priority >= 5) return 'warning';
    return 'info';
  };

  useEffect(() => {
    const loadEscuelas = async () => {
      // Obtener userId de prop o localStorage
      const userIdentifier = userId || localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      if (!userIdentifier) {
        console.warn("No se encontró ID de usuario, usando ID de demostración");
        // Usar un ID de demostración o asignado por defecto
        // Puedes asignar un ID fijo para pruebas
        const demoUserId = "1"; // ID de demostración para pruebas
        
        try {
          const necesidades = await fetchEscuelasCompatibles(demoUserId);
          // El resto del proceso continúa igual...
          procesarNecesidades(necesidades);
        } catch (error) {
          console.error("Error con ID de demostración:", error);
          setLoading(false);
          setError("Error al cargar datos de prueba");
        }
      } else {
        try {
          const necesidades = await fetchEscuelasCompatibles(userIdentifier);
          procesarNecesidades(necesidades);
        } catch (error) {
          console.error("Error al cargar datos de escuelas:", error);
          setError("Error al procesar los datos de escuelas");
          setLoading(false);
        }
      }
    };
    
    // Función separada para procesar las necesidades
    const procesarNecesidades = (necesidades) => {
      if (!necesidades || necesidades.length === 0) {
        setError("No se encontraron escuelas compatibles");
        setLoading(false);
        return;
      }
      
      // Procesar datos recibidos (mismo código que ya tienes)
      const escuelasFormateadas = necesidades.reduce((acc, necesidad) => {
        // Agrupar por CCT para consolidar necesidades de la misma escuela
        const escuelaExistente = acc.find(e => e.cct === necesidad.cct);
        
        if (escuelaExistente) {
          // Agregar necesidad a una escuela ya registrada
          escuelaExistente.necesidades.push({
            id: necesidad.idNecesidadApoyo,
            idNecesidadApoyo: necesidad.idNecesidadApoyo,
            nombre: `${necesidad.categoria} - ${necesidad.subcategoria}`,
            descripcion: necesidad.descripcion,
            prioridad: necesidad.prioridad,
            color: getPriorityColor(necesidad.prioridad)
          });
          return acc;
        } else {
          // Crear nueva entrada de escuela con datos reales de la BD
          return [...acc, {
            id: necesidad.cct,
            cct: necesidad.cct,
            nombre: necesidad.nombreEscuela || `Escuela ${necesidad.cct}`,
            nivelEducativo: necesidad.nivelEducativo,
            matricula: necesidad.numeroEstudiantes || 0,
            turno: necesidad.turno || "Matutino",
            ubicacion: necesidad.direccion || "Sin información de ubicación",
            compatibilidad: 'total', // Se asume compatibilidad total 
            necesidades: [{
              id: necesidad.idNecesidadApoyo,
              idNecesidadApoyo: necesidad.idNecesidadApoyo,
              nombre: `${necesidad.categoria} - ${necesidad.subcategoria}`,
              descripcion: necesidad.descripcion,
              prioridad: necesidad.prioridad,
              color: getPriorityColor(necesidad.prioridad)
            }]
          }];
        }
      }, []);
      
      console.log("Escuelas procesadas de la base de datos:", escuelasFormateadas);
      
      // Guardar escuelas en estado local
      setEscuelasCompatibles(escuelasFormateadas);
      
      // Calcular total de páginas
      setTotalPaginasLocal(Math.ceil(escuelasFormateadas.length / escuelasPorPagina));
      
      // Actualizar escuelas a mostrar según paginación
      const startIndex = (paginaLocal - 1) * escuelasPorPagina;
      setEscuelasParaMostrar(escuelasFormateadas.slice(startIndex, startIndex + escuelasPorPagina));
      
      // Informar al componente padre
      if (typeof onFilterChange === 'function') {
        onFilterChange({ escuelasDB: escuelasFormateadas });
      }
      
      setLoading(false);
    };
    
    loadEscuelas();
  }, []);

  // Efecto para manejar cambios de página
  useEffect(() => {
    if (escuelasCompatibles.length > 0) {
      const startIndex = (paginaLocal - 1) * escuelasPorPagina;
      setEscuelasParaMostrar(escuelasCompatibles.slice(startIndex, startIndex + escuelasPorPagina));
    }
  }, [paginaLocal, escuelasCompatibles]);

  // Handler para cambio de página local
  const handlePageChangeLocal = (newPage) => {
    setPaginaLocal(newPage);
  };

  // Resto de funciones para el modal, etc.
  const handleOpenVinculacionModal = (escuela) => {
    setEscuelaSeleccionada(escuela);
    setShowVinculacionModal(true);
  };

  const handleCloseVinculacionModal = () => {
    setShowVinculacionModal(false);
    setEscuelaSeleccionada(null);
    setFormData({
      necesidadSeleccionada: "",
      mensajeInteres: "",
      apoyoSeleccionado: "",
      descripcionServicios: "",
      documentos: []
    });
    setValidationErrors({});
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al cambiar el valor
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.necesidadSeleccionada) {
      errors.necesidadSeleccionada = 'Debe seleccionar una necesidad a atender';
    }
    
    if (!formData.mensajeInteres.trim()) {
      errors.mensajeInteres = 'Debe explicar su interés en atender esta necesidad';
    }
    
    if (!formData.apoyoSeleccionado) {
      errors.apoyoSeleccionado = 'Debe seleccionar un apoyo de su perfil';
    }
    
    if (!formData.descripcionServicios.trim()) {
      errors.descripcionServicios = 'Debe proporcionar una descripción de los servicios ofrecidos';
    }
    
    return errors;
  };

  // Enviar solicitud de vinculación
  const handleSubmitVinculacion = async (e) => {
    e.preventDefault();
    
    // Validación del formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Encontrar necesidad y apoyo seleccionados
      const necesidadSeleccionada = escuelaSeleccionada.necesidades.find(
        n => (n.id || n.idNecesidad || n.idNecesidadApoyo) == formData.necesidadSeleccionada
      );
      
      const apoyoSeleccionado = apoyosDisponibles.find(
        a => (a.id || a.idApoyo) == formData.apoyoSeleccionado
      );
      
      // Datos para la base de datos - con los nombres de campo exactos esperados por el backend
      const vinculacionData = {
        rfc: apoyoSeleccionado?.rfc || localStorage.getItem('aliadoRFC') || '',
        cct: escuelaSeleccionada.cct,
        idNecesidad: necesidadSeleccionada?.idNecesidadApoyo || formData.necesidadSeleccionada,
        idApoyo: apoyoSeleccionado?.idApoyo || formData.apoyoSeleccionado,
        observacion: formData.mensajeInteres + "\n\n" + formData.descripcionServicios
      };
      
      console.log("Enviando datos a la base de datos:", vinculacionData);
      
      // Usar el servicio API centralizado 
      const response = await post('/vinculacion', vinculacionData);
      console.log("Vinculación registrada en base de datos:", response);
      
      // Para el componente padre - incluir los documentos seleccionados
      const fullData = {
        escuela: {
          id: escuelaSeleccionada.id,
          cct: escuelaSeleccionada.cct,
          nombre: escuelaSeleccionada.nombre
        },
        necesidad: {
          id: formData.necesidadSeleccionada,
          nombre: necesidadSeleccionada?.nombre || '',
          tipo: necesidadSeleccionada?.tipo || '',
          idNecesidadApoyo: necesidadSeleccionada?.idNecesidadApoyo || formData.necesidadSeleccionada
        },
        apoyo: {
          id: formData.apoyoSeleccionado,
          titulo: apoyoSeleccionado?.titulo || '',
          tipo: apoyoSeleccionado?.tipo || '',
          idApoyo: apoyoSeleccionado?.idApoyo || formData.apoyoSeleccionado
        },
        detalles: {
          mensajeInteres: formData.mensajeInteres,
          descripcionServicios: formData.descripcionServicios,
          documentos: formData.documentos.map(file => file.name),
          fechaSolicitud: new Date().toISOString()
        },
        resultado: response
      };
      
      onVincular(escuelaSeleccionada, fullData);
      handleCloseVinculacionModal();
    } catch (error) {
      console.error("Error al crear vinculación en la base de datos:", error);
      setValidationErrors({ 
        submit: "Error al enviar la solicitud a la base de datos. Intente nuevamente." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funciones de filtrado
  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);
  };

  const aplicarFiltros = () => {
    onFilterChange(filtros);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = {
      nivelEducativo: "",
      tipoNecesidad: "",
      municipio: "",
      urgencia: "",
      matriculaMin: "",
      matriculaMax: "",
      soloCompatibles: false
    };
    setFiltros(filtrosLimpios);
    onFilterChange(filtrosLimpios);
  };

  const getBadgeColor = (nivel) => {
    const colores = {
      'Primaria': 'primary',
      'Secundaria': 'success',
      'Preescolar': 'info',
      'default': 'secondary'
    };
    return colores[nivel] || colores.default;
  };

  // Renderizado de resultados
  const renderResultado = (resultado) => {
    return (
      <div className="col-md-6 col-lg-4 mb-4" key={resultado.id}>
        <div className="card school-card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">{resultado.nombre}</h5>
              <span className={`badge bg-${getBadgeColor(resultado.nivelEducativo)}`}>
                {resultado.nivelEducativo}
              </span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-map-marker-alt text-danger me-2"></i>
              <small className="text-muted">{resultado.ubicacion}</small>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>Matrícula:</span>
                <strong>{resultado.matricula} alumnos</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Turno:</span>
                <strong>{resultado.turno}</strong>
              </div>
            </div>
            <h6 className="mb-2">Necesidades prioritarias:</h6>
            <div className="mb-3">
              {resultado.necesidades.map((necesidad, i) => (
                <span key={i} className={`badge bg-${necesidad.color} category-badge me-1 mb-1`}>
                  {necesidad.nombre}
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              {resultado.compatibilidad === 'total' ? (
                <span className="text-success">
                  <i className="fas fa-check-circle me-1"></i> Compatible con sus ofertas
                </span>
              ) : resultado.compatibilidad === 'parcial' ? (
                <span className="text-secondary">
                  <i className="fas fa-info-circle me-1"></i> Compatibilidad parcial
                </span>
              ) : (
                <span className="text-muted">
                  <i className="fas fa-times-circle me-1"></i> No compatible
                </span>
              )}
              
              {resultado.compatibilidad === 'total' ? (
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => handleOpenVinculacionModal(resultado)}
                >
                  <i className="fas fa-handshake me-1"></i> Vincular
                </button>
              ) : (
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onVerDetalles(resultado)}
                >
                  <i className="fas fa-eye me-1"></i> Ver detalles
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-5 pt-5">
      {/* El resto del JSX se mantiene igual... */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{titulo}</h2>
        <div>
          <button 
            className="btn btn-outline-primary me-2" 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <i className="fas fa-filter me-1"></i> Filtros
          </button>
          <button 
            className="btn btn-primary"
            onClick={onMapView}
          >
            <i className="fas fa-map-marked-alt me-2"></i> Ver Mapa
          </button>
        </div>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="mb-4">
          <div className="card school-filter-panel">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nivel educativo</label>
                  <select 
                    className="form-select"
                    value={filtros.nivelEducativo}
                    onChange={(e) => handleFiltroChange('nivelEducativo', e.target.value)}
                  >
                    <option value="">Todos</option>
                    {opcionesFiltros.nivelesEducativos?.map((nivel, i) => (
                      <option key={i} value={nivel.valor}>{nivel.nombre}</option>
                    ))}
                  </select>
                </div>
                {/* Resto de filtros... */}
                {/* Mantener igual */}
                <div className="col-12 d-flex justify-content-end">
                  <button 
                    className="btn btn-light me-2"
                    onClick={limpiarFiltros}
                  >
                    Limpiar
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={aplicarFiltros}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando escuelas compatibles...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      ) : escuelasParaMostrar.length > 0 ? (
        <div className="row">
          <div className="col-12 mb-3">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Mostrando escuelas compatibles con su perfil
            </div>
          </div>
          {escuelasParaMostrar.map(resultado => renderResultado(resultado))}
        </div>
      ) : (
        <div className="text-center my-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <p>No se encontraron escuelas compatibles con su perfil.</p>
        </div>
      )}

      {/* Paginación local */}
      {escuelasCompatibles.length > escuelasPorPagina && (
        <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${paginaLocal === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChangeLocal(paginaLocal - 1)}
                disabled={paginaLocal === 1}
              >
                Anterior
              </button>
            </li>
            
            {[...Array(totalPaginasLocal).keys()].map(numero => (
              <li key={numero} className={`page-item ${paginaLocal === (numero + 1) ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChangeLocal(numero + 1)}
                >
                  {numero + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${paginaLocal === totalPaginasLocal ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChangeLocal(paginaLocal + 1)}
                disabled={paginaLocal === totalPaginasLocal}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal de vinculación */}
      <Modal 
  show={showVinculacionModal} 
  onHide={handleCloseVinculacionModal}
  size="lg"
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>
      Vincular con {escuelaSeleccionada?.nombre}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {escuelaSeleccionada && (
      <Form onSubmit={handleSubmitVinculacion}>
        <div className="mb-4">
          <h5>Datos de la escuela</h5>
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>CCT:</strong> {escuelaSeleccionada.cct}
              </p>
              <p className="mb-1">
                <strong>Nivel:</strong> {escuelaSeleccionada.nivelEducativo}
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Matrícula:</strong> {escuelaSeleccionada.matricula} alumnos
              </p>
              <p className="mb-1">
                <strong>Ubicación:</strong> {escuelaSeleccionada.ubicacion}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Seleccione la necesidad que desea atender:</Form.Label>
            <Form.Select
              name="necesidadSeleccionada"
              value={formData.necesidadSeleccionada}
              onChange={handleFormChange}
              isInvalid={!!validationErrors.necesidadSeleccionada}
            >
              <option value="">-- Seleccione una necesidad --</option>
              {escuelaSeleccionada.necesidades.map((necesidad) => (
                <option key={necesidad.id} value={necesidad.id}>
                  {necesidad.nombre} (Prioridad: {necesidad.prioridad})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.necesidadSeleccionada}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Explique su interés en atender esta necesidad:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="mensajeInteres"
              value={formData.mensajeInteres}
              onChange={handleFormChange}
              isInvalid={!!validationErrors.mensajeInteres}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.mensajeInteres}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="mb-4">
          <h5>Detalles del apoyo ofrecido</h5>
          
          <Form.Group className="mb-3">
            <Form.Label>Seleccione el apoyo que puede proporcionar:</Form.Label>
            <Form.Select
              name="apoyoSeleccionado"
              value={formData.apoyoSeleccionado}
              onChange={handleFormChange}
              isInvalid={!!validationErrors.apoyoSeleccionado}
            >
              <option value="">-- Seleccione un apoyo --</option>
              {apoyosDisponibles.map((apoyo) => (
                <option key={apoyo.id || apoyo.idApoyo} value={apoyo.id || apoyo.idApoyo}>
                  {apoyo.titulo || apoyo.nombre} {apoyo.tipo ? `(${apoyo.tipo})` : ''}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.apoyoSeleccionado}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Describa los servicios o recursos que ofrecerá:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcionServicios"
              value={formData.descripcionServicios}
              onChange={handleFormChange}
              isInvalid={!!validationErrors.descripcionServicios}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.descripcionServicios}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {validationErrors.submit && (
          <div className="alert alert-danger mb-3">
            <i className="fas fa-exclamation-circle me-2"></i>
            {validationErrors.submit}
          </div>
        )}
      </Form>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseVinculacionModal} disabled={isSubmitting}>
      Cancelar
    </Button>
    <Button 
      variant="primary" 
      onClick={handleSubmitVinculacion}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Enviando...
        </>
      ) : (
        <>
          <i className="fas fa-handshake me-2"></i>
          Confirmar vinculación
        </>
      )}
    </Button>
  </Modal.Footer>
</Modal>
    </section>
  );
};

export default Busqueda;