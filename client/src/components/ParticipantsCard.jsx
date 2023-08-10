import React from "react";
import {Card, Row, Col, ListGroup} from 'react-bootstrap';

function ParticipantsCard(props) {
    return (
      <Row>
        {props.ParticipantsData.map((participant, index)=>
          (
            <Col md="auto" className = "mb-2">
            <Card style={{ width: '18rem' }}>
              <Card.Header>{participant.userName}</Card.Header>
                <ListGroup variant="flush">
                  < ListGroup.Item>{participant.participantType}</ListGroup.Item>
                  <ListGroup.Item>{participant.participantAddress}</ListGroup.Item>
                </ListGroup>
           </Card>
           </Col >
          ))}
        
      </Row>
    );
  }

  export default ParticipantsCard;