import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import {Container, Row, Col} from "react-bootstrap";
import EntitiesCard from "../components/EntitiesCard";

const { ContractData } = newContextComponents;

function Entities(props) {
  const { drizzleContext } = props;
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
        method= "getEntities"
        render={(entitiesData, loading) => {
          if (!loading && entitiesData) {
            //console.log(entitiesData)
            return <EntitiesCard EntitiesData={entitiesData} drizzleContext={drizzleContext} />;
          }
        }}
      />
    </Container>
  );
}

export default Entities;
