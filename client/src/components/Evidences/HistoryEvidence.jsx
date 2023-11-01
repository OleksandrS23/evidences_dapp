import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { newContextComponents } from "@drizzle/react-components";
import {Timeline} from "@mui/lab";
import {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimeLineEvidence from "./TimeLineEvidence";

const { ContractData } = newContextComponents;

function HistoryEvidence(props) {
  const { show, onClose, drizzleContext, data } = props;
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({
    evidenceUniqueCode: data?.uniqueCode,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        evidenceUniqueCode: data.uniqueCode,
      });
    }
  }, [data]);

  const onCloseModal = () => {
    setFormData({});
    onClose();
  };

  if (!data && !formData.uniqueCode) {

  } else {
    return (
      <Modal show={show} onHide={onCloseModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>History: {formData.evidenceUniqueCode}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
              },
            }}
          >

        {formData.evidenceUniqueCode &&(<ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract= {drizzle.contracts.EvidenceChain.contractName}
        method= "getEvidenceHistory"
        methodArgs = {[formData.evidenceUniqueCode]}
        render={(evidencesData, loading) => {
          if (!loading && evidencesData) {
            //console.log(evidencesData)
            return evidencesData.map((evidence, index)=>{
              //console.log(evidence)
                var last = index == evidencesData.length - 1? true: false
                return <TimeLineEvidence evidence={evidence} connector={!last} drizzleContext = {drizzleContext}/>;
            })
          }
        }}
      />)}
          </Timeline>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default HistoryEvidence;
