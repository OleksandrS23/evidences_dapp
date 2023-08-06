import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Header from './Header';

function MyNavBar(props) {
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">Evicence Chain App</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link as={Link} to="participants">Participants</Nav.Link>
              <Nav.Link as={Link} to="evidences">Evidences</Nav.Link>
            </Nav>
            <Header drizzle={props.drizzle} drizzleState={props.drizzleState}/>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

export default MyNavBar;