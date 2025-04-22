import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Asegúrate de tener react-bootstrap instalado

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
  cargando = false,
  apoyosDisponibles = [] // Nuevo prop para los apoyos registrados del aliado
}) => {
  // Estados existentes
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
  
  // Nuevos estados para el modal de vinculación
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

  // Función para abrir modal de vinculación
  const handleOpenVinculacionModal = (escuela) => {
    setEscuelaSeleccionada(escuela);
    setShowVinculacionModal(true);
  };

  // Función para cerrar modal
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

  // Manejar archivos adjuntos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      documentos: [...formData.documentos, ...files]
    });
  };

  // Eliminar archivo adjunto
  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.documentos];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      documentos: updatedFiles
    });
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
  const handleSubmitVinculacion = (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Aquí simularíamos el envío a la API
    setTimeout(() => {
      // Datos a enviar
      const solicitudData = {
        escuelaId: escuelaSeleccionada.id,
        necesidadId: formData.necesidadSeleccionada,
        mensaje: formData.mensajeInteres,
        apoyoId: formData.apoyoSeleccionado,
        descripcion: formData.descripcionServicios,
        documentos: formData.documentos.map(doc => doc.name) // En una implementación real, aquí se subirían los archivos
      };
      
      console.log("Enviando solicitud de vinculación:", solicitudData);
      
      // Notificar al componente padre
      onVincular(escuelaSeleccionada, solicitudData);
      
      // Cerrar modal y resetear
      handleCloseVinculacionModal();
      setIsSubmitting(false);
    }, 1000);
  };

  // Código existente mantenido...
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

  // Modificación en renderResultado para usar el nuevo handleOpenVinculacionModal
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
                <div className="col-md-4">
                  <label className="form-label">Tipo de necesidad</label>
                  <select 
                    className="form-select"
                    value={filtros.tipoNecesidad}
                    onChange={(e) => handleFiltroChange('tipoNecesidad', e.target.value)}
                  >
                    <option value="">Todas</option>
                    {opcionesFiltros.tiposNecesidad?.map((tipo, i) => (
                      <option key={i} value={tipo.valor}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Municipio</label>
                  <select 
                    className="form-select"
                    value={filtros.municipio}
                    onChange={(e) => handleFiltroChange('municipio', e.target.value)}
                  >
                    <option value="">Todos</option>
                    {opcionesFiltros.municipios?.map((municipio, i) => (
                      <option key={i} value={municipio.valor}>{municipio.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Urgencia</label>
                  <select 
                    className="form-select"
                    value={filtros.urgencia}
                    onChange={(e) => handleFiltroChange('urgencia', e.target.value)}
                  >
                    <option value="">Cualquiera</option>
                    {opcionesFiltros.nivelesUrgencia?.map((urgencia, i) => (
                      <option key={i} value={urgencia.valor}>{urgencia.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Matrícula</label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Mínimo"
                      value={filtros.matriculaMin}
                      onChange={(e) => handleFiltroChange('matriculaMin', e.target.value)}
                    />
                    <span className="input-group-text">-</span>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Máximo"
                      value={filtros.matriculaMax}
                      onChange={(e) => handleFiltroChange('matriculaMax', e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Compatibilidad con mis ofertas</label>
                  <div className="d-flex align-items-center mt-2">
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="matchFilter"
                        checked={filtros.soloCompatibles}
                        onChange={(e) => handleFiltroChange('soloCompatibles', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="matchFilter">Solo mostrar compatibles</label>
                    </div>
                  </div>
                </div>
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

      {/* Resultados de búsqueda */}
      {cargando ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Buscando escuelas...</p>
        </div>
      ) : resultados.length > 0 ? (
        <div className="row">
          {resultados.map(resultado => renderResultado(resultado))}
        </div>
      ) : (
        <div className="text-center my-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <p>No se encontraron escuelas con los criterios especificados.</p>
        </div>
      )}

      {/* Paginación */}
      {resultados.length > 0 && totalPaginas > 1 && (
        <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => onPageChange(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
            </li>
            
            {[...Array(totalPaginas).keys()].map(numero => (
              <li key={numero} className={`page-item ${paginaActual === (numero + 1) ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => onPageChange(numero + 1)}
                >
                  {numero + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => onPageChange(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* NUEVO: Modal para solicitud de vinculación */}
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
            Solicitud de Vinculación
            {escuelaSeleccionada && (
              <div className="fs-6 mt-1 text-muted">Escuela: {escuelaSeleccionada.nombre}</div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {escuelaSeleccionada && (
            <Form onSubmit={handleSubmitVinculacion}>
              {/* Selección de necesidad específica */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>1. Seleccione la necesidad específica que desea atender</strong>
                </Form.Label>
                <Form.Select 
                  name="necesidadSeleccionada" 
                  value={formData.necesidadSeleccionada}
                  onChange={handleFormChange}
                  isInvalid={!!validationErrors.necesidadSeleccionada}
                >
                  <option value="">-- Seleccione una necesidad --</option>
                  {escuelaSeleccionada.necesidades.map((necesidad, idx) => (
                    <option key={idx} value={necesidad.id || idx}>
                      {necesidad.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.necesidadSeleccionada}
                </Form.Control.Feedback>
              </Form.Group>

              <hr className="my-4" />
              
              {/* Mensaje de interés */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>2. Explique su interés en atender esta necesidad</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="mensajeInteres"
                  rows={3}
                  placeholder="Detalle por qué está interesado en atender esta necesidad específica..."
                  value={formData.mensajeInteres}
                  onChange={handleFormChange}
                  isInvalid={!!validationErrors.mensajeInteres}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.mensajeInteres}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Selección de apoyo registrado */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>3. Seleccione el apoyo registrado en su perfil</strong>
                </Form.Label>
                <Form.Select
                  name="apoyoSeleccionado"
                  value={formData.apoyoSeleccionado}
                  onChange={handleFormChange}
                  isInvalid={!!validationErrors.apoyoSeleccionado}
                >
                  <option value="">-- Seleccione un apoyo --</option>
                  {apoyosDisponibles.map((apoyo, idx) => (
                    <option key={idx} value={apoyo.id || idx}>
                      {apoyo.titulo || `Apoyo ${idx + 1}`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.apoyoSeleccionado}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Si no tiene apoyos registrados, regrese a "Gestión de Ofertas de Apoyo" y agregue uno.
                </Form.Text>
              </Form.Group>
              
              {/* Descripción de servicios */}
              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>4. Describa los servicios o soluciones que ofrece</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcionServicios"
                  rows={4}
                  placeholder="Detalle los servicios específicos, recursos o soluciones que proporcionará..."
                  value={formData.descripcionServicios}
                  onChange={handleFormChange}
                  isInvalid={!!validationErrors.descripcionServicios}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.descripcionServicios}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Documentos de respaldo */}
              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>5. Adjunte documentos de respaldo (opcional)</strong>
                </Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  Puede adjuntar cotizaciones, catálogos, certificaciones u otro material de soporte.
                </Form.Text>
                
                {/* Lista de archivos adjuntos */}
                {formData.documentos.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2">Archivos adjuntos:</p>
                    <ul className="list-group">
                      {formData.documentos.map((file, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i className="fas fa-file me-2"></i>
                            {file.name}
                          </div>
                          <button 
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveFile(idx)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
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
              'Enviar Solicitud'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Busqueda;