import React from "react";
import { motion } from "framer-motion";
import Container from "react-bootstrap/Container";
import Image from 'react-bootstrap/Image';
import loadingLogo from "../images/loading.gif"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Loader = () => {
  return (
    <Container>
      <Row className="justify-content-center align-items-center vh-100">
        <Col className="text-center">
          <Image src={loadingLogo} alt="Loading"/>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;