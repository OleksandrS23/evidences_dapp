import React, { useState } from 'react';
import { newContextComponents } from "@drizzle/react-components";
import {Row, Col, Button, Container} from "react-bootstrap";
import AddEvidence from '../components/Evidences/AddEvidence';
import EvidencesTable from '../components/Evidences/EvidencesTable';

const { AccountData, ContractData, ContractForm } = newContextComponents;

function Evidences({ drizzleContext }) {
  const { drizzle, drizzleState } = drizzleContext;

  const accountAddress = drizzleState.accounts[0];

  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);
  return (
    <Container fluid className="p-3">
      <Row>
        <Col className="mb-3">
          <Button onClick={openPopup} variant="outline-success">Add Evidence</Button>{' '}
          <AddEvidence show={showPopup} onClose={closePopup} drizzleContext = {drizzleContext} />
        </Col>
      </Row>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract= {drizzle.contracts.EvidenceChain.contractName}
        method="getEvidences"
        render={(evidencesData, loading) => {
          if (!loading && evidencesData) {
            return <EvidencesTable EvidencesData = {evidencesData} drizzleContext = {drizzleContext} />;
          }
        }}
      />
    </Container>
  );
}

export default Evidences;