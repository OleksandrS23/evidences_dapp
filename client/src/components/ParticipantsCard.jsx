import React from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
                {console.log(participant)}
           </Card>
           </Col >
          ))}
        
      </Row>
    );
  }

  export default ParticipantsCard;