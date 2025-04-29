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
    busqueda: ""
  });
  
  // Definición de categorías y subcategorías según MI ESCUELA PRIMERO
  const categoriasConfig = {
    todos: {
      nombre: "Todos",
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
      busqueda: ""
    });
  };
  
  // Actualizar la función filtrarApoyos para usar categoria en lugar de tipo
const filtrarApoyos = (listaApoyos) => {
  return listaApoyos.filter(apoyo => {
    // Si el tab activo es "todos", no filtramos por categoría
    if (activeTab === 'todos') return true;
    
    // Filtrar por categoria (o tipo) según el tab activo
    const categoriaActiva = getCategoriaTexto(activeTab);
    if (apoyo.categoria !== categoriaActiva) return false;
    
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

  // Modificar la función handleSubmit para usar la categoría como título
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const categoria = getCategoriaTexto(formData.tipo);
    
    const nuevaOferta = {
      tipo: formData.tipo,           // Mantener el tipo para referencia interna
      categoria: categoria,          // La categoría textual (que también será el título)
      subcategoria: formData.subcategoria,
      descripcion: formData.descripcion,
      fechaCreacion: new Date().toISOString()
    };
    
    onAddApoyo(nuevaOferta);
    
    // Reiniciar formulario, manteniendo la categoría actual
    setFormData({
      tipo: activeTab,
      subcategoria: categoriasConfig[activeTab]?.subcategorias[0] || '',
      descripcion: '',
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
              <th>Subcategoría</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((apoyo, index) => (
                <tr key={index}>
                  <td>
                    <Badge bg="success">{apoyo.subcategoria}</Badge>
                  </td>
                  <td>{apoyo.descripcion.length > 50 ? 
                      `${apoyo.descripcion.substring(0, 50)}...` : apoyo.descripcion}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Button 
                        variant="btn btn-sm btn-outline-primary me-1" 
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
      case 'formacionDocente':
        return 'Registrar Nueva Oferta de Formación Docente';
      case 'formacionFamilias':
        return 'Registrar Nueva Oferta de Formación a Familias';
      case 'formacionNinos':
        return 'Registrar Nueva Oferta de Formación para Niñas y Niños';
      case 'personalApoyo':
        return 'Registrar Nueva Oferta de Personal de Apoyo';
      case 'infraestructura':
        return 'Registrar Nueva Oferta de Infraestructura';
      case 'materiales':
        return 'Registrar Nueva Oferta de Materiales';
      case 'mobiliario':
        return 'Registrar Nueva Oferta de Mobiliario';
      case 'alimentacion':
        return 'Registrar Nueva Oferta de Alimentación';
      case 'transporte':
        return 'Registrar Nueva Oferta de Transporte';
      case 'juridico':
        return 'Registrar Nueva Oferta de Apoyo Jurídico';
      default:
        return 'Registrar Nueva Oferta de Apoyo';
    }
  };
  
  const getCategoriaTexto = (tipo) => {
    switch (tipo) {
      case 'formacionDocente':
        return 'Formación Docente';
      case 'formacionFamilias':
        return 'Formación a Familias';
      case 'formacionNinos':
        return 'Formación para Niñas y Niños';
      case 'personalApoyo':
        return 'Personal de Apoyo';
      case 'infraestructura':
        return 'Infraestructura';
      case 'materiales':
        return 'Materiales';
      case 'mobiliario':
        return 'Mobiliario';
      case 'alimentacion':
        return 'Alimentación';
      case 'transporte':
        return 'Transporte';
      case 'juridico':
        return 'Apoyo Jurídico';
      default:
        return 'Apoyo Escolar'; // default por si falla
    }
  };
  
  // Obtener descripción de la sección según el tipo activo
  const getSectionDescription = () => {
    switch (activeTab) {
      case 'todos':
        return 'Vista completa de todas sus ofertas de apoyo registradas en el sistema.';
      case 'formacionDocente':
        return 'Registre sus ofertas de formación para docentes en áreas como metodologías activas, evaluación, educación inclusiva y herramientas digitales.';
      case 'formacionFamilias':
        return 'Registre sus ofertas para capacitar a familias en temas como comunicación efectiva con la escuela, crianza positiva, y apoyo al aprendizaje en el hogar.';
      case 'formacionNinos':
        return 'Registre sus ofertas educativas dirigidas a niños y niñas como talleres de arte, música, computación o apoyo en lectoescritura y matemáticas.';
      case 'personalApoyo':
        return 'Registre sus ofertas de personal especializado como maestros de arte, educación física, idiomas, psicólogos o terapeutas de lenguaje.';
      case 'infraestructura':
        return 'Registre sus ofertas para mejoras de infraestructura como adecuaciones para accesibilidad, sistemas de agua, baños, conectividad o seguridad.';
      case 'materiales':
        return 'Registre sus ofertas de materiales didácticos, de educación física, tecnológicos o literarios para escuelas.';
      case 'mobiliario':
        return 'Registre sus ofertas de mobiliario escolar como mesas, sillas, estanterías o pizarrones para mejorar los espacios educativos.';
      case 'alimentacion':
        return 'Registre sus ofertas de apoyo alimentario como desayunos o fórmulas para programas escolares de nutrición.';
      case 'transporte':
        return 'Registre sus ofertas de transporte escolar o mejoras en rutas de acceso para facilitar la llegada a la escuela.';
      case 'juridico':
        return 'Registre sus ofertas de apoyo jurídico para gestión de escrituras u otros trámites legales que beneficien a las instituciones educativas.';
      default:
        return 'Registre sus ofertas de apoyo para contribuir con las necesidades de las escuelas.';
    }
  };

  // Obtener título de sección según el tipo activo
  const getSectionTitle = () => {
    if (activeTab === 'todos') {
      return 'Todas las Ofertas de Apoyo';
    }
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
                <Nav.Link 
                  eventKey={key}
                  style={activeTab !== key ? { color: '#28a745' } : {}}
                >
                  {config.nombre}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Header>
        <Card.Body>
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
                  // El botón ha sido eliminado como solicitaste
                  <div></div> // Div vacío para mantener la estructura
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
              <h4>{currentApoyo.categoria || currentApoyo.titulo}</h4>
              
              <div className="mb-3">
                <Badge bg="danger" className="me-2">Categoría: {currentApoyo.categoria}</Badge>
                <Badge bg="success">Subcategoría: {currentApoyo.subcategoria}</Badge>
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
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Cerrar
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