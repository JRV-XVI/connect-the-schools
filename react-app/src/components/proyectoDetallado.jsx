import React, { useEffect, useState } from 'react';
import { put, get} from "../api.js";
const URL_BASE = 'http://localhost:4001/api';

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
  userData = null
}) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [mensaje, setMensaje] = useState('');
  const [etapaSeleccionada, setEtapaSeleccionada] = useState(null);
  const [archivoEtapa, setArchivoEtapa] = useState(null);
  const [archivoExistente, setArchivoExistente] = useState(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSendMessage = () => {
    if (mensaje.trim() !== '') {
      onSendMessage(mensaje);
      setMensaje('');
    }
  };

  const handleEtapaClick = (etapa) => {
    setEtapaSeleccionada(etapa);
  };

  const handleFileChange = (e) => {
    setArchivoEtapa(e.target.files[0]);
  };

  const fetchArchivo = async (idEtapa) => {
    try {
      const respuesta = await get(`/archivo/${idEtapa}`)
      setArchivoExistente(respuesta);
    } catch (error) {
      console.log("Error en obtener el archivo", error)
      setArchivoExistente([]);
    }
  };

  const handleFileUpload = async () => {
    try {
      if (!archivoEtapa) {
        alert('Por favor selecciona un archivo primero');
        return;
      }

      const formData = new FormData();
      formData.append('archivo', archivoEtapa);

      const respuesta = await fetch(`${URL_BASE}/archivo/${etapaSeleccionada.idEtapa}`, {
        method: 'PUT',
        body: formData
      });

      if (respuesta.ok) {
        console.log("Archivo subido correctamente!", formData)
        fetchArchivo(etapaSeleccionada.idEtapa);
        setArchivoEtapa(null);
      } else {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
      }
    } catch (error) {
      console.log("Error al subir archivo", error)
    }
  };

  const handleCancelUpload = () => {
    setArchivoEtapa(null);
    setEtapaSeleccionada(null);
  };

  // Agrega esta función para manejar la descarga
  const handleDownloadFile = async () => {
    window.open(`${URL_BASE}/archivo/${etapaSeleccionada.idEtapa}?download=true`);
  };

  // Función auxiliar para formatear fechas (YYYY-MM-DD a DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return '00:00';
  
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false // Usar formato 24h
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
  const getFaseClass = (estadoEntrega) => {
    return estadoEntrega ? 'border-left-success' : 'border-left-secondary';
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

  // 1. Agregar useEffect a nivel de componente
  useEffect(() => {
    if (etapaSeleccionada) {
      fetchArchivo(etapaSeleccionada.idEtapa);
    }
  }, [etapaSeleccionada]);

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
                Etapas
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
                  <h6 className="mb-0">Etapas del Proyecto</h6>
                  <button className="btn btn-sm btn-outline-primary" onClick={onUpdateProgress}>
                    <i className="fas fa-pen me-1"></i> Actualizar avance
                  </button>
                </div>

                {fases.map((etapa, index) => (
                  // Modifica la sección donde se renderizan las etapas
                  <div className={`timeline-item ${etapa.estadoEntrega ? 'completado' : 'pendiente'}`} key={index}>
                    <div 
                      className={`card ${getFaseClass(etapa.estadoEntrega)} ${index > 0 ? 'mt-3' : ''} pointer`} 
                      onClick={() => handleEtapaClick(etapa)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body py-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Etapa {etapa.orden}: {etapa.tituloEtapa}</h6>
                            <p className="mb-0 text-muted small">
                              {etapa.descripcionEtapa}
                            </p>
                          </div>
                          <span className={`badge ${etapa.estadoEntrega ? 'bg-success' : 'bg-secondary'}`}>
                            {etapa.estadoEntrega ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Modal para subir archivo */}
                {etapaSeleccionada && (
                  <div className="modal-backdrop show" style={{ display: 'block' }}></div>
                )}

                {etapaSeleccionada && (
                  <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Archivo de Etapa: {etapaSeleccionada.tituloEtapa}</h5>
                          <button type="button" className="btn-close" onClick={handleCancelUpload}></button>
                        </div>
                        <div className="modal-body">
                          <div className="mb-3">
                            <label htmlFor="fileInput" className="form-label">Selecciona un archivo:</label>
                            <input 
                              type="file" 
                              className="form-control" 
                              id="fileInput" 
                              onChange={handleFileChange} 
                            />
                          </div>
                          {/* Sección de archivo existente */}
                          {archivoExistente && (
                            <div className="mt-4 pt-3 border-top">
                              <h6 className="mb-3">Archivo actual:</h6>
                              <div className="d-flex align-items-center p-2 border rounded">
                                <div className="me-3">
                                  <i className={`${getDocumentIcon(archivoExistente.tipoContenido)} fa-2x`}></i>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-bold">Nombre Archivo: </div>
                                  <small className="text-muted">
                                    Subido el {new Date(archivoExistente.fechaSubida).toLocaleDateString()}
                                  </small>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-primary" 
                                  onClick={() => handleDownloadFile()}
                                >
                                  <i className="fas fa-download"></i>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={handleCancelUpload}>Cancelar</button>
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={handleFileUpload}
                            disabled={!archivoEtapa}
                          >
                            Subir archivo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
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
                          <div className={`message-wrapper ${mensaje.esPropio ? 'text-end' : 'text-start'} w-100`}>
                            <div className="message-header mb-1">
                              {mensaje.esPropio ? (
                                <small className="text-muted">{mensaje.hora || '00:00'}</small>
                              ) : (
                                <small><strong>{mensaje.remitente}</strong></small>
                              )}
                            </div>
                            <div className={`message-content p-3 ${mensaje.esPropio ? 'bg-primary text-white ms-auto' : 'bg-light me-auto'} rounded`}>
                              <p className="mb-0">{mensaje.contenido}</p>
                            </div>
                            <div className="message-footer mt-1">
                              {mensaje.esPropio ? (
                                <small><strong>Tú</strong></small>
                              ) : (
                                <small className="text-muted">{mensaje.hora || '00:00'}</small>
                              )}
                            </div>
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
                        <th>Etapa</th>
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
                          <td>Etapa : </td>
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