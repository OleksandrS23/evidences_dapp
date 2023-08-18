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

function TimeLineEvidence(props) {
  const { evidence, connector } = props;

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
        date: formattedDateTime,
        evidenceOwner: evidence.owner.name,
        evidenceOwnerType: evidence.owner.entityType,
        evidenceType: evidence.eType,
      });
    }
  }, [evidence.timestamp]);

  return (
    <TimelineItem>
      <TimelineOppositeContent color="textSecondary">
        {evidenceData.date}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        {connector && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Card style={{ width: "18rem" }}>
          <Card.Header>{evidence.name}</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              Unique Code: {evidenceData.evidenceUniqueCode}
            </ListGroup.Item>
            <ListGroup.Item>
              {" "}
              {evidenceData.evidenceOwner} <br /> Type:{" "}
              {evidenceData.evidenceOwnerType}
            </ListGroup.Item>
            <ListGroup.Item>
              Evidence Type: {evidenceData.evidenceType}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </TimelineContent>
    </TimelineItem>
  );
}

export default TimeLineEvidence;