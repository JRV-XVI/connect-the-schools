import React, { useState, useEffect } from 'react';
import { Tab, Nav, Alert, Button, Form, Badge, Table, Card, Modal } from 'react-bootstrap';

const OfertaApoyo = ({ apoyos = [], onAddApoyo = () => {}, onEditApoyo = () => {}, onViewApoyo = () => {} }) => {
  const [activeTab, setActiveTab] = useState('material');
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Estados para modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentApoyo, setCurrentApoyo] = useState(null);
  
  // Estado del formulario para crear/editar apoyos (simplificado)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'material',
    subcategoria: '',
    estado: 'Disponible'
  });
  
  // Actualizar tipo y subcategoría cuando cambia la pestaña activa
  useEffect(() => {
    if (showNewOfferForm) {
      setFormData(prevData => ({
        ...prevData,
        tipo: activeTab,
        subcategoria: categoriasConfig[activeTab]?.subcategorias[0] || ''
      }));
    }
  }, [activeTab, showNewOfferForm]);
  
  // Estado para los filtros
  const [filtro, setFiltro] = useState({
    subcategoria: "Todas",
    estado: "Todos",
    busqueda: ""
  });
  
  // Definición de categorías y subcategorías
  const categoriasConfig = {
    material: {
      nombre: "Apoyo Material",
      subcategorias: [
        'Mobiliario',
        'Equipamiento tecnológico',
        'Material didáctico',
        'Material bibliográfico',
        'Material deportivo'
      ]
    },
    servicios: {
      nombre: "Servicios",
      subcategorias: [
        'Capacitación docente',
        'Mantenimiento',
        'Rehabilitación de espacios',
        'Servicios tecnológicos',
        'Servicios de consultoría'
      ]
    },
    economico: {
      nombre: "Apoyo Económico",
      subcategorias: [
        'Becas estudiantiles',
        'Apoyo a proyectos escolares',
        'Financiamiento de mejoras',
        'Patrocinios',
        'Donaciones monetarias'
      ]
    },
    voluntariado: {
      nombre: "Voluntariado",
      subcategorias: [
        'Clases y talleres',
        'Asesoría académica',
        'Actividades culturales',
        'Mantenimiento y limpieza',
        'Mentorías'
      ]
    }
  };

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
      subcategoria: "Todas",
      estado: "Todos",
      busqueda: ""
    });
  };
  
  // Aplicar filtros a la lista de apoyos
  const filtrarApoyos = (listaApoyos) => {
    return listaApoyos.filter(apoyo => {
      // Filtrar por tipo (tab activo)
      if (apoyo.tipo !== activeTab) return false;
      
      // Filtrar por subcategoría
      if (filtro.subcategoria !== "Todas" && apoyo.subcategoria !== filtro.subcategoria) return false;
      
      // Filtrar por estado
      if (filtro.estado !== "Todos" && apoyo.estado !== filtro.estado) return false;
      
      // Filtrar por búsqueda en título o descripción
      if (filtro.busqueda.trim() !== "") {
        const searchTerm = filtro.busqueda.toLowerCase();
        if (!apoyo.titulo.toLowerCase().includes(searchTerm) && 
            !apoyo.descripcion.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Manejador para cambios en el formulario (simplificado)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambiamos la categoría, actualizar la subcategoría con la primera opción de la nueva categoría
    if (name === 'tipo' && categoriasConfig[value]) {
      setFormData({
        ...formData,
        [name]: value,
        subcategoria: categoriasConfig[value].subcategorias[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Manejador para enviar el formulario de nueva oferta
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nuevaOferta = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: getCategoriaTexto(formData.tipo), 
      subcategoria: formData.subcategoria,
      estado: formData.estado,
      fechaCreacion: new Date().toISOString()
    };
    
    onAddApoyo(nuevaOferta);
    
    // Reiniciar formulario, manteniendo la categoría actual
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: activeTab,
      subcategoria: categoriasConfig[activeTab]?.subcategorias[0] || '',
      estado: 'Disponible'
    });
    
    setShowNewOfferForm(false);
  };
  
  // Manejador para guardar cambios en edición
  const handleSaveEdit = () => {
    if (!currentApoyo) return;
    
    const apoyoActualizado = {
      ...currentApoyo,
      ...formData
    };
    
    // Llamar al método de edición pasado por props
    onEditApoyo(apoyoActualizado.id, apoyoActualizado);
    
    setShowEditModal(false);
    setCurrentApoyo(null);
  };
  
  // Manejador para borrar apoyo
  const handleDeleteApoyo = () => {
    if (!currentApoyo) return;
    
    // Llamamos a onEditApoyo con un flag para indicar eliminación
    onEditApoyo(currentApoyo.id, { ...currentApoyo, _delete: true });
    
    setShowDeleteModal(false);
    setCurrentApoyo(null);
  };
  
  // Manejador para cambiar estado (disponible/no disponible)
  const handleToggleStatus = (apoyo) => {
    const nuevoEstado = apoyo.estado === 'Disponible' ? 'No disponible' : 'Disponible';
    
    onEditApoyo(apoyo.id, {
      ...apoyo,
      estado: nuevoEstado
    });
  };
  
  // Manejador para abrir modal de visualización
  const handleViewDetails = (apoyo) => {
    setCurrentApoyo(apoyo);
    setShowViewModal(true);
    
    // También podemos llamar al manejador pasado por props si necesita hacer algo específico
    onViewApoyo(apoyo.id);
  };
  
  // Manejador para abrir modal de edición
  const handleEdit = (apoyo) => {
    setCurrentApoyo(apoyo);
    
    // Inicializar el formulario con los datos del apoyo (simplificado)
    setFormData({
      titulo: apoyo.titulo || '',
      descripcion: apoyo.descripcion || '',
      tipo: apoyo.tipo || activeTab,
      subcategoria: apoyo.subcategoria || '',
      estado: apoyo.estado || 'Disponible'
    });
    
    setShowEditModal(true);
  };
  
  // Manejador para confirmar eliminación
  const handleConfirmDelete = (apoyo) => {
    setCurrentApoyo(apoyo);
    setShowDeleteModal(true);
  };

  // Función para renderizar la tabla de apoyos
  const renderApoyosTable = (tipo) => {
    // Aplicar filtros y paginación
    const apoyosFiltrados = filtrarApoyos(apoyos);
    
    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = apoyosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    
    // Actualizar el conteo de páginas después de filtrar
    const newPageCount = Math.ceil(apoyosFiltrados.length / itemsPerPage);
    if (currentPage > newPageCount && newPageCount > 0) {
      setCurrentPage(1);
    }
    
    return (
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Subcategoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((apoyo, index) => (
                <tr key={index}>
                  <td>{apoyo.titulo}</td>
                  <td>{apoyo.descripcion.length > 50 ? 
                      `${apoyo.descripcion.substring(0, 50)}...` : apoyo.descripcion}</td>
                  <td>
                    <Badge bg="info">{apoyo.subcategoria}</Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Badge 
                        bg={apoyo.estado === 'Disponible' ? 'success' : 
                           apoyo.estado === 'En proceso' ? 'primary' : 
                           apoyo.estado === 'Vinculado' ? 'warning' : 'secondary'}>
                        {apoyo.estado}
                      </Badge>
                      <div className="form-check form-switch ms-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={apoyo.estado === 'Disponible'} 
                          onChange={() => handleToggleStatus(apoyo)}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1" 
                        onClick={() => handleEdit(apoyo)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        className="me-1"
                        onClick={() => handleViewDetails(apoyo)}
                        title="Ver detalles"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        title="Eliminar"
                        onClick={() => handleConfirmDelete(apoyo)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No hay ofertas de apoyo registradas en esta categoría
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  };

  // Obtener las subcategorías según el tipo activo o seleccionado en el formulario
  const getSubcategoriesForType = (tipo) => {
    return categoriasConfig[tipo]?.subcategorias || [];
  };
  
  // Obtener las subcategorías según el tipo activo para filtros
  const getSubcategoriesForActiveType = () => {
    return categoriasConfig[activeTab]?.subcategorias || [];
  };

  // Obtener título para el formulario según el tipo activo
  const getFormTitle = () => {
    const tipoForm = formData.tipo || activeTab;
    switch (tipoForm) {
      case 'material':
        return 'Registrar Nueva Oferta de Apoyo Material';
      case 'servicios':
        return 'Registrar Nueva Oferta de Servicios';
      case 'economico':
        return 'Registrar Nueva Oferta de Apoyo Económico';
      case 'voluntariado':
        return 'Registrar Nueva Oferta de Voluntariado';
      default:
        return 'Registrar Nueva Oferta de Apoyo';
    }
  };

  const getCategoriaTexto = (tipo) => {
    switch (tipo) {
      case 'material':
        return 'Apoyo Material';
      case 'servicios':
        return 'Servicios';
      case 'economico':
        return 'Apoyo Económico';
      case 'voluntariado':
        return 'Voluntariado';
      default:
        return 'Apoyo Material'; // default por si falla
    }
  };
  

  // Obtener descripción de la sección según el tipo activo
  const getSectionDescription = () => {
    switch (activeTab) {
      case 'material':
        return 'Registre sus ofertas de donación o préstamo de recursos materiales como equipos, mobiliario, libros o materiales didácticos para escuelas.';
      case 'servicios':
        return 'Registre los servicios profesionales que puede ofrecer a las escuelas, como capacitación, mantenimiento, asesoría o servicios tecnológicos.';
      case 'economico':
        return 'Registre sus opciones de apoyo económico, patrocinio o financiamiento para proyectos escolares o mejoras en instituciones educativas.';
      case 'voluntariado':
        return 'Registre las actividades de voluntariado que puede ofrecer, como talleres, clases, tutorías o participación en eventos escolares.';
      default:
        return '';
    }
  };

  // Obtener título de sección según el tipo activo
  const getSectionTitle = () => {
    return categoriasConfig[activeTab]?.nombre || 'Ofertas de Apoyo';
  };
  
  // Cálculo y renderizado de la paginación
  const apoyosFiltrados = filtrarApoyos(apoyos);
  const pageCount = Math.ceil(apoyosFiltrados.length / itemsPerPage);
  
  const renderPagination = () => {
    if (pageCount <= 1) return null;
    
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

  // Obtener placeholder según el tipo seleccionado
  const getTitlePlaceholder = () => {
    const tipo = formData.tipo || activeTab;
    switch (tipo) {
      case 'material':
        return 'Ej: Donación de 10 computadoras';
      case 'servicios':
        return 'Ej: Taller de programación';
      case 'economico':
        return 'Ej: Becas para estudiantes destacados';
      case 'voluntariado':
        return 'Ej: Voluntariado en clases de inglés';
      default:
        return 'Título de la oferta';
    }
  };

  const getDescriptionPlaceholder = () => {
    const tipo = formData.tipo || activeTab;
    switch (tipo) {
      case 'material':
        return 'Describa con detalle su oferta de apoyo material...';
      case 'servicios':
        return 'Describa con detalle su oferta de servicios...';
      case 'economico':
        return 'Describa con detalle su oferta de apoyo económico...';
      case 'voluntariado':
        return 'Describa con detalle su oferta de voluntariado...';
      default:
        return 'Describa con detalle su oferta...';
    }
  };

  return (
    <div id="ofertas-apoyo" className="mt-5 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestión de Ofertas de Apoyo</h4>
        <Button 
          variant="primary" 
          onClick={() => setShowNewOfferForm(!showNewOfferForm)}
        >
          <i className="fas fa-plus me-2"></i> Nueva Oferta de Apoyo
        </Button>
      </div>
      
      <Card>
        <Card.Header>
          <Nav variant="tabs" className="card-header-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            {Object.entries(categoriasConfig).map(([key, config]) => (
              <Nav.Item key={key}>
                <Nav.Link eventKey={key}>{config.nombre}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Header>
        <Card.Body>
          {/* Sección de filtros */}
          <div className="border-bottom pb-3 mb-3">
            <h6>Filtros de ofertas</h6>
            <div className="row g-3 align-items-end">
              <div className="col-md">
                <Form.Label>Subcategoría</Form.Label>
                <Form.Select 
                  name="subcategoria" 
                  value={filtro.subcategoria} 
                  onChange={handleFiltroChange}
                >
                  <option value="Todas">Todas</option>
                  {getSubcategoriesForActiveType().map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </div>
              
              <div className="col-md">
                <Form.Label>Estado</Form.Label>
                <Form.Select 
                  name="estado" 
                  value={filtro.estado} 
                  onChange={handleFiltroChange}
                >
                  <option value="Todos">Todos</option>
                  <option value="Disponible">Disponible</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Vinculado">Vinculado</option>
                  <option value="No disponible">No disponible</option>
                </Form.Select>
              </div>
              
              <div className="col-md">
                <Form.Label>Buscar</Form.Label>
                <Form.Control
                  type="text" 
                  placeholder="Buscar por título..." 
                  name="busqueda" 
                  value={filtro.busqueda} 
                  onChange={handleFiltroChange}
                />
              </div>
              
              <div className="col-md-auto d-flex gap-2">
                <Button variant="outline-secondary" onClick={limpiarFiltros}>
                  Limpiar
                </Button>
                <Button variant="success">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>

          <Tab.Content>
            <Tab.Pane active>
              <div className="mb-4">
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i> {getSectionDescription()}
                </Alert>
                
                <h5 className="mb-3">{getSectionTitle()}</h5>
                
                {/* Tabla de ofertas de apoyo */}
                {renderApoyosTable(activeTab)}
                
                {/* Paginación */}
                <div className="mt-3">
                  {renderPagination()}
                </div>
                
                {/* Mostrar botón o formulario según el estado */}
                {!showNewOfferForm ? (
                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={() => setShowNewOfferForm(true)}
                  >
                    <i className="fas fa-plus me-2"></i> Nueva Oferta de {getSectionTitle()}
                  </Button>
                ) : (
                  <Card className="mt-4">
                    <Card.Header>
                      <h5 className="card-title mb-0">{getFormTitle()}</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <Form.Group>
                              <Form.Label>Categoría</Form.Label>
                              <Form.Select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleFormChange}
                                required
                              >
                                {Object.entries(categoriasConfig).map(([key, config]) => (
                                  <option key={key} value={key}>{config.nombre}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group>
                              <Form.Label>Subcategoría</Form.Label>
                              <Form.Select
                                name="subcategoria"
                                value={formData.subcategoria}
                                onChange={handleFormChange}
                                required
                              >
                                <option value="">Seleccionar...</option>
                                {getSubcategoriesForType(formData.tipo).map((cat, idx) => (
                                  <option key={idx} value={cat}>{cat}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </div>
                        
                        <div className="row mb-3">
                          <div className="col-md-12">
                            <Form.Group>
                              <Form.Label>Título de la oferta</Form.Label>
                              <Form.Control
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleFormChange}
                                placeholder={getTitlePlaceholder()}
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                        
                        <div className="row mb-3">
                          <div className="col-md-12">
                            <Form.Group>
                              <Form.Label>Descripción detallada</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={4}
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleFormChange}
                                placeholder={getDescriptionPlaceholder()}
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Estado</Form.Label>
                          <Form.Select
                            name="estado"
                            value={formData.estado}
                            onChange={handleFormChange}
                            required
                          >
                            <option value="Disponible">Disponible</option>
                            <option value="No disponible">No disponible</option>
                          </Form.Select>
                        </Form.Group>
                        
                        <div className="text-end">
                          <Button 
                            type="button" 
                            variant="light" 
                            className="me-2" 
                            onClick={() => setShowNewOfferForm(false)}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" variant="primary">
                            <i className="fas fa-save me-2"></i>Guardar Oferta
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
      
      {/* Modal para ver detalles */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalles de oferta de apoyo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentApoyo && (
            <div>
              <h4>{currentApoyo.titulo}</h4>
              
              <div className="mb-3">
                <Badge 
                  bg="secondary"
                  className="me-2">
                  {categoriasConfig[currentApoyo.tipo]?.nombre || "Categoría no especificada"}
                </Badge>
                <Badge bg={currentApoyo.estado === 'Disponible' ? 'success' : 
                           currentApoyo.estado === 'En proceso' ? 'primary' : 
                           currentApoyo.estado === 'Vinculado' ? 'warning' : 'secondary'}
                      className="me-2">
                  {currentApoyo.estado}
                </Badge>
                <Badge bg="info">{currentApoyo.subcategoria}</Badge>
              </div>
              
              <h6>Descripción:</h6>
              <p>{currentApoyo.descripcion}</p>
              
              {currentApoyo.fechaCreacion && (
                <div className="text-muted mt-3">
                  <small>
                    Fecha de creación: {new Date(currentApoyo.fechaCreacion).toLocaleDateString()}
                  </small>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => {
            setShowViewModal(false);
            handleConfirmDelete(currentApoyo);
          }}>
            <i className="fas fa-trash me-2"></i>
            Eliminar
          </Button>
          <Button variant="outline-primary" onClick={() => {
            setShowViewModal(false);
            handleEdit(currentApoyo);
          }}>
            <i className="fas fa-edit me-2"></i>
            Editar
          </Button>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal para editar */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar oferta de apoyo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Título de la oferta</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Tipo de apoyo</Form.Label>
                  <Form.Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleFormChange}
                    required
                  >
                    {Object.entries(categoriasConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Subcategoría</Form.Label>
                  <Form.Select
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {categoriasConfig[formData.tipo || activeTab]?.subcategorias.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="No disponible">No disponible</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Vinculado">Vinculado</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción detallada</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="me-auto" onClick={() => {
            setShowEditModal(false);
            handleConfirmDelete(currentApoyo);
          }}>
            <i className="fas fa-trash me-2"></i>
            Eliminar
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            <i className="fas fa-save me-2"></i>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal para confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentApoyo && (
            <div>
              <p>¿Está seguro que desea eliminar la siguiente oferta?</p>
              <div className="alert alert-warning">
                <strong>{currentApoyo.titulo}</strong>
                <p className="mb-0">{currentApoyo.subcategoria}</p>
              </div>
              <p className="text-danger">Esta acción no se puede deshacer.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteApoyo}>
            <i className="fas fa-trash me-2"></i>
            Eliminar Oferta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OfertaApoyo;