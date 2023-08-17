import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { newContextComponents } from "@drizzle/react-components";
import { drizzleReactHooks } from '@drizzle/react-plugin'

const { AccountData, ContractData, ContractForm } = newContextComponents;

function EditEvidence({ show, onClose , drizzleContext, data}) {
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({
        evidenceUniqueCode: data?.evidenceUniqueCode, 
        evidenceName: data?.evidenceName, 
        evidenceType: data?.evidenceType});

   useEffect(() => {
            if (data) {
              setFormData({
                evidenceUniqueCode: data.evidenceUniqueCode,
                evidenceName: data.evidenceName,
                evidenceType: data.evidenceType
              });
            }
          }, [data])


  const handleSubmit = (event) => {
    event.preventDefault();
    const contractInstance = drizzle.contracts.EvidenceChain;
    const methodArgs = [formData.evidenceUniqueCode, formData.evidenceName, formData.evidenceType];
    const stackId = contractInstance.methods.addEvidence.cacheSend(...methodArgs)
    setFormData({});
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
    if (!data){}
    else{
        return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Evidence: {formData.evidenceUniqueCode}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <Form onSubmit={handleSubmit}>
          <Form.Group className="mt-1" controlId="evidence.evidenceName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name= "evidenceName"
              placeholder="Evidence Name"
              value={formData.evidenceName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mt-1" controlId="evidence.evidenceType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              type="text"
              name= "evidenceType"
              placeholder="File"
              value={formData.evidenceType}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
        }
}

export default EditEvidence;