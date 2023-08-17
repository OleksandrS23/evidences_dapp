import React, { useState, useEffect } from 'react';
import { Card, ListGroup} from 'react-bootstrap';
import { newContextComponents } from "@drizzle/react-components";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

function TimeLineEvidence(props) {
const {evidence, connector} = props

const [evidenceData, setEvidenceData] = useState({});

useEffect(() => {
    const date= new Date(evidence.timestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    if (evidence) {
        setEvidenceData({
        evidenceUniqueCode: evidence.evidenceUniqueCode,
        date: formattedDateTime,
        evidenceOwner: evidence.evidenceOwner.name,
        evidenceOwnerType: evidence.evidenceOwner.entityType,
        evidenceType: evidence.entityType
      });
    }
  }, [evidenceData]);

return (
    <TimelineItem>
    <TimelineOppositeContent color="textSecondary">
      {evidenceData.date}
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot />
      {connector && 
      (<TimelineConnector />)}
    </TimelineSeparator>
    <TimelineContent>
        
    <Card style={{ width: '18rem' }}>
              <Card.Header>{evidence.evidenceName}</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Unique Code: {evidenceData.evidenceUniqueCode}</ListGroup.Item>
                  <ListGroup.Item> <div> Owner: {evidenceData.evidenceOwner}</div> <div>Type: {evidenceData.evidenceOwnerType}</div></ListGroup.Item>
                  <ListGroup.Item>Evidence Type: {evidenceData.evidenceType}</ListGroup.Item>
                </ListGroup>
    </Card>
        
    </TimelineContent>
  </TimelineItem>
)
}

export default TimeLineEvidence;