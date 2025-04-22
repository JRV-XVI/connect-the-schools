import React, { useState } from 'react';

const ProyectoDetallado = ({
  proyecto,
  fases = [],
  evidencias = [],
  mensajes = [],
  documentos = [],
  onExportReport = () => {},
  onAddRecord = () => {},
  onUpdateProgress = () => {},
  onUploadEvidence = () => {},
  onSendMessage = () => {},
  onUploadDocument = () => {},
  onGoBack = () => {},
  onGenerateReport = () => {},
  onSaveChanges = () => {},
  onDownloadDocument = () => {},
  onViewDocument = () => {},
}) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [mensaje, setMensaje] = useState('');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSendMessage = () => {
    if (mensaje.trim() !== '') {
      onSendMessage(mensaje);
      setMensaje('');
    }
  };

  // Función auxiliar para formatear fechas (YYYY-MM-DD a DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calcular el porcentaje de progreso basado en fechas
  const calcularProgreso = () => {
    const inicio = new Date(proyecto.fechaInicio);
    const fin = new Date(proyecto.fechaFin);
    const hoy = new Date();

    if (hoy <= inicio) return 0;
    if (hoy >= fin) return 100;

    const totalDias = (fin - inicio) / (1000 * 60 * 60 * 24);
    const diasTranscurridos = (hoy - inicio) / (1000 * 60 * 60 * 24);
    
    return Math.round((diasTranscurridos / totalDias) * 100);
  };

  // Determinar la clase de estilo para fases según su estado
  const getFaseClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'completado': return 'border-left-success';
      case 'en progreso': return 'border-left-primary';
      default: return 'border-left-secondary';
    }
  };

  // Determinar la clase de badge según el estado del proyecto
  const getStateBadgeClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'en ejecución': 
      case 'en progreso': return 'bg-success';
      case 'pendiente': return 'bg-secondary';
      case 'retrasado': return 'bg-warning';
      case 'completado': return 'bg-info';
      case 'cancelado': return 'bg-danger';
      default: return 'bg-primary';
    }
  };

  // Determinar icono para tipo de documento
  const getDocumentIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'pdf': return 'fas fa-file-pdf text-danger';
      case 'excel': return 'fas fa-file-excel text-success';
      case 'word': return 'fas fa-file-word text-primary';
      case 'imagen': return 'fas fa-file-image text-info';
      default: return 'fas fa-file text-secondary';
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{proyecto.nombre}</h5>
          <span className={`badge ${getStateBadgeClass(proyecto.estado)}`}>{proyecto.estado}</span>
        </div>
        <div className="text-muted">
          <small>Escuela: <strong>{proyecto.escuela}</strong> | Inicio: {formatDate(proyecto.fechaInicio)} | Finalización estimada: {formatDate(proyecto.fechaFin)}</small>
        </div>
      </div>

      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <h6>Progreso del proyecto</h6>
            <div className="progress mb-2" style={{ height: '20px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${proyecto.progreso || calcularProgreso()}%` }} 
                aria-valuenow={proyecto.progreso || calcularProgreso()} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {proyecto.progreso || calcularProgreso()}% completado
              </div>
            </div>
            <div className="d-flex justify-content-between text-muted small">
              <span>Inicio: {formatDate(proyecto.fechaInicio)}</span>
              <span>Hoy</span>
              <span>Fin: {formatDate(proyecto.fechaFin)}</span>
            </div>
          </div>
          <div className="col-md-6">
            <h6>Información General</h6>
            <div className="row">
              <div className="col-6">
                <p className="mb-1"><strong>Inversión:</strong> ${proyecto.inversion?.toLocaleString()} MXN</p>
                <p className="mb-1"><strong>Beneficiados:</strong> {proyecto.beneficiados?.toLocaleString()} alumnos</p>
              </div>
              <div className="col-6">
                <p className="mb-1"><strong>Responsable:</strong> {proyecto.responsable}</p>
                <p className="mb-1"><strong>Tipo de apoyo:</strong> {proyecto.tipoApoyo}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <ul className="nav nav-pills mb-3" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`} 
                onClick={() => handleTabChange('timeline')}
                type="button" 
                role="tab"
              >
                Cronograma
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'evidence' ? 'active' : ''}`} 
                onClick={() => handleTabChange('evidence')}
                type="button" 
                role="tab"
              >
                Evidencias
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'communication' ? 'active' : ''}`} 
                onClick={() => handleTabChange('communication')}
                type="button" 
                role="tab"
              >
                Comunicación
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`} 
                onClick={() => handleTabChange('documents')}
                type="button" 
                role="tab"
              >
                Documentos
              </button>
            </li>
          </ul>

          <div className="tab-content p-3 border rounded">
            {/* Tab Cronograma */}
            {activeTab === 'timeline' && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Fases del Proyecto</h6>
                  <button className="btn btn-sm btn-outline-primary" onClick={onUpdateProgress}>
                    <i className="fas fa-pen me-1"></i> Actualizar avance
                  </button>
                </div>

                {fases.map((fase, index) => (
                  <div className={`timeline-item ${fase.estado.toLowerCase()}`} key={index}>
                    <div className={`card ${getFaseClass(fase.estado)} ${index > 0 ? 'mt-3' : ''}`}>
                      <div className="card-body py-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{fase.nombre}</h6>
                            <p className="mb-0 text-muted small">
                              {formatDate(fase.fechaInicio)} - {formatDate(fase.fechaFin)}
                            </p>
                          </div>
                          <span className={`badge ${getStateBadgeClass(fase.estado)}`}>
                            {fase.estado}
                            {fase.progreso && fase.estado.toLowerCase() === 'en progreso' ? ` (${fase.progreso}%)` : ''}
                          </span>
                        </div>
                        {fase.entregables && fase.entregables.length > 0 && (
                          <div className="mt-2 small">
                            <p className="mb-1">
                              {fase.estado.toLowerCase() === 'completado' 
                                ? 'Entregables completados:' 
                                : fase.estado.toLowerCase() === 'en progreso' 
                                  ? 'Actividades en curso:' 
                                  : 'Entregables planificados:'}
                            </p>
                            <ul className="mb-0">
                              {fase.entregables.map((entregable, i) => (
                                <li key={i} className={`text-${entregable.estado === 'completado' ? 'success' : entregable.estado === 'en progreso' ? 'primary' : 'muted'}`}>
                                  {entregable.estado === 'completado' ? (
                                    <i className="fas fa-check-circle me-1"></i>
                                  ) : entregable.estado === 'en progreso' ? (
                                    <i className="fas fa-spinner me-1"></i>
                                  ) : (
                                    <i className="far fa-circle me-1"></i>
                                  )}
                                  {entregable.nombre}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Evidencias */}
            {activeTab === 'evidence' && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Evidencias del Proyecto</h6>
                  <button className="btn btn-sm btn-primary" onClick={onUploadEvidence}>
                    <i className="fas fa-plus me-1"></i> Subir nueva evidencia
                  </button>
                </div>

                <div className="row g-3">
                  {evidencias.map((evidencia, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="card h-100">
                        <img 
                          src={evidencia.imagen || "https://via.placeholder.com/300x200?text=Evidencia"} 
                          className="card-img-top" 
                          alt={evidencia.titulo}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{evidencia.titulo}</h6>
                          <p className="card-text small">{evidencia.descripcion}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className={`badge ${getStateBadgeClass(evidencia.fase)}`}>Fase {evidencia.fase}</span>
                            <small className="text-muted">{formatDate(evidencia.fecha)}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {evidencias.length === 0 && (
                    <div className="col-12 text-center my-4">
                      <i className="fas fa-images fa-3x text-muted mb-3"></i>
                      <p>No hay evidencias registradas para este proyecto.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab Comunicación */}
            {activeTab === 'communication' && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Comunicación con Escuela</h6>
                  <button className="btn btn-sm btn-primary" onClick={() => document.getElementById('messageInput').focus()}>
                    <i className="fas fa-paper-plane me-1"></i> Enviar mensaje
                  </button>
                </div>

                <div className="card chat-container">
                  <div className="card-body chat-history p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="message-thread">
                      {mensajes.map((mensaje, index) => (
                        <div 
                          className={`message ${mensaje.esPropio ? 'outgoing' : 'incoming'} mb-3`} 
                          key={index}
                        >
                          <div className="message-header d-flex justify-content-between mb-1">
                            <small><strong>{mensaje.remitente}</strong>{mensaje.esPropio && " (Usted)"}</small>
                            <small className="text-muted">{formatDate(mensaje.fecha)} {mensaje.hora}</small>
                          </div>
                          <div className={`message-content p-3 ${mensaje.esPropio ? 'bg-primary text-white' : 'bg-light'} rounded`}>
                            <p className="mb-0">{mensaje.contenido}</p>
                          </div>
                        </div>
                      ))}

                      {mensajes.length === 0 && (
                        <div className="text-center my-4">
                          <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                          <p>No hay mensajes para mostrar. Inicia la conversación.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card-footer p-2">
                    <div className="input-group">
                      <input 
                        id="messageInput"
                        type="text" 
                        className="form-control" 
                        placeholder="Escriba su mensaje..." 
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button className="btn btn-primary" onClick={handleSendMessage}>
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Documentos */}
            {activeTab === 'documents' && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Documentación del Proyecto</h6>
                  <button className="btn btn-sm btn-primary" onClick={onUploadDocument}>
                    <i className="fas fa-upload me-1"></i> Subir documento
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Documento</th>
                        <th>Tipo</th>
                        <th>Fase</th>
                        <th>Subido por</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentos.map((documento, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                <i className={`${getDocumentIcon(documento.tipo)} fa-lg`}></i>
                              </div>
                              <div>
                                <div>{documento.nombre}</div>
                                <small className="text-muted">{documento.tamaño}</small>
                              </div>
                            </div>
                          </td>
                          <td>{documento.categoria}</td>
                          <td>{documento.fase}</td>
                          <td>{documento.autor}</td>
                          <td>{formatDate(documento.fecha)}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary me-1" 
                              onClick={() => onDownloadDocument(documento)}
                            >
                              <i className="fas fa-download"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => onViewDocument(documento)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {documentos.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <i className="fas fa-file fa-3x text-muted mb-3 d-block"></i>
                            No hay documentos registrados para este proyecto.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción en la parte inferior */}
        <div className="mt-4 text-end">
          <button className="btn btn-outline-secondary me-2" onClick={onGoBack}>
            <i className="fas fa-arrow-left me-1"></i> Volver a proyectos
          </button>
          <button className="btn btn-outline-primary me-2" onClick={onGenerateReport}>
            <i className="fas fa-file-export me-1"></i> Generar reporte
          </button>
          <button className="btn btn-primary" onClick={onSaveChanges}>
            <i className="fas fa-save me-1"></i> Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectoDetallado;