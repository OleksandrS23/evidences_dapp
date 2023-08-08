import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ParticipantsCard from "../components/ParticipantsCard";

const { AccountData, ContractData, ContractForm } = newContextComponents;

function Participants(props) {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Participants</h2>
        </Col>
      </Row>
        <ContractData
          drizzle={props.drizzle}
          drizzleState={props.drizzleState}
          contract="EvidenceChain"
          method="getParticipants"
          render={(participantsData) => {
            if (participantsData != null && participantsData != undefined) {
              console.log(participantsData);
                return (<ParticipantsCard ParticipantsData = {participantsData}/>)
            }
          }}
        />
    </Container>
  );
}

export default Participants;
