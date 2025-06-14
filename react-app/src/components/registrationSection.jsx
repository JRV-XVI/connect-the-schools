import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Form, Button, Alert } from 'react-bootstrap';
import { post } from '../api';

const SchoolRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    schoolName: '',
    city: '',
    state: '',
    street: '',
    postal: '',
    educationalLevel: '',
    sector: '',
    numberStudents: 0,
    nameDirector: '',
    phoneDirector: '',
    cct: '',
    userType: 1,
  });

  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    // Extraer el nombre del campo eliminando el prefijo 'school-'
    const fieldName = e.target.id.replace('school-', '');

    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });

    // Clear password error when user types in either password field
    if (fieldName === 'password' || fieldName === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
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
      // Reset states
      setApiError(null);
      setIsLoading(true);

      try {
        // Preparamos los datos correctamente mapeados para el backend
        const dataToSend = {
          correo: formData.email,
          contrasena: formData.password,
          telefono: formData.phone,
          nombre_escuela: formData.schoolName,
          ciudad: formData.city,
          estado: formData.state,
          calle: formData.street,
          postal: formData.postal,
          nivel_educativo: formData.educationalLevel,
          sector: formData.sector,
          numero_estudiantes: Number(formData.numberStudents),
          nombre_director: formData.nameDirector,
          telefono_director: formData.phoneDirector,
          cct: formData.cct,
          tipo_usuario: formData.userType
        };

        console.log('Enviando datos:', dataToSend);

        // Send registration data to API
        const response = await post('/registro/escuela', dataToSend);
        console.log('Registro exitoso:', response);
        setSuccess(true);
      } catch (error) {
        console.error('Error al registrar:', error);
        setApiError(error.message || 'Hubo un error al procesar tu registro');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (success) {
    return (
      <Alert variant="success">
        <Alert.Heading>¡Registro exitoso!</Alert.Heading>
        <p>
          Tu cuenta de escuela ha sido creada correctamente.
          Pronto recibirás un correo electrónico con los pasos siguientes.
        </p>
      </Alert>
    );
  }

  return (
    <Form className="row g-3" onSubmit={handleSubmit}>
      {apiError && <Alert variant="danger">{apiError}</Alert>}
      {step === 1 ? (
        <>
          <Form.Group as={Col} md={6} controlId="school-email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="school-cct">
            <Form.Label>Clave de Centro de Trabajo (CCT)</Form.Label>
            <Form.Control
              type="text"
              value={formData.cct}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="school-password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="school-confirmPassword">
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
          <Form.Group as={Col} md={6} controlId="school-schoolName">
            <Form.Label>Nombre de la institución</Form.Label>
            <Form.Control
              type="text"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="school-phone">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {/* Resto de campos actualizando los IDs con el prefijo "school-" */}

          <Form.Group as={Col} md={6} controlId="school-city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="school-state">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="school-street">
            <Form.Label>Calle</Form.Label>
            <Form.Control
              type="text"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="school-postal">
            <Form.Label>Codigo postal</Form.Label>
            <Form.Control
              type="text"
              value={formData.postal}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="school-educationalLevel">
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
          <Form.Group as={Col} md={6} controlId="school-sector">
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
          <Form.Group as={Col} md={6} controlId="school-numberStudents">
            <Form.Label>Número de estudiantes</Form.Label>
            <Form.Control
              type="number"
              value={formData.numberStudents}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="school-nameDirector">
            <Form.Label>Nombre del director/a</Form.Label>
            <Form.Control
              type="text"
              value={formData.nameDirector}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="school-phoneDirector">
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
            disabled={isLoading}
          >
            Volver atrás
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : (step === 1 ? "Continuar registro" : "Completar registro")}
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
    city: '',
    state: '',
    street: '',
    postal: '',
    rfc: '',
    socialReason: '',
    phoneRepresentative: '',
    emailRepresentative: '',
    typeUser: 2,
  });

  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    // Extraer el nombre del campo eliminando el prefijo 'ally-'
    const fieldName = e.target.id.replace('ally-', '');

    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });

    // Clear password error when user types in either password field
    if (fieldName === 'password' || fieldName === 'confirmPassword') {
      setPasswordError('');
    }
  };

  if (success) {
    return (
      <Alert variant="success">
        <Alert.Heading>¡Registro exitoso!</Alert.Heading>
        <p>
          Tu cuenta de aliado ha sido creada correctamente.
          Pronto recibirás un correo electrónico con los pasos siguientes.
        </p>
      </Alert>
    );
  }

  // Actualiza la parte del handleSubmit para el componente AllyRegistrationForm

  const handleSubmit = async (e) => {
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
      // Reset states
      setApiError(null);
      setIsLoading(true);

      try {
        // Preparamos los datos correctamente mapeados para el backend
        const dataToSend = {
          correo: formData.email,           // Mapear email a correo como espera el backend
          contrasena: formData.password,    // Mapear password a contrasena
          telefono: formData.phone,         // Mapear phone a telefono
          nombre_aliado: formData.allyName,
          ciudad: formData.city,
          estado: formData.state,
          calle: formData.street,
          postal: formData.postal,
          rfc: formData.rfc,
          razon_social: formData.socialReason,
          telefono_representante: formData.phoneRepresentative,
          correo_representante: formData.emailRepresentative,
          tipo_usuario: formData.typeUser
        };

        console.log('Enviando datos:', dataToSend);

        // Send registration data to API - cambia también la ruta a una correcta
        const response = await post('/registro/aliado', dataToSend);
        console.log('Registro exitoso:', response);
        setSuccess(true);
      } catch (error) {
        console.error('Error al registrar:', error);
        setApiError(error.message || 'Hubo un error al procesar tu registro');
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
    <Form className="row g-3" onSubmit={handleSubmit}>
      {apiError && <Alert variant="danger">{apiError}</Alert>}
      {step === 1 ? (
        <>
          <Form.Group as={Col} md={6} controlId="ally-email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="ally-rfc">
            <Form.Label>RFC</Form.Label>
            <Form.Control
              type="text"
              value={formData.rfc}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="ally-password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="ally-confirmPassword">
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
          <Form.Group as={Col} md={6} controlId="ally-allyName">
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


          <Form.Group as={Col} md={6} controlId="city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="state">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </Form.Group>


          <Form.Group as={Col} md={6} controlId="street">
            <Form.Label>Calle</Form.Label>
            <Form.Control
              type="text"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="postal">
            <Form.Label>Codigo postal</Form.Label>
            <Form.Control
              type="text"
              value={formData.postal}
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
            disabled={isLoading}
          >
            Volver atrás
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className={step === 2 ? "ms-auto" : ""}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : (step === 1 ? "Continuar registro" : "Completar registro")}
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
