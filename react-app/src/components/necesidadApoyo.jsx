import React, { useState, useEffect } from 'react';
import { Tab, Nav, Alert, Button, Form, Badge, Table, Card, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

const NecesidadApoyo = ({ necesidades =[], setNecesidades = () => { }, onAddNecesidad = () => { }, onEditNecesidad = () => { }, onViewNecesidad = () => { }, userData = {} }) => {

  // Definición de categorías y subcategorías para necesidades escolares
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


  const [activeTab, setActiveTab] = useState('todos');
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
    descripcion: '',
    tipo: activeTab,
    subcategoria: categoriasConfig[activeTab]?.subcategorias[0] || '',
    prioridad: 5,
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
    prioridad: "Todas",
    busqueda: ""
  });
  
  // Primero, actualiza las opciones de prioridad
  const prioridadesOptions = [
    { value: 10, label: '10 - Urgente', color: 'danger' },
    { value: 9, label: '9', color: 'danger' },
    { value: 8, label: '8', color: 'warning' },
    { value: 7, label: '7', color: 'warning' },
    { value: 6, label: '6', color: 'warning' },
    { value: 5, label: '5', color: 'primary' },
    { value: 4, label: '4', color: 'primary' },
    { value: 3, label: '3', color: 'info' },
    { value: 2, label: '2', color: 'info' },
    { value: 1, label: '1 - Baja', color: 'info' }
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
      prioridad: "Todas",
      busqueda: ""
    });
  };
  
// Aplicar filtros a la lista de necesidades
const filtrarNecesidades = (listaNecesidades) => {
  // Si estamos en la pestaña "todos", mostrar todas las necesidades
  if (activeTab === 'todos') {
    return listaNecesidades;
  }
  
  // Para cualquier otra pestaña, filtrar por tipo (categoría)
  return listaNecesidades.filter(necesidad => {
    // Comprueba tanto el campo tipo como hacer la conversión inversa de categoria a tipo
    return necesidad.tipo === activeTab || 
           getTipoFromCategoria(necesidad.categoria) === activeTab;
  });
};

