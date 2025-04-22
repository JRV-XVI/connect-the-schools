import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const RecoveryModal = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulación de envío
    setTimeout(() => {
      console.log("Solicitud de recuperación para:", email);
      setIsSubmitting(false);
      setEmail('');
      onHide();
      // Aquí iría la lógica para enviar el correo de recuperación
    }, 1000);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Recuperación de contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ingresa tu correo electrónico para recibir instrucciones para restablecer tu contraseña.</p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={!email || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enviando...
            </>
          ) : (
            'Enviar instrucciones'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecoveryModal;