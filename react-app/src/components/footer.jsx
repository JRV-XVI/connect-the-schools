import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = ({ logo }) => {
  return (
    <footer className="footer py-5">
      <Container>
        <Row>
          <Col lg={4} className="mb-4 mb-lg-0">
            <img src={logo} alt="Logo Mexicanos Primero Jalisco" height="50" />
            <p className="mt-3">Transformando la educación en Jalisco a través de la colaboración y vinculación estratégica.</p>
          </Col>
          <Col lg={2} md={4} className="mb-4 mb-md-0">
            <h5>Enlaces</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Inicio</a></li>
              <li className="mb-2"><a href="https://www.mexicanosprimero.org/" className="text-white text-decoration-none">Sobre Nosotros</a></li>
            </ul>
          </Col>
          <Col lg={3} md={4} className="mb-4 mb-md-0">
            <h5>Recursos</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="https://www.mexicanosprimero.org/" className="text-white text-decoration-none">Blog</a></li>
            </ul>
          </Col>
          <Col id="contacto" lg={3} md={4}>
            <h5>Contacto</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><i className="fas fa-map-marker-alt me-2"></i> Av. Insurgentes Sur 1458, piso 19, oficina 4, Colonia Actipan, Alcaldía Benito Juárez, C.P. 03230, Ciudad de México, México</li>
              <li className="mb-2"><i className="fas fa-phone me-2"></i> +52 (55) 5910 0321</li>
              <li className="mb-2"><i className="fas fa-envelope me-2"></i> contacto@mexicanosprimero.org</li>
            </ul>
            <div className="mt-3">
              <a href="https://www.facebook.com/MexPrim" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="https://x.com/mexicanos1o" className="text-white me-3"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="https://www.instagram.com/mexicanosprimero/" className="text-white me-3"><i className="fab fa-instagram"></i></a>
              <a href="https://www.youtube.com/channel/UC04Tt20cMkR8hZTuBOsZlOg" className="text-white me-3"><i className="fab fa-youtube"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="my-4 bg-light" />
        <div className="text-center">
          <p className="mb-0">© 2025 Mexicanos Primero Jalisco. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;