// Función auxiliar para convertir texto de categoría a código de tipo
const getTipoFromCategoria = (categoriaTexto) => {
  for (const [key, value] of Object.entries(categoriasConfig)) {
    if (value.nombre === categoriaTexto || getCategoriaTexto(key) === categoriaTexto) {
      return key;
    }
  }
  return null;
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
  
    const categoria = getCategoriaTexto(formData.tipo);
  
    const nuevaNecesidad = {
      ...formData,
      idUsuario: userData?.idUsuario, 
      categoria: categoria,
      tipo: formData.tipo,  // Añadir explícitamente el tipo
      subcategoria: formData.subcategoria,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad,
      fechaCreacion: new Date().toISOString(),
      estadoValidacion: 2
    };
    try {
      const response = await axios.post(
        'http://localhost:4001/api/necesidadApoyo',
        nuevaNecesidad,
        { withCredentials: true }
    );
  
      console.log('[SUCCESS] Necesidad de apoyo creada:', response.data);
  
      setNecesidades([...necesidades, response.data]);
  
      setFormData({
        descripcion: '',
        tipo: activeTab,
        subcategoria: categoriasConfig[activeTab]?.subcategorias[0] || '',
        prioridad: '5',
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
      descripcion: necesidad.descripcion || '',
      tipo: necesidad.tipo || activeTab,
      subcategoria: necesidad.subcategoria || '',
      prioridad: necesidad.prioridad || '5',
    });
    
    setShowEditModal(true);
  };
  
  // Manejador para confirmar eliminación
  const handleConfirmDelete = (necesidad) => {
    setCurrentNecesidad(necesidad);
    setShowDeleteModal(true);
  };

  // Función para obtener color según prioridad numérica
  const getPrioridadColor = (prioridad) => {
    const prioridadItem = prioridadesOptions.find(p => p.value === parseInt(prioridad));
    return prioridadItem ? prioridadItem.color : 'secondary';
  };

  // Función para convertir código de categoría a texto legible
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
              <th>Subcategoría</th>
              <th>Descripción</th>
              <th>Prioridad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((necesidad, index) => (
                <tr key={index}>
                  <td>
                    <Badge bg="success">{necesidad.subcategoria}</Badge>
                  </td>
                  <td>{necesidad.descripcion.length > 50 ? 
                      `${necesidad.descripcion.substring(0, 50)}...` : necesidad.descripcion}</td>
                  <td>
                    <Badge bg={getPrioridadColor(necesidad.prioridad)}>
                      {necesidad.prioridad}
                    </Badge>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Button 
                        variant="btn btn-sm btn-outline-primary me-1" 
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
                <td colSpan="4" className="text-center py-3">
                  {activeTab === 'todos' 
                    ? "No hay necesidades escolares registradas en el sistema"
                    : `No hay necesidades registradas en la categoría ${getSectionTitle()}`
                  }
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
        return 'Registrar Nueva Necesidad de Formación Docente';
      case 'formacionFamilias':
        return 'Registrar Nueva Necesidad de Formación a Familias';
      case 'formacionNinos':
        return 'Registrar Nueva Necesidad de Formación para Niñas y Niños';
      case 'personalApoyo':
        return 'Registrar Nueva Necesidad de Personal de Apoyo';
      case 'infraestructura':
        return 'Registrar Nueva Necesidad de Infraestructura';
      case 'materiales':
        return 'Registrar Nueva Necesidad de Materiales';
      case 'mobiliario':
        return 'Registrar Nueva Necesidad de Mobiliario';
      case 'alimentacion':
        return 'Registrar Nueva Necesidad de Alimentación';
      case 'transporte':
        return 'Registrar Nueva Necesidad de Transporte';
      case 'juridico':
        return 'Registrar Nueva Necesidad de Apoyo Jurídico';
      default:
        return 'Registrar Nueva Necesidad Escolar';
    }
  };
  
  // Obtener descripción de la sección según el tipo activo
  const getSectionDescription = () => {
    switch (activeTab) {
      case 'todos':
        return 'Vista completa de todas las necesidades escolares registradas en el sistema.';
      case 'formacionDocente':
        return 'Registre sus necesidades de formación para docentes en áreas como metodologías activas, evaluación, educación inclusiva y herramientas digitales.';
      case 'formacionFamilias':
        return 'Registre sus necesidades para capacitar a familias en temas como comunicación efectiva con la escuela, crianza positiva, y apoyo al aprendizaje en el hogar.';
      case 'formacionNinos':
        return 'Registre sus necesidades educativas dirigidas a niños y niñas como talleres de arte, música, computación o apoyo en lectoescritura y matemáticas.';
      case 'personalApoyo':
        return 'Registre sus necesidades de personal especializado como maestros de arte, educación física, idiomas, psicólogos o terapeutas de lenguaje.';
      case 'infraestructura':
        return 'Registre sus necesidades para mejoras de infraestructura como adecuaciones para accesibilidad, sistemas de agua, baños, conectividad o seguridad.';
      case 'materiales':
        return 'Registre sus necesidades de materiales didácticos, de educación física, tecnológicos o literarios para su escuela.';
      case 'mobiliario':
        return 'Registre sus necesidades de mobiliario escolar como mesas, sillas, estanterías o pizarrones para mejorar los espacios educativos.';
      case 'alimentacion':
        return 'Registre sus necesidades de apoyo alimentario como desayunos o fórmulas para programas escolares de nutrición.';
      case 'transporte':
        return 'Registre sus necesidades de transporte escolar o mejoras en rutas de acceso para facilitar la llegada a la escuela.';
      case 'juridico':
        return 'Registre sus necesidades de apoyo jurídico para gestión de escrituras u otros trámites legales que beneficien a su institución educativa.';
      default:
        return 'Registre sus necesidades escolares para mejorar la experiencia educativa.';
    }
  };

  // Obtener título de sección según el tipo activo
  const getSectionTitle = () => {
    if (activeTab === 'todos') {
      return 'Todas las Necesidades Escolares';
    }
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
      case 'formacionDocente':
        return 'Ej: Curso de capacitación en métodos pedagógicos actualizados';
      case 'formacionFamilias':
        return 'Ej: Taller para padres sobre apoyo en tareas escolares';
      case 'formacionNinos':
        return 'Ej: Necesidad de talleres artísticos para alumnos';
      case 'personalApoyo':
        return 'Ej: Necesitamos un psicólogo escolar';
      case 'infraestructura':
        return 'Ej: Reparación urgente de techos en aulas';
      case 'materiales':
        return 'Ej: Libros de texto para 3er grado';
      case 'mobiliario':
        return 'Ej: Necesitamos 30 pupitres nuevos';
      case 'alimentacion':
        return 'Ej: Programa de desayunos escolares';
      case 'transporte':
        return 'Ej: Necesidad de transporte para alumnos de zonas alejadas';
      case 'juridico':
        return 'Ej: Apoyo para regularización de documentos escolares';
      default:
        return 'Título de la necesidad';
    }
  };

  const getDescriptionPlaceholder = () => {
    const tipo = formData.tipo || activeTab;
    switch (tipo) {
      case 'formacionDocente':
        return 'Describa con detalle la necesidad de formación para docentes...';
      case 'formacionFamilias':
        return 'Describa con detalle la necesidad de formación para familias...';
      case 'formacionNinos':
        return 'Describa con detalle la necesidad de formación para niños y niñas...';
      case 'personalApoyo':
        return 'Describa con detalle la necesidad de personal de apoyo...';
      case 'infraestructura':
        return 'Describa con detalle la necesidad de infraestructura...';
      case 'materiales':
        return 'Describa con detalle la necesidad de materiales...';
      case 'mobiliario':
        return 'Describa con detalle la necesidad de mobiliario...';
      case 'alimentacion':
        return 'Describa con detalle la necesidad de alimentación...';
      case 'transporte':
        return 'Describa con detalle la necesidad de transporte...';
      case 'juridico':
        return 'Describa con detalle la necesidad de apoyo jurídico...';
      default:
        return 'Describa con detalle la necesidad escolar...';
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
                
                {/* Tabla de necesidades */}
                {renderNecesidadesTable(activeTab)}
                
                {/* Paginación */}
                <div className="mt-3">
                  {renderPagination()}
                </div>
                
                {/* Mostrar botón o formulario según el estado */}
                {!showNewNeedForm ? (
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
                                {Object.entries(categoriasConfig)
                                  .filter(([key]) => key !== 'todos') // Excluir la opción "todos"
                                  .map(([key, config]) => (
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
                <Badge bg="danger" className="me-2">Categoría: {currentNecesidad.categoria}</Badge>
                <Badge bg="success" className="me-2">
                  Subcategoría: {currentNecesidad.subcategoria}
                </Badge>
                <Badge bg={getPrioridadColor(currentNecesidad.prioridad)} className="me-2">
                  Prioridad: {currentNecesidad.prioridad}
                </Badge>

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
          {currentNecesidad && (
            <div>
              <p>¿Está seguro que desea eliminar la siguiente necesidad escolar?</p>
              <div className="alert alert-warning">
                <strong>{currentNecesidad.titulo}</strong>
                <p className="mb-0">
                  {categoriasConfig[currentNecesidad.tipo]?.nombre} - {currentNecesidad.subcategoria} - Prioridad: {currentNecesidad.prioridad}
                </p>
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