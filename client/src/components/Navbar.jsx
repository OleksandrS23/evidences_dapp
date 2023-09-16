import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Header from './Header';
import { Button } from "@mui/material";
import LoginComponent from './Login';
import RegisterComponent from "./Register";

function MyNavBar(props) {
  const { drizzleContext, token } = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [tokenData, setTokenData] = useState();

  useEffect(() => {
    setTokenData(token);
  }, [drizzleContext]);

  const openLoginPopup = () => {
    setShowLoginPopup(true)
  };
  const openRegisterPopup = () => {
    setShowRegisterPopup(true)
  };
  const closeLoginPopup = () => {
    setShowLoginPopup(false)
  };
  const successLoginPopup = () => {
    setShowLoginPopup(false)
    window.location.reload();
  };
  const closeRegisterPopup = () => {
    setShowRegisterPopup(false)
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">Evidence Chain App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="entities">Entities</Nav.Link>
            <Nav.Link as={Link} to="evidences">Evidences</Nav.Link>
          </Nav>
          {tokenData == null && (<Button sx={{m: "0.5rem"}} onClick={openLoginPopup}> Login </Button>)}
          {tokenData == null && (<Button sx={{m: "0.5rem"}} onClick={openRegisterPopup}> Register </Button>)}
          <LoginComponent show={showLoginPopup} onClose={closeLoginPopup} onSuccess = {successLoginPopup} drizzleContext = {drizzleContext}/>
          <RegisterComponent show={showRegisterPopup} onClose={closeRegisterPopup} onSuccess = {closeRegisterPopup} drizzleContext = {drizzleContext}/>
          <Header drizzle={drizzle} drizzleState={drizzleState} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavBar;