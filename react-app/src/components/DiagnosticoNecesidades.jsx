import React, { useState } from 'react';
import { Tab, Nav, Alert, Button, Form, Badge, Table, Card } from 'react-bootstrap';

const DiagnosticoNecesidades = ({ necesidades, onAddNeed, onEditNeed, onViewNeed }) => {
  const [activeTab, setActiveTab] = useState('infrastructure');
  const [showNewNeedForm, setShowNewNeedForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    categoriaEspecifica: '',
    impactoAprendizaje: 'Alto',
    impactoAsistencia: 'Alto',
    estudiantesAfectados: '',
    observaciones: '',
    evidenciasFotos: [],
    documentosRespaldo: []
  });

  // Manejador para cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData({
        ...formData,
        [name]: Array.from(files)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };



  // Manejador para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryMap = {
      infrastructure: 1,
      equipment: 2,
      training: 3,
      materials: 4
    };

    const subcategoryMap = {
      'Mantenimiento correctivo': 1,
      'Rehabilitación de espacios': 2,
      'Construcción nueva': 3,
      'Adecuación de accesibilidad': 4,
      'Instalaciones eléctricas': 5,
      'Instalaciones hidráulicas': 6,
      'Mobiliario escolar': 7,
      'Equipo tecnológico': 8,
      'Equipo de laboratorio': 9,
      'Material deportivo': 10,
      'Equipo de seguridad': 11,
      'Competencias digitales': 12,
      'Actualización disciplinar': 13,
      'Estrategias pedagógicas': 14,
      'Educación inclusiva': 15,
      'Evaluación formativa': 16,
      'Material bibliográfico': 17,
      'Material didáctico': 18,
      'Software educativo': 19,
      'Material de papelería': 20,
      'Material artístico': 21
    };

    const prioridadCalculada = formData.impactoAprendizaje === 'Alto' || formData.impactoAsistencia === 'Alto'
      ? 'Alta'
      : formData.impactoAprendizaje === 'Medio' || formData.impactoAsistencia === 'Medio'
        ? 'Media'
        : 'Baja';

    onAddNeed({
      ...formData,
      tipo: activeTab,
      estado: 'En edición',
      fechaCreacion: new Date().toISOString(),
      prioridad: prioridadCalculada,
      idCategoria: categoryMap[activeTab], 
      idSubcategoria: subcategoryMap[formData.categoriaEspecifica],
    });
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: '',
      categoriaEspecifica: '',
      impactoAprendizaje: '',
      impactoAsistencia: '',
      estudiantesAfectados: '',
      observaciones: '',
      evidenciasFotos: [],
      documentosRespaldo: []
    });
    setShowNewNeedForm(false);
  };

  // Función para renderizar la tabla de necesidades
  const renderNeedsTable = (tipo) => {
    const needsFiltered = necesidades.filter(need => need.tipo === tipo);
    
    return (
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Necesidad</th>
              <th>Descripción</th>
              <th>Impacto</th>
              <th>Evidencias</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {needsFiltered.length > 0 ? (
              needsFiltered.map((need, index) => (
                <tr key={index}>
                  <td>{need.titulo}</td>
                  <td>{need.descripcion}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="me-2">{need.impactoAprendizaje}</div>
                      <div className="progress flex-grow-1" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar ${need.impactoAprendizaje === 'Alto' ? 'bg-danger' : need.impactoAprendizaje === 'Medio' ? 'bg-warning' : 'bg-info'}`} 
                          role="progressbar" 
                          style={{ width: need.impactoAprendizaje === 'Alto' ? '90%' : need.impactoAprendizaje === 'Medio' ? '60%' : '30%' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg={need.evidenciasFotos.length > 2 ? 'success' : 'secondary'}>
                      {need.evidenciasFotos.length} archivo{need.evidenciasFotos.length !== 1 ? 's' : ''}
                    </Badge>
                  </td>
                  <td>
                    <Badge 
                      bg={need.estado === 'Aprobada' ? 'success' : need.estado === 'En evaluación' ? 'warning' : 'info'}>
                      {need.estado}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-1" 
                      onClick={() => onEditNeed(need.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      onClick={() => onViewNeed(need.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
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

  // Obtener las categorías específicas según el tipo activo
  const getCategoriesForActiveType = () => {
    switch (activeTab) {
      case 'infrastructure':
        return [
          'Mantenimiento correctivo',
          'Rehabilitación de espacios',
          'Construcción nueva',
          'Adecuación de accesibilidad',
          'Instalaciones eléctricas',
          'Instalaciones hidráulicas'
        ];
      case 'equipment':
        return [
          'Mobiliario escolar',
          'Equipo tecnológico',
          'Equipo de laboratorio',
          'Material deportivo',
          'Equipo de seguridad'
        ];
      case 'training':
        return [
          'Competencias digitales',
          'Actualización disciplinar',
          'Estrategias pedagógicas',
          'Educación inclusiva',
          'Evaluación formativa'
        ];
      case 'materials':
        return [
          'Material bibliográfico',
          'Material didáctico',
          'Software educativo',
          'Material de papelería',
          'Material artístico'
        ];
      default:
        return [];
    }
  };

  // Obtener título para el formulario según el tipo activo
  const getFormTitle = () => {
    switch (activeTab) {
      case 'infrastructure':
        return 'Registrar Nueva Necesidad de Infraestructura';
      case 'equipment':
        return 'Registrar Nueva Necesidad de Equipamiento';
      case 'training':
        return 'Registrar Nueva Necesidad de Formación Docente';
      case 'materials':
        return 'Registrar Nueva Necesidad de Materiales Didácticos';
      default:
        return 'Registrar Nueva Necesidad';
    }
  };

  // Obtener descripción de la sección según el tipo activo
  const getSectionDescription = () => {
    switch (activeTab) {
      case 'infrastructure':
        return 'El diagnóstico de infraestructura permite identificar necesidades relacionadas con espacios físicos, instalaciones y condiciones estructurales de la escuela.';
      case 'equipment':
        return 'El diagnóstico de equipamiento permite identificar necesidades relacionadas con mobiliario, tecnología y recursos materiales para mejorar los procesos de enseñanza-aprendizaje.';
      case 'training':
        return 'El diagnóstico de formación docente permite identificar necesidades relacionadas con capacitación, actualización y desarrollo profesional del personal educativo.';
      case 'materials':
        return 'El diagnóstico de materiales didácticos permite identificar necesidades relacionadas con recursos educativos, libros, y materiales para apoyar el proceso de enseñanza-aprendizaje.';
      default:
        return '';
    }
  };

  // Obtener título de sección según el tipo activo
  const getSectionTitle = () => {
    switch (activeTab) {
      case 'infrastructure':
        return 'Necesidades de Infraestructura';
      case 'equipment':
        return 'Necesidades de Equipamiento';
      case 'training':
        return 'Necesidades de Formación Docente';
      case 'materials':
        return 'Necesidades de Materiales Didácticos';
      default:
        return 'Necesidades';
    }
  };

  return (
    <div id="diagnostico" className="mt-5 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Diagnóstico de Necesidades Escolares</h4>
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
            <Nav.Item>
              <Nav.Link eventKey="infrastructure">Infraestructura</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="equipment">Equipamiento</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="training">Formación Docente</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="materials">Materiales Didácticos</Nav.Link>
            </Nav.Item>
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
                {renderNeedsTable(activeTab)}
                
                {/* Mostrar botón o formulario según el estado */}
                {!showNewNeedForm ? (
                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={() => setShowNewNeedForm(true)}
                  >
                    <i className="fas fa-plus me-2"></i> Nueva Necesidad de {activeTab === 'infrastructure' ? 'Infraestructura' : 
                                                                 activeTab === 'equipment' ? 'Equipamiento' : 
                                                                 activeTab === 'training' ? 'Formación' : 
                                                                 'Materiales'}
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
                              <Form.Label>Título de la necesidad</Form.Label>
                              <Form.Control
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleFormChange}
                                placeholder={`Ej: ${activeTab === 'infrastructure' ? 'Rehabilitación de techos' : 
                                                activeTab === 'equipment' ? 'Equipos de cómputo' : 
                                                activeTab === 'training' ? 'Capacitación en tecnologías' : 
                                                'Material bibliográfico'}`}
                                required
                              />
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group>
                              <Form.Label>Categoría específica</Form.Label>
                              <Form.Select
                                name="categoriaEspecifica"
                                value={formData.categoriaEspecifica}
                                onChange={handleFormChange}
                                required
                              >
                                <option value="">Seleccionar...</option>
                                {getCategoriesForActiveType().map((cat, idx) => (
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
                                placeholder={`Describe con detalle la necesidad de ${activeTab === 'infrastructure' ? 'infraestructura' : 
                                                                         activeTab === 'equipment' ? 'equipamiento' : 
                                                                         activeTab === 'training' ? 'formación docente' : 
                                                                         'materiales didácticos'}...`}
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                        
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <Form.Group>
                              <Form.Label>Impacto en aprendizaje</Form.Label>
                              <Form.Select
                                name="impactoAprendizaje"
                                value={formData.impactoAprendizaje}
                                onChange={handleFormChange}
                                required
                              >
                                <option value="Alto">Alto</option>
                                <option value="Medio">Medio</option>
                                <option value="Bajo">Bajo</option>
                              </Form.Select>
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group>
                              <Form.Label>Impacto en asistencia</Form.Label>
                              <Form.Select
                                name="impactoAsistencia"
                                value={formData.impactoAsistencia}
                                onChange={handleFormChange}
                                required
                              >
                                <option value="Alto">Alto</option>
                                <option value="Medio">Medio</option>
                                <option value="Bajo">Bajo</option>
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </div>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Evidencias fotográficas (máximo 5)</Form.Label>
                          <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            name="evidenciasFotos"
                            onChange={handleFormChange}
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Documentos de respaldo (opcional)</Form.Label>
                          <Form.Control
                            type="file"
                            multiple
                            name="documentosRespaldo"
                            onChange={handleFormChange}
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Número de estudiantes afectados</Form.Label>
                          <Form.Control
                            type="number"
                            name="estudiantesAfectados"
                            value={formData.estudiantesAfectados}
                            onChange={handleFormChange}
                            placeholder="Ej: 120"
                            required
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Observaciones adicionales</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleFormChange}
                          />
                        </Form.Group>
                        
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
    </div>
  );
};

export default DiagnosticoNecesidades;