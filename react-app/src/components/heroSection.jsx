import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const HeroSection = ({ onForgotPassword, onLogin }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setLoginData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar las credenciales al backend
      const response = await axios.post('http://localhost:4001/api/login', {
        correo: loginData.email,
        contraseña: loginData.password
      });

      // Llama a la función onLogin con los datos del usuario
      onLogin(response.data.usuario);
    } catch (err) {
      setError('Error de autenticación. Verifique sus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={7} className="mb-5 mb-lg-0">
            <h1 className="display-4 fw-bold mb-4">Conectando escuelas con aliados para transformar la educación</h1>
            <p className="lead mb-4">Plataforma de vinculación entre instituciones educativas y organizaciones de apoyo para mejorar la calidad educativa en Jalisco.</p>
            <div className="d-flex gap-3">
              <Button variant="outline-light" size="lg" href="#registro">
                Registrarse
              </Button>
            </div>
          </Col>
          <Col lg={5}>
            <Card className="login-card p-4">
              <h3 className="text-center mb-4">Iniciar Sesión</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    id="email" 
                    placeholder="ejemplo@correo.com" 
                    value={loginData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    id="password" 
                    value={loginData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required 
                  />
                </Form.Group>
                <div className="d-flex justify-content-between mb-3">
                  <Form.Check 
                    type="checkbox"
                    id="remember"
                    label="Recordarme"
                    checked={loginData.remember}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={onForgotPassword}
                    disabled={isSubmitting}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ingresando...
                    </>
                  ) : 'Ingresar'}
                </Button>
                <div className="text-center mt-4">
                  <span>¿No tienes cuenta?</span>
                  <a href="#registro" className="ms-2">Regístrate aquí</a>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;