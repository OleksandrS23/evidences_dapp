import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

function Home (props) {
  return (
    <Container>
    <Row>
      <Col>
        <h1>Bem-Vindo ao Evidence Chain App</h1>
        <p>Esta é uma aplicação desenvolvida para demonstração do uso da blockchain para o registo de evidências.</p>
      </Col>
    </Row>
  </Container>
  );
};

export default Home;