import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { newContextComponents } from "@drizzle/react-components";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import FileComponent from "./FileComponent";

const { ContractData } = newContextComponents;

function TimeLineEvidence(props) {
  const { evidence, connector, drizzleContext} = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [evidenceData, setEvidenceData] = useState({});

  useEffect(() => {
    if (evidence) {
      const date = new Date(evidence.timestamp * 1000);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      setEvidenceData({
        evidenceUniqueCode: evidence.uniqueCode,
        evidenceCaseNo: evidence.caseNo,
        evidenceClassification: evidence.classification,
        date: formattedDateTime,
        evidenceOwner: evidence.owner.name,
        evidenceOwnerType: evidence.owner.entityType,
        evidenceType: evidence.eType,
        evidenceFiles: evidence.uFilesCodes,
        observations: evidence.observations
      });
    }
    //console.log(evidenceData.evidenceFiles)
  }, [evidence.timestamp]);

  return (
    <TimelineItem>
      <TimelineOppositeContent color="textSecondary">
        {evidenceData.date}
        <br/>
        <p>Observations:</p>
        {evidenceData.observations}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        {connector && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Card style={{ width: "auto" }}>
          <Card.Header>{evidence.name}</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              Case No: {evidenceData.evidenceCaseNo}
            </ListGroup.Item>
            <ListGroup.Item>
              Classification: {evidenceData.evidenceClassification}
            </ListGroup.Item>
            <ListGroup.Item>
              {evidenceData.evidenceOwner} <br /> Type:{" "}
              {evidenceData.evidenceOwnerType}
            </ListGroup.Item>
            <ListGroup.Item>
              Type: {evidenceData.evidenceType}
            </ListGroup.Item>
            {evidenceData.evidenceFiles?.length > 0 && (<ListGroup.Item>
              File: {evidenceData.evidenceFiles.map(ev=> {
                return (
                <ContractData
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contract= {drizzle.contracts.EvidenceChain.contractName}
                  method= "getFileInfo"
                  methodArgs = {[evidenceData.evidenceUniqueCode,ev]}
                  render={(fileInfo, loading) => {
                    if (!loading && fileInfo) {
                      //console.log(fileInfo)
                      return <FileComponent fileInfo = {fileInfo} />
                    }
                  }}
                />

                //<p>{ev}</p>
                
                )
                
                })}
            </ListGroup.Item>)}
          </ListGroup>
        </Card>
      </TimelineContent>
    </TimelineItem>
  );
}

export default TimeLineEvidence;
