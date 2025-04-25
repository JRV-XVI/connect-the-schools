import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const FeatureCard = ({ icon, title, description}) => {
  return (
    <Col md={4}>
      <Card className="h-100 feature-card text-center p-4">
        <div className="my-3">
          <i className={`fas fa-${icon} feature-icon`}></i>
        </div>
        <h4>{title}</h4>
        <p>{description}</p>
      </Card>
    </Col>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: 'school',
      title: 'Para escuelas',
      description: 'Diagnostica necesidades, prioriza proyectos y conecta con aliados que pueden brindar el apoyo necesario para mejorar la calidad educativa.',
    },
    {
      icon: 'hands-helping',
      title: 'Para aliados',
      description: 'Ofrece tus apoyos a instituciones educativas, selecciona proyectos alineados a tus capacidades e intereses y realiza un seguimiento del impacto.',
    },
    {
      icon: 'users',
      title: 'Mexicanos Primero Jalisco',
      description: 'Todas las intervenciones son evaluadas por Mexicanos Primero Jalisco para mejorar las condiciones educativas y construir una mejor sociedad.',
    }
  ];

  return (
    <section id="como-funciona" className="py-5">
      <Container>
        <h2 className="text-center mb-5">¿Cómo funciona nuestra plataforma?</h2>
        <Row className="g-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              buttonText={feature.buttonText}
            />
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeatureSection;