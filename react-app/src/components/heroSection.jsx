import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { post } from '../api'; // Importamos la función post del módulo de API

const HeroSection = ({ onForgotPassword, onLogin }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, name, value, checked, type } = e.target;
    // Usamos name en lugar de id para identificar el campo
    const fieldName = name || id.replace('login-', ''); 
    
    setLoginData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
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
      // Logging de las credenciales enviadas para depuración
      console.log("Enviando solicitud de login:", {
        correo: loginData.email,
        contraseña: '********' // No mostramos la contraseña en el log
      });
  
      // Usamos la función post de nuestro módulo API
      const response = await post('/login', {
        correo: loginData.email,
        contraseña: loginData.password
      });
  
      // Logging de la respuesta completa
      console.log('Respuesta del servidor:', response);
  
      // Validación simplificada para el usuario
      if (response && typeof response === 'object' && response.idUsuario) {
        // La respuesta es un objeto válido con la propiedad idUsuario
        
        // Convertir la respuesta a una estructura plana
        let userData = { ...response };
        
        // Extraer explícitamente cualquier objeto perfil
        if (userData.perfil && typeof userData.perfil === 'object') {
          // Lista de campos específicos que queremos extraer del perfil
          const fieldsToExtract = ['nombre', 'telefono', 'direccion', 'tipo'];
          
          // Solo extraer los campos específicos que existan
          fieldsToExtract.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(userData.perfil, field)) {
              userData[field] = userData.perfil[field];
            }
          });
          
          // Eliminar el objeto perfil anidado
          delete userData.perfil;
        }
        
        console.log('Usuario autenticado (datos aplanados):', userData);
        
        // Pasar los datos aplanados al componente padre
        onLogin(userData);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
      
    } catch (err) {
      console.error('Error de login:', err);
      // Mostrar mensaje específico según el tipo de error
      if (err.message === 'Credenciales inválidas') {
        setError('Usuario o contraseña incorrectos');
      } else if (err.response && err.response.status === 401) {
        setError('Acceso denegado. Verifique sus credenciales.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
        setError('Error de conexión. Verifique su conexión a internet.');
      } else {
        setError(`Error de autenticación: ${err.message}`);
      }
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
                  <Form.Label htmlFor="login-email">Correo electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    id="login-email"
                    name="email" 
                    placeholder="ejemplo@correo.com" 
                    value={loginData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="login-password">Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    id="login-password"
                    name="password" 
                    value={loginData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required 
                  />
                </Form.Group>
                <div className="d-flex justify-content-between mb-3">
                  <Form.Check 
                    type="checkbox"
                    id="login-remember"
                    name="remember" 
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