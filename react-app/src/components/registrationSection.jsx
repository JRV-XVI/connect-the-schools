import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Form, Button } from 'react-bootstrap';

const SchoolRegistrationForm = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    cct: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de registro escuela:', formData);
    // Lógica para enviar datos de registro
  };

  return (
    <Form className="row g-3" onSubmit={handleSubmit}>
      <Form.Group as={Col} md={6} controlId="schoolName">
        <Form.Label>Nombre de la institución</Form.Label>
        <Form.Control 
          type="text" 
          value={formData.schoolName}
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Form.Group as={Col} md={6} controlId="cct">
        <Form.Label>Clave de Centro de Trabajo (CCT)</Form.Label>
        <Form.Control 
          type="text" 
          value={formData.cct}
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Form.Group as={Col} md={6} controlId="email">
        <Form.Label>Correo electrónico institucional</Form.Label>
        <Form.Control 
          type="email" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Form.Group as={Col} md={6} controlId="phone">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control 
          type="tel" 
          value={formData.phone}
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Col xs={12}>
        <Button type="submit" variant="primary">Continuar registro</Button>
      </Col>
    </Form>
  );
};

const AllyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    allyType: '',
    allyName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de registro aliado:', formData);
    // Lógica para enviar datos de registro
  };

  return (
    <Form className="row g-3" onSubmit={handleSubmit}>
      <Form.Group as={Col} md={6} controlId="allyType">
        <Form.Label>Tipo de aliado</Form.Label>
        <Form.Select 
          value={formData.allyType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Selecciona...</option>
          <option>Empresa</option>
          <option>Organización Civil</option>
          <option>Institución Gubernamental</option>
          <option>Universidad/Bachillerato</option>
          <option>Persona de la comunidad</option>
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} md={6} controlId="allyName">
        <Form.Label>Nombre de la organización/persona</Form.Label>
        <Form.Control 
          type="text" 
          value={formData.allyName}
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Form.Group as={Col} md={6} controlId="email">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control 
          type="email" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Form.Group as={Col} md={6} controlId="phone">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control 
          type="tel" 
          value={formData.phone}
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Col xs={12}>
        <Button type="submit" variant="primary">Continuar registro</Button>
      </Col>
    </Form>
  );
};

const RegistrationSection = () => {
  return (
    <section id="registro" className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Únete a nuestra plataforma</h2>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card>
              <Card.Body className="p-0">
                <Tab.Container defaultActiveKey="escuelas">
                  <Nav variant="pills" className="nav-fill">
                    <Nav.Item>
                      <Nav.Link eventKey="escuelas" className="py-3">
                        <i className="fas fa-school me-2"></i> Soy una escuela
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="aliados" className="py-3">
                        <i className="fas fa-handshake me-2"></i> Soy un aliado
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content className="p-4">
                    <Tab.Pane eventKey="escuelas">
                      <h4 className="mb-4">Registro para escuelas</h4>
                      <p className="mb-4">Complete el formulario para iniciar el proceso de registro como institución educativa.</p>
                      <SchoolRegistrationForm />
                    </Tab.Pane>
                    <Tab.Pane eventKey="aliados">
                      <h4 className="mb-4">Registro para aliados</h4>
                      <p className="mb-4">Complete el formulario para iniciar el proceso de registro como organización o persona que desea apoyar.</p>
                      <AllyRegistrationForm />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RegistrationSection;