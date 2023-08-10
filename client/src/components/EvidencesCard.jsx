import React from "react";
import {Card, Row, Col, ListGroup} from 'react-bootstrap';

function EvidencesCard(props) {
    return (
      <Row>
        {props.EvidencesData.map((evidence, index)=>
          (
            <Col md="auto" className = "mb-2">
            <Card style={{ width: '18rem' }}>
              <Card.Header>{evidence.evidenceName}</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Unique Code: {evidence.evidenceUniqueCode}</ListGroup.Item>
                  <ListGroup.Item>Owner: {evidence.evidenceOwner}</ListGroup.Item>
                  <ListGroup.Item>Evidence Type: {evidence.evidenceType}</ListGroup.Item>
                </ListGroup>
           </Card>
           </Col >
          ))}
        
      </Row>
    );
  }

  export default EvidencesCard;