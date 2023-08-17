import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { newContextComponents } from "@drizzle/react-components";
import { drizzleReactHooks } from '@drizzle/react-plugin'

const { AccountData, ContractData, ContractForm } = newContextComponents;

function AddEvidence({ show, onClose , drizzleContext}) {
  const { drizzle, drizzleState } = drizzleContext;

  const [formData, setFormData] = useState({ /* Initialize your form fields here */ });


  const handleSubmit = (event) => {
    event.preventDefault();
    const contractInstance = drizzle.contracts.EvidenceChain;
    const methodArgs = [formData.evidenceUniqueCode, formData.evidenceName, formData.evidenceType];
    const stackId = contractInstance.methods.addEvidence.cacheSend(...methodArgs)
    setFormData({});
    onClose();
  };

  
    //    .send({ from: drizzleState.accounts[0] })
    //    .then((result) => {
    //      // Handle successful transaction
    //      console.log('Transaction successful', result);
        
    //      
    //    })
    //    .catch((error) => {
    //      // Handle transaction error
    //      console.error('Transaction error', error);
    //    });
    
    //

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Evidence</Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <Form onSubmit={handleSubmit}>
          <Form.Group className="mt-1" controlId="evidence.evidenceUniqueCode">
            <Form.Label>Unique Code</Form.Label>
            <Form.Control
              type="text"
              name= "evidenceUniqueCode"
              placeholder="EvidenceId1"
              value={formData.evidenceUniqueCode}
              onChange={handleChange}
            />
          </Form.Group>
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

      {/* <ContractForm
              drizzle={drizzle}
              drizzleState={drizzleState}
              contract={drizzle.contracts.EvidenceChain.contractName}
              method="addEvidence"
            //   sendArgs={{ from: drizzleState.accounts[0] }}
            />  */}
        
        

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

export default AddEvidence;

/*<Form onSubmit={handleSubmit}>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Group>
        </Form>
        */