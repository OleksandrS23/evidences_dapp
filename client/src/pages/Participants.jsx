import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import {Container, Row, Col} from "react-bootstrap";
import ParticipantsCard from "../components/ParticipantsCard";

const { AccountData, ContractData, ContractForm } = newContextComponents;

function Participants({ drizzleContext }) {
  const { drizzle, drizzleState } = drizzleContext;
  return (
    <Container>
      <Row>
        <Col className="mb-5"></Col>
      </Row>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract= {drizzle.contracts.EvidenceChain.contractName}
        method= "getParticipants"
        render={(participantsData, loading) => {
          if (!loading && participantsData) {
            return <ParticipantsCard ParticipantsData={participantsData} />;
          }
        }}
      />
    </Container>
  );
}

export default Participants;
