import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

const NavigationBar = ({ logo }) => {
  return (
    <Navbar expand="lg" className="navbar-light bg-light shadow-sm">
      <Container>
        <Navbar.Brand href="#">
          <img 
            src={logo} 
            alt="Logo Mexicanos Primero Jalisco" 
            height="40" 
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link href="https://www.mexicanosprimero.org/">Sobre Nosotros</Nav.Link>
            <Nav.Link href="#como-funciona">Cómo Funciona</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
            <Nav.Item>
              <Button variant="primary" className="ms-2" href="#registro">
                Registrarse
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;