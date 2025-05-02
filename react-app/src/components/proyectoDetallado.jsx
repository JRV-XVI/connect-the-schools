import React, { useEffect, useState } from 'react';
import { get } from "../api.js";
const URL_BASE = 'http://localhost:4001/api';

const ProyectoDetallado = ({
  proyecto,
  fases = [],
  mensajes = [],
  onSendMessage = () => {},
  onGoBack = () => {},
  onFIleUploadSucces = () => {}
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

        onFIleUploadSucces(etapaSeleccionada.idEtapa)

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
          <small>Escuela: <strong>{proyecto.escuela}</strong> | Inicio: {new Date(proyecto.fechaInicio).toLocaleDateString()} | Finalización estimada: {new Date(proyecto.fechaFin).toLocaleDateString()}</small>
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
                style={{ width: `${proyecto.progreso}%` }} 
                aria-valuenow={proyecto.progreso} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {proyecto.progreso}% completado
              </div>
            </div>
            <div className="d-flex justify-content-between text-muted small">
              <span>Inicio: {new Date(proyecto.fechaInicio).toLocaleDateString()}</span>
              <span>Hoy</span>
              <span>Fin: {new Date(proyecto.fechaFin).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="col-md-6">
            <h6>Información General</h6>
            <div className="row">
              <div className="col-6">
                <p className="mb-1"><strong>Beneficiados:</strong> {proyecto.estudiantes} alumnos</p>
                <p className="mb-1"><strong>Responsable:</strong> {proyecto.escuela}</p>
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
                className={`nav-link ${activeTab === 'communication' ? 'active' : ''}`} 
                onClick={() => handleTabChange('communication')}
                type="button" 
                role="tab"
              >
                Comunicación
              </button>
            </li>
          </ul>

          <div className="tab-content p-3 border rounded">
            {/* Tab Cronograma */}
            {activeTab === 'timeline' && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Etapas del Proyecto</h6>
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
                                  <div className="fw-bold"></div>
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
                                <small className="text-muted">{new Date(mensaje.hora).toLocaleTimeString()}</small>
                              ) : (
                                <div>
                                  <small>
                                    <strong>{mensaje.remitente}</strong>
                                    {mensaje.tipoRemitente && (
                                      <span 
                                        className={`badge ms-2 ${
                                          mensaje.tipoRemitente === 'Escuela' ? 'bg-success' : 
                                          mensaje.tipoRemitente === 'Aliado' ? 'bg-primary' : 
                                          mensaje.tipoRemitente === 'Administrador' ? 'bg-danger' : 
                                          'bg-secondary'
                                        }`} 
                                        style={{fontSize: '0.7em'}}
                                      >
                                        {mensaje.tipoRemitente}
                                      </span>
                                    )}
                                  </small>
                                </div>
                              )}
                            </div>
                            <div className={`message-content p-3 ${mensaje.esPropio ? 'bg-primary text-white ms-auto' : 'bg-light me-auto'} rounded`}>
                              <p className="mb-0">{mensaje.contenido}</p>
                            </div>
                            <div className="message-footer mt-1">
                              {mensaje.esPropio ? (
                                <small><strong>Tú</strong></small>
                              ) : (
                                <small className="text-muted">{new Date(mensaje.hora).toLocaleTimeString()}</small>
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
          </div>
        </div>

        {/* Botones de acción en la parte inferior */}
        <div className="mt-4 text-end">
          <button className="btn btn-outline-secondary me-2" onClick={onGoBack}>
            <i className="fas fa-arrow-left me-1"></i> Volver a proyectos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectoDetallado;