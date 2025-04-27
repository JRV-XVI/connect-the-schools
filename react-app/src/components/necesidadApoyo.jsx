import React, { useState, useEffect } from 'react';
import { Tab, Nav, Alert, Button, Form, Badge, Table, Card, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

const NecesidadApoyo = ({ necesidades =[], setNecesidades = () => { }, onAddNecesidad = () => { }, onEditNecesidad = () => { }, onViewNecesidad = () => { }, userData = {} }) => {
  const [activeTab, setActiveTab] = useState('infraestructura');
  const [showNewNeedForm, setShowNewNeedForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Estados para modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentNecesidad, setCurrentNecesidad] = useState(null);
  
  // Estado del formulario para crear/editar necesidades
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'infraestructura',
    subcategoria: '',
    prioridad: 'Media',
    estado: 'Activa'
  });
  
  // Actualizar tipo y subcategoría cuando cambia la pestaña activa
  useEffect(() => {
    if (showNewNeedForm) {
      setFormData(prevData => ({
        ...prevData,
        tipo: activeTab,
        subcategoria: categoriasConfig[activeTab]?.subcategorias[0] || ''
      }));
    }
  }, [activeTab, showNewNeedForm]);
  
  // Estado para los filtros
  const [filtro, setFiltro] = useState({
    subcategoria: "Todas",
    estado: "Todos",
    prioridad: "Todas",
    busqueda: ""
  });
  
  // Definición de categorías y subcategorías para necesidades escolares
  const categoriasConfig = {
    infraestructura: {
      nombre: "Infraestructura",
      subcategorias: [
        'Aulas',
        'Áreas recreativas',
        'Instalaciones deportivas',
        'Sanitarios',
        'Instalaciones eléctricas'
      ]
    },
    equipamiento: {
      nombre: "Equipamiento Tecnológico",
      subcategorias: [
        'Computadoras',
        'Proyectores',
        'Pizarrones interactivos',
        'Internet',
        'Tabletas'
      ]
    },
    material: {
      nombre: "Material Didáctico",
      subcategorias: [
        'Libros',
        'Material bibliográfico',
        'Material de laboratorio',
        'Material artístico',
        'Material deportivo'
      ]
    },
    capacitacion: {
      nombre: "Capacitación",
      subcategorias: [
        'Formación docente',
        'Talleres para estudiantes',
        'Cursos para personal',
        'Educación especial',
        'Programas educativos'
      ]
    }
  };

  // Opciones de prioridad
  const prioridadesOptions = [
    { value: 'Alta', color: 'danger' },
    { value: 'Media', color: 'warning' },
    { value: 'Baja', color: 'info' }
  ];

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
      prioridad: "Todas",
      busqueda: ""
    });
  };
  
  // Aplicar filtros a la lista de necesidades
  const filtrarNecesidades = (listaNecesidades) => {
    return listaNecesidades.filter(necesidad => {
      // Filtrar por tipo (tab activo)
      if (necesidad.tipo !== activeTab) return false;
      
      // Filtrar por subcategoría
      if (filtro.subcategoria !== "Todas" && necesidad.subcategoria !== filtro.subcategoria) return false;
      
      // Filtrar por estado
      if (filtro.estado !== "Todos" && necesidad.estado !== filtro.estado) return false;
      
      // Filtrar por prioridad
      if (filtro.prioridad !== "Todas" && necesidad.prioridad !== filtro.prioridad) return false;
      
      // Filtrar por búsqueda en título o descripción
      if (filtro.busqueda.trim() !== "") {
        const searchTerm = filtro.busqueda.toLowerCase();
        if (!necesidad.titulo.toLowerCase().includes(searchTerm) && 
            !necesidad.descripcion.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Manejador para cambios en el formulario
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

  // Manejador para enviar el formulario de nueva necesidad
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nuevaNecesidad = {
      ...formData,
      idUsuario: userData?.idUsuario, 
      categoria: formData.tipo,
      subcategoria: formData.subcategoria,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad,
      fechaCreacion: new Date(),
      estadoValidacion: 0
    };
  
    try {
      const response = await axios.post('http://localhost:4001/api/necesidadApoyo', nuevaNecesidad, {
        withCredentials: true,
      });
  
      console.log('[SUCCESS] Necesidad de apoyo creada:', response.data);
  
      setNecesidades([...necesidades, response.data]);
  
      setFormData({
        titulo: '',
        descripcion: '',
        tipo: activeTab,
        subcategoria: categoriasConfig[activeTab]?.subcategorias[0] || '',
        prioridad: 'Media',
        estado: 'Activa',
      });
  
      setShowNewNeedForm(false);
      alert('¡Necesidad de apoyo registrada exitosamente!');
    } catch (error) {
      console.error('[ERROR] Al crear necesidad de apoyo:', error.response?.data || error.message);
      alert('Error al registrar la necesidad de apoyo. Verifica los campos.');
    }
  };
  
  // Manejador para guardar cambios en edición
  const handleSaveEdit = () => {
    if (!currentNecesidad) return;
    
    const necesidadActualizada = {
      ...currentNecesidad,
      ...formData
    };
    
    // Llamar al método de edición pasado por props
    onEditNecesidad(necesidadActualizada.id, necesidadActualizada);
    
    setShowEditModal(false);
    setCurrentNecesidad(null);
  };
  
  // Manejador para borrar necesidad
  const handleDeleteNecesidad = () => {
    if (!currentNecesidad) return;
    
    // Llamamos a onEditNecesidad con un flag para indicar eliminación
    onEditNecesidad(currentNecesidad.id, { ...currentNecesidad, _delete: true });
    
    setShowDeleteModal(false);
    setCurrentNecesidad(null);
  };
  
  // Manejador para cambiar estado 
  const handleToggleStatus = (necesidad) => {
    const nuevoEstado = necesidad.estado === 'Activa' ? 'Inactiva' : 'Activa';
    
    onEditNecesidad(necesidad.id, {
      ...necesidad,
      estado: nuevoEstado
    });
  };
  
  // Manejador para abrir modal de visualización
  const handleViewDetails = (necesidad) => {
    setCurrentNecesidad(necesidad);
    setShowViewModal(true);
    
    // También podemos llamar al manejador pasado por props si necesita hacer algo específico
    onViewNecesidad(necesidad.id);
  };
  
  // Manejador para abrir modal de edición
  const handleEdit = (necesidad) => {
    setCurrentNecesidad(necesidad);
    
    // Inicializar el formulario con los datos de la necesidad
    setFormData({
      titulo: necesidad.titulo || '',
      descripcion: necesidad.descripcion || '',
      tipo: necesidad.tipo || activeTab,
      subcategoria: necesidad.subcategoria || '',
      prioridad: necesidad.prioridad || 'Media',
      estado: necesidad.estado || 'Activa'
    });
    
    setShowEditModal(true);
  };
  
  // Manejador para confirmar eliminación
  const handleConfirmDelete = (necesidad) => {
    setCurrentNecesidad(necesidad);
    setShowDeleteModal(true);
  };

  // Función para obtener color según prioridad
  const getPrioridadColor = (prioridad) => {
    const prioridadItem = prioridadesOptions.find(p => p.value === prioridad);
    return prioridadItem ? prioridadItem.color : 'secondary';
  };

  // Función para renderizar la tabla de necesidades
  const renderNecesidadesTable = (tipo) => {
    // Aplicar filtros y paginación
    const necesidadesFiltradas = filtrarNecesidades(necesidades);
    
    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = necesidadesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
    
    // Actualizar el conteo de páginas después de filtrar
    const newPageCount = Math.ceil(necesidadesFiltradas.length / itemsPerPage);
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
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((necesidad, index) => (
                <tr key={index}>
                  <td>{necesidad.titulo}</td>
                  <td>{necesidad.descripcion.length > 50 ? 
                      `${necesidad.descripcion.substring(0, 50)}...` : necesidad.descripcion}</td>
                  <td>
                    <Badge bg="info">{necesidad.subcategoria}</Badge>
                  </td>
                  <td>
                    <Badge bg={getPrioridadColor(necesidad.prioridad)}>
                      {necesidad.prioridad}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Badge 
                        bg={necesidad.estado === 'Activa' ? 'success' : 
                           necesidad.estado === 'En proceso' ? 'primary' : 
                           necesidad.estado === 'Resuelta' ? 'secondary' : 'secondary'}>
                        {necesidad.estado}
                      </Badge>
                      <div className="form-check form-switch ms-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={necesidad.estado === 'Activa'} 
                          onChange={() => handleToggleStatus(necesidad)}
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
                        onClick={() => handleEdit(necesidad)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        className="me-1"
                        onClick={() => handleViewDetails(necesidad)}
                        title="Ver detalles"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        title="Eliminar"
                        onClick={() => handleConfirmDelete(necesidad)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  No hay necesidades registradas en esta categoría
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
      case 'infraestructura':
        return 'Registrar Nueva Necesidad de Infraestructura';
      case 'equipamiento':
        return 'Registrar Nueva Necesidad de Equipamiento Tecnológico';
      case 'material':
        return 'Registrar Nueva Necesidad de Material Didáctico';
      case 'capacitacion':
        return 'Registrar Nueva Necesidad de Capacitación';
      default:
        return 'Registrar Nueva Necesidad';
    }
  };

  // Obtener descripción de la sección según el tipo activo
  const getSectionDescription = () => {
    switch (activeTab) {
      case 'infraestructura':
        return 'Registre las necesidades de construcción, remodelación o mantenimiento de instalaciones escolares.';
      case 'equipamiento':
        return 'Registre las necesidades de equipos tecnológicos como computadoras, proyectores, internet o dispositivos multimedia.';
      case 'material':
        return 'Registre las necesidades de material didáctico, libros, material deportivo u otros recursos educativos.';
      case 'capacitacion':
        return 'Registre las necesidades de capacitación docente, talleres para estudiantes o programas educativos especiales.';
      default:
        return '';
    }
  };

  // Obtener título de sección según el tipo activo
  const getSectionTitle = () => {
    return categoriasConfig[activeTab]?.nombre || 'Necesidades';
  };
  
  // Cálculo y renderizado de la paginación
  const necesidadesFiltradas = filtrarNecesidades(necesidades);
  const pageCount = Math.ceil(necesidadesFiltradas.length / itemsPerPage);
  
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
      case 'infraestructura':
        return 'Ej: Reparación de techos en aulas';
      case 'equipamiento':
        return 'Ej: Necesidad de 15 computadoras';
      case 'material':
        return 'Ej: Libros de texto para 3er grado';
      case 'capacitacion':
        return 'Ej: Capacitación en métodos educativos';
      default:
        return 'Título de la necesidad';
    }
  };

  const getDescriptionPlaceholder = () => {
    const tipo = formData.tipo || activeTab;
    switch (tipo) {
      case 'infraestructura':
        return 'Describa con detalle la necesidad de infraestructura...';
      case 'equipamiento':
        return 'Describa con detalle la necesidad de equipamiento tecnológico...';
      case 'material':
        return 'Describa con detalle la necesidad de material didáctico...';
      case 'capacitacion':
        return 'Describa con detalle la necesidad de capacitación...';
      default:
        return 'Describa con detalle la necesidad...';
    }
  };

  return (
    <div id="necesidades-escolares" className="mt-5 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestión de Necesidades Escolares</h4>
        <Button 
          variant="primary" 
          onClick={() => setShowNewNeedForm(!showNewNeedForm)}
        >
          <i className="fas fa-plus me-2"></i> Nueva Necesidad
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
            <h6>Filtros de necesidades</h6>
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
                  <option value="Activa">Activa</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Resuelta">Resuelta</option>
                  <option value="Inactiva">Inactiva</option>
                </Form.Select>
              </div>
              
              <div className="col-md">
                <Form.Label>Prioridad</Form.Label>
                <Form.Select 
                  name="prioridad" 
                  value={filtro.prioridad} 
                  onChange={handleFiltroChange}
                >
                  <option value="Todas">Todas</option>
                  {prioridadesOptions.map((p, idx) => (
                    <option key={idx} value={p.value}>{p.value}</option>
                  ))}
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
                
                {/* Tabla de necesidades */}
                {renderNecesidadesTable(activeTab)}
                
                {/* Paginación */}
                <div className="mt-3">
                  {renderPagination()}
                </div>
                
                {/* Mostrar botón o formulario según el estado */}
                {!showNewNeedForm ? (
                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={() => setShowNewNeedForm(true)}
                  >
                    <i className="fas fa-plus me-2"></i> Nueva Necesidad de {getSectionTitle()}
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
                              <Form.Label>Título de la necesidad</Form.Label>
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
                        
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <Form.Group>
                              <Form.Label>Prioridad</Form.Label>
                              <Form.Select
                                name="prioridad"
                                value={formData.prioridad}
                                onChange={handleFormChange}
                                required
                              >
                                {prioridadesOptions.map((p, idx) => (
                                  <option key={idx} value={p.value}>{p.value}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </div>
                        
                        <div className="text-end">
                          <Button 
                            type="button" 
                            variant="light" 
                            className="me-2" 
                            onClick={() => setShowNewNeedForm(false)}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" variant="primary">
                            <i className="fas fa-save me-2"></i>Guardar Necesidad
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
            Detalles de necesidad escolar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentNecesidad && (
            <div>
              <h4>{currentNecesidad.titulo}</h4>
              
              <div className="mb-3">
                <Badge 
                  bg="secondary"
                  className="me-2">
                  {categoriasConfig[currentNecesidad.tipo]?.nombre || "Categoría no especificada"}
                </Badge>
                <Badge bg={getPrioridadColor(currentNecesidad.prioridad)} className="me-2">
                  Prioridad: {currentNecesidad.prioridad}
                </Badge>
                <Badge bg={currentNecesidad.estado === 'Activa' ? 'success' : 
                         currentNecesidad.estado === 'En proceso' ? 'primary' : 
                         'secondary'} className="me-2">
                  {currentNecesidad.estado}
                </Badge>
                <Badge bg="info">{currentNecesidad.subcategoria}</Badge>
              </div>
              
              <h6>Descripción:</h6>
              <p>{currentNecesidad.descripcion}</p>
              
              {currentNecesidad.fechaCreacion && (
                <div className="text-muted mt-3">
                  <small>
                    Fecha de registro: {new Date(currentNecesidad.fechaCreacion).toLocaleDateString()}
                  </small>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => {
            setShowViewModal(false);
            handleConfirmDelete(currentNecesidad);
          }}>
            <i className="fas fa-trash me-2"></i>
            Eliminar
          </Button>
          <Button variant="outline-primary" onClick={() => {
            setShowViewModal(false);
            handleEdit(currentNecesidad);
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
          <Modal.Title>Editar necesidad escolar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Título de la necesidad</Form.Label>
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
                  <Form.Label>Tipo de necesidad</Form.Label>
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
                  <Form.Label>Prioridad</Form.Label>
                  <Form.Select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleFormChange}
                    required
                  >
                    {prioridadesOptions.map((p, idx) => (
                      <option key={idx} value={p.value}>{p.value}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Resuelta">Resuelta</option>
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
            handleConfirmDelete(currentNecesidad);
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
          {currentNecesidad && (
            <div>
              <p>¿Está seguro que desea eliminar la siguiente necesidad escolar?</p>
              <div className="alert alert-warning">
                <strong>{currentNecesidad.titulo}</strong>
                <p className="mb-0">{currentNecesidad.subcategoria} - Prioridad: {currentNecesidad.prioridad}</p>
              </div>
              <p className="text-danger">Esta acción no se puede deshacer.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteNecesidad}>
            <i className="fas fa-trash me-2"></i>
            Eliminar Necesidad
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

NecesidadApoyo.propTypes = {
  necesidades: PropTypes.array,
  onAddNecesidad: PropTypes.func,
  onEditNecesidad: PropTypes.func,
  onViewNecesidad: PropTypes.func
};

export default NecesidadApoyo;