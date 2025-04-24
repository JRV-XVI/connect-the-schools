import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Form, Button } from 'react-bootstrap';

const SchoolRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    schoolName: '',
    direction: '',
    educationalLevel: '',
    sector: '',
    numberStudents: '',
    nameDirector: '',
    phoneDirector: '',
    cct: '',
  });
  
  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    
    // Clear password error when user types in either password field
    if (e.target.id === 'password' || e.target.id === 'confirmPassword') {
      setPasswordError('');
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Verify passwords match before proceeding
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }
      
      // Move to second step
      setStep(2);
    } else {
      // Final submission
      console.log('Datos de registro escuela:', formData);
      // Lógica para enviar datos de registro
    }
  };

  return (
    <Form className="row g-3" onSubmit={handleSubmit}>
      {step === 1 ? (
        // Step 1 - Basic credentials
        <>
          <Form.Group as={Col} md={6} controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control 
              type="email" 
              value={formData.email}
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
          <Form.Group as={Col} md={6} controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="confirmPassword">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control 
              type="password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
        </>
      ) : (
        // Step 2 - Additional information
        <>
          <Form.Group as={Col} md={6} controlId="schoolName">
            <Form.Label>Nombre de la institución</Form.Label>
            <Form.Control 
              type="text" 
              value={formData.schoolName}
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
          <Form.Group as={Col} md={6} controlId="direction">
            <Form.Label>Dirección</Form.Label>
            <Form.Control 
              type="text" 
              value={formData.direction}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="educationalLevel">
            <Form.Label>Nivel educativo</Form.Label>
            <Form.Select 
              value={formData.educationalLevel}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecciona...</option>
              <option>Preescolar</option>
              <option>Primaria</option>
              <option>Secundaria</option>
              <option>Preparatoria</option>
              <option>Otro</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="sector">
            <Form.Label>Sector</Form.Label>
            <Form.Select 
              value={formData.sector}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecciona...</option>
              <option>Público</option>
              <option>Privado</option>
              <option>Concertado</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="numberStudents">
            <Form.Label>Número de estudiantes</Form.Label>
            <Form.Control 
              type="number" 
              value={formData.numberStudents}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="nameDirector">
            <Form.Label>Nombre del director/a</Form.Label>
            <Form.Control 
              type="text" 
              value={formData.nameDirector}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="phoneDirector">
            <Form.Label>Teléfono del director/a</Form.Label>
            <Form.Control 
              type="tel" 
              value={formData.phoneDirector}
              onChange={handleChange}
              required 
            />
          </Form.Group>
        </>
      )}
      
      <Col xs={12} className="mt-4 d-flex justify-content-between">
        {step === 2 && (
          <Button 
            type="button" 
            variant="outline-secondary" 
            onClick={() => setStep(1)}
          >
            Volver atrás
          </Button>
        )}
        <Button type="submit" variant="primary">
          {step === 1 ? "Continuar registro" : "Completar registro"}
        </Button>
      </Col>
    </Form>
  );
};

const AllyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', 
    phone: '',
    allyName: '',
    allyType: '',
    direction: '',
    rfc: '',
    socialReason: '',
    phoneRepresentative: '',
    emailRepresentative: '',
  });
  
  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    
    // Clear password error when user types in either password field
    if (e.target.id === 'password' || e.target.id === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Verify passwords match before proceeding
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }
      
      // Move to second step
      setStep(2);
    } else {
      // Final submission
      console.log('Datos de registro aliado:', formData);
      // Lógica para enviar datos de registro
    }
  };

  return (
    <Form className="row g-3" onSubmit={handleSubmit}>
      {step === 1 ? (
        // Step 1 - Basic credentials
        <>
          <Form.Group as={Col} md={6} controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="rfc">
            <Form.Label>RFC</Form.Label>
            <Form.Control 
              type="text" 
              value={formData.rfc}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="confirmPassword">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control 
              type="password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
        </>
      ) : (
        // Step 2 - Additional information
        <>
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
          <Form.Group as={Col} md={6} controlId="socialReason">
            <Form.Label>Razón social</Form.Label>
            <Form.Control 
              type="text" 
              value={formData.socialReason}
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
          <Form.Group as={Col} md={6} controlId="direction">
            <Form.Label>Dirección</Form.Label>
            <Form.Control 
              type="text" 
              value={formData.direction}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="emailRepresentative">
            <Form.Label>Correo del representante</Form.Label>
            <Form.Control 
              type="email" 
              value={formData.emailRepresentative}
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="phoneRepresentative">
            <Form.Label>Teléfono del representante</Form.Label>
            <Form.Control 
              type="tel" 
              value={formData.phoneRepresentative}
              onChange={handleChange}
              required 
            />
          </Form.Group>
        </>
      )}
      
      <Col xs={12} className="mt-4 d-flex justify-content-between">
        {step === 2 && (
          <Button 
            type="button" 
            variant="outline-secondary" 
            onClick={() => setStep(1)}
          >
            Volver atrás
          </Button>
        )}
        <Button type="submit" variant="primary" className={step === 2 ? "ms-auto" : ""}>
          {step === 1 ? "Continuar registro" : "Completar registro"}
        </Button>
